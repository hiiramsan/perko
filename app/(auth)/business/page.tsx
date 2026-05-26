'use client';

import AuthPageShell from '../components/AuthPageShell';
import RegisterForm from '../components/RegisterForm';

export default function BusinessRegisterPage() {
  return (
    <AuthPageShell
      title="REGISTRATE"
      subtitle="EMPIEZA A CREAR TU PROGRAMA DE LEALTAD"
      footerText="¿Tu negocio ya tiene cuenta?"
      footerHref="/login"
      footerLinkLabel="INICIA SESIÓN"
      googleIntent="register"
      googleRole="admin"
    >
      <RegisterForm role="admin" successRedirect="/onboarding" />
    </AuthPageShell>
  );
}