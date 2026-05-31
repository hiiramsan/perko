import { createClient } from '@/lib/supabase/client';

export type RegisterRole = 'admin' | 'customer';

export type LoginInput = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type LoginResult =
  | { success: true; role: RegisterRole }
  | { success: false; error: string };

export type RegisterInput = {
  email: string;
  password: string;
  fullName: string;
  role: RegisterRole;
};

export type RegisterResult =
  | { success: true }
  | { success: false; error: string };

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return response.json();
}

function setSignupRoleCookie(role?: RegisterRole) {
  document.cookie = role
    ? `perko_signup_role=${role}; path=/; max-age=600; samesite=lax`
    : 'perko_signup_role=; path=/; max-age=0; samesite=lax';
}

export async function loginUser({ email, password, rememberMe }: LoginInput): Promise<LoginResult> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, rememberMe }),
  });

  const result = await response.json();

  if (!response.ok) {
    return { success: false, error: result.error || 'No pudimos iniciar sesion.' };
  }

  return { success: true, role: result.role };
}

export async function registerUser({ email, password, fullName, role }: RegisterInput): Promise<RegisterResult> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName, role }),
  });

  const result = await response.json();

  if (!response.ok) {
    return { success: false, error: result.error || 'Hubo un error en el registro.' };
  }

  return { success: true };
}

export async function startGoogleAuth({
  intent,
  role,
}: {
  intent?: 'login' | 'register';
  role?: RegisterRole;
}) {
  const supabase = createClient();
  const redirectUrl = new URL(`${window.location.origin}/callback`);

  setSignupRoleCookie(intent === 'register' ? role : undefined);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl.toString(),
    },
  });

  return { error };
}