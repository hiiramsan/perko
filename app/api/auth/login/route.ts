import { NextResponse } from 'next/server';
import { createSupabaseAdminClient, setSessionCookie, signSessionToken } from '@/lib/server/auth-route-utils';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Credenciales incompletas.' }, { status: 400 });
    }

    const supabaseAdmin = createSupabaseAdminClient();

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role, name, custom_password_hash')
      .eq('email', email)
      .maybeSingle();

    if (profileError || !profile || !profile.custom_password_hash) {
      return NextResponse.json({ error: 'Credenciales invalidas.' }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, profile.custom_password_hash);
    if (!validPassword) {
      return NextResponse.json({ error: 'Credenciales invalidas.' }, { status: 401 });
    }

    const customSessionToken = await signSessionToken({
      id: profile.id,
      email: profile.email,
      role: profile.role,
      name: profile.name,
    });

    const response = NextResponse.json({ success: true, role: profile.role });
    setSessionCookie(response, customSessionToken);

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
