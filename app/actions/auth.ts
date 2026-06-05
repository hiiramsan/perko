'use server';

import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

const SESSION_COOKIE = 'perko_session';

const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function getSessionAction() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function loginAction(email: string, password: string, rememberMe: boolean) {
  if (!email || !password) {
    throw new Error('Credenciales incompletas.');
  }

  const supabaseAdmin = createSupabaseAdminClient();

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, email, role, name, custom_password_hash')
    .eq('email', email)
    .maybeSingle();

  if (profileError || !profile || !profile.custom_password_hash) {
    throw new Error('Credenciales invalidas.');
  }

  const validPassword = await bcrypt.compare(password, profile.custom_password_hash);
  if (!validPassword) {
    throw new Error('Credenciales invalidas.');
  }

  const token = await new SignJWT({
    id: profile.id,
    email: profile.email,
    role: profile.role,
    name: profile.name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(rememberMe ? '7d' : '1d')
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    ...sessionCookieOptions,
    maxAge: rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24,
  });

  return { success: true, role: profile.role };
}

export async function registerAction(
  email: string,
  password: string,
  fullName: string,
  role: string,
  origin: string,
) {
  const supabaseAdmin = createSupabaseAdminClient();

  const { data: existingUser } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existingUser) {
    throw new Error('Este correo ya está registrado.');
  }

  // Hash the password before storing in the verification table
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create a secure random token and store only its SHA-256 hash in DB
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString(); // 1 hour

  const { error: insertError } = await supabaseAdmin
    .from('email_verification_tokens')
    .insert([
      {
        email,
        password_hash: hashedPassword,
        full_name: fullName,
        role,
        token_hash: tokenHash,
        expires_at: expiresAt,
      },
    ]);

  if (insertError) {
    console.error('Error inserting verification token:', insertError);
    throw new Error('No se pudo iniciar el proceso de verificación.');
  }

  const verifyUrl = `${origin}/api/auth/verify?token=${token}`;

  // Log the verify URL and token hash on the server for debugging (do not expose in production logs)
  console.info('Verification generated for', email, { verifyUrl, tokenHash });

  try {
    await sendVerificationEmail(email, fullName, verifyUrl);
  } catch (err) {
    console.error('Failed to send verification email:', err);
    throw new Error('Error al enviar el correo de verificación.');
  }

  return { success: true, message: 'Verification email sent' };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, '', { maxAge: 0 });
  return { success: true };
}
