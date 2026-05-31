'use client';

import AuthPageShell from '../components/AuthPageShell';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthPageShell
      title="CREA TU CUENTA"
      subtitle="Registrate para empezar a usar Perko"
      footerText="¿Ya tienes cuenta?"
      footerHref="/login"
      footerLinkLabel="INICIA SESIÓN"
      googleIntent="register"
      googleRole="customer"
    >
      <RegisterForm role="customer" />
    </AuthPageShell>
  );
}