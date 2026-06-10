import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient, setSessionCookie, signSessionToken } from '@/lib/server/auth-route-utils';
import crypto from 'crypto';
import { autoAffiliateCustomer } from '@/lib/server/affiliate';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get('token');
  
  const joinBusinessSlug = request.cookies.get('perko_join_business_slug')?.value;
  
  if (!token) {
    return NextResponse.redirect(`${origin}/login?error=invalid-token`);
  }

  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const supabaseAdmin = createSupabaseAdminClient();

    // Find a matching, unused, unexpired verification token
    const { data: tokenRow } = await supabaseAdmin
      .from('email_verification_tokens')
      .select('*')
      .eq('token_hash', tokenHash)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (!tokenRow) {
      return NextResponse.redirect(`${origin}/login?error=invalid-or-expired-token`);
    }

    // Prevent creating duplicate profiles for the same email
    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role, name')
      .eq('email', tokenRow.email)
      .maybeSingle();

    if (existing) {
      // mark token used to avoid reuse
      await supabaseAdmin
        .from('email_verification_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('id', tokenRow.id);

      return NextResponse.redirect(`${origin}/login?error=already-registered`);
    }

    // Insert the new profile using the stored hashed password
    const { data: newProfile, error: dbError } = await supabaseAdmin
      .from('profiles')
      .insert([
        {
          id: crypto.randomUUID(),
          email: tokenRow.email,
          name: tokenRow.full_name,
          role: tokenRow.role,
          custom_password_hash: tokenRow.password_hash,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Error inserting verified user', dbError);
      return NextResponse.redirect(`${origin}/login?error=db-error`);
    }

    // Mark token as used
    await supabaseAdmin
      .from('email_verification_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', tokenRow.id);

    // If the user came from scanning a business QR, affiliate them
    if (newProfile && newProfile.role === 'customer' && joinBusinessSlug) {
      await autoAffiliateCustomer(supabaseAdmin, newProfile.id, joinBusinessSlug);
    }

    const customSessionToken = await signSessionToken({
      id: newProfile.id,
      email: newProfile.email,
      role: newProfile.role,
      name: newProfile.name,
    });

    const targetUrl = newProfile.role === 'admin' ? `${origin}/onboarding` : `${origin}/cartera`;
    const response = NextResponse.redirect(targetUrl);

    setSessionCookie(response, customSessionToken);

    if (joinBusinessSlug) {
      response.cookies.set('perko_join_business_slug', '', { maxAge: 0, path: '/' });
    }

    return response;
  } catch (err) {
    console.error('Token verification failed', err);
    return NextResponse.redirect(`${origin}/login?error=expired-token`);
  }
}