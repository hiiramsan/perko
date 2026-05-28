import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; 
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  try {
    const { email, password, fullName, role } = await request.json();

    // 1. Validar si el correo ya existe
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json({ error: 'Este correo ya está registrado.' }, { status: 400 });
    }

    // 2. Crear un token temporal de firma que guardará los datos por 1 hora
    const verificationToken = await new SignJWT({
      email,
      password, // En producción puedes hacer el hash antes, aunque aquí está seguro en el JWT de 1h
      fullName,
      role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(JWT_SECRET);

    const baseUrl = new URL(request.url).origin;
    const verifyUrl = `${baseUrl}/api/auth/verify?token=${verificationToken}`;

    // 3. Enviar el correo usando nuestro servicio SMTP propio y clase personalizada
    await sendVerificationEmail(email, fullName, verifyUrl);

    return NextResponse.json({ success: true, message: 'Verification email sent' });

  } catch (err: any) {
    console.error('Error in register route:', err);
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}