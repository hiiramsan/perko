import nodemailer from 'nodemailer';

// Creamos un "transportador" de correo utilizando los datos de entorno SMTP
// Para pruebas puedes usar Gmail, Outlook, Amazon SES, o cualquier servicio SMTP
export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com', // Ej: smtp.office365.com para Outlook
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true para el puerto 465, false para otros
  auth: {
    user: process.env.SMTP_USER, // Tu correo real
    pass: process.env.SMTP_PASS, // Tu contraseña (o contraseña de aplicación)
  },
});

export async function sendVerificationEmail(to: string, fullName: string, verifyUrl: string) {
  const mailOptions = {
    from: `"Perko" <${process.env.SMTP_USER}>`, // Remitente
    to, // Destinatario
    subject: 'Verifica tu cuenta en Perko',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2A9D8F;">¡Hola ${fullName}!</h2>
        <p>Gracias por registrarte. Por seguridad, necesitamos verificar que este correo te pertenece.</p>
        <p>Haz clic en el siguiente enlace para activar tu cuenta de inmediato:</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 20px; background-color: #2A9D8F; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Verificar mi cuenta</a>
        <p style="margin-top: 20px; font-size: 12px; color: #777;">Si no lo solicitaste, ignora este correo. El enlace expira en 1 hora.</p>
      </div>
    `,
  };

  // Enviamos el correo
  await mailer.sendMail(mailOptions);
}
