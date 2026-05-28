import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import { jwtVerify, SignJWT } from 'jose';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get('token');
  
  if (!token) {
    return NextResponse.redirect(`${origin}/login?error=invalid-token`);
  }

  try {
    // 1. Desencriptar y validar el token (expira en 1 hora, asegura que los datos no fueron manipulados)
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const { email, password, fullName, role } = payload as Record<string, string>;

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2. Hacer el hash seguro de la contraseña ahora que el correo fue validado
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Insertar el usuario en la base de datos de forma segura
    const { data: newProfile, error: dbError } = await supabaseAdmin
      .from('profiles')
      .insert([
        { 
          id: crypto.randomUUID(),
          email, 
          name: fullName, 
          role: role,
          custom_password_hash: hashedPassword
        }
      ])
      .select()
      .single();

    if (dbError) {
      if (dbError.code === '23505') {
        return NextResponse.redirect(`${origin}/login?error=already-registered`);
      }
      console.error("Error inserting verified user", dbError);
      return NextResponse.redirect(`${origin}/login?error=db-error`);
    }

    // 4. Autenticarlo automáticamente creando la sesión final (Perko Session)
    const customSessionToken = await new SignJWT({
      id: newProfile.id,
      email: newProfile.email,
      role: newProfile.role,
      name: newProfile.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    // 5. Redireccionarlo a su destino correspondiente según su rol
    const targetUrl = role === 'admin' ? `${origin}/onboarding` : `${origin}/cartera`;
    const response = NextResponse.redirect(targetUrl);
    
    response.cookies.set('perko_session', customSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;

  } catch (err) {
    console.error("Token verification failed", err);
    return NextResponse.redirect(`${origin}/login?error=expired-token`);
  }
}
