import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Credenciales incompletas.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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

    const customSessionToken = await new SignJWT({
      id: profile.id,
      email: profile.email,
      role: profile.role,
      name: profile.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true, role: profile.role });
    response.cookies.set('perko_session', customSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
