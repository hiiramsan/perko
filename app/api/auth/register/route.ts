import { NextResponse } from 'next/server';
import { createSupabaseAdminClient, signSessionToken } from '@/lib/server/auth-route-utils';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email, password, fullName, role } = await request.json();

    const supabaseAdmin = createSupabaseAdminClient();

    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json({ error: 'Este correo ya está registrado.' }, { status: 400 });
    }

    const verificationToken = await signSessionToken({
      email,
      password,
      fullName,
      role,
    }, '1h');

    const baseUrl = new URL(request.url).origin;
    const verifyUrl = `${baseUrl}/api/auth/verify?token=${verificationToken}`;

    await sendVerificationEmail(email, fullName, verifyUrl);

    return NextResponse.json({ success: true, message: 'Verification email sent' });

  } catch (err: any) {
    console.error('Error in register route:', err);
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}