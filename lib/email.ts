import nodemailer from 'nodemailer';

// Create transporter with graceful fallback for development when SMTP credentials are absent.
let mailer: nodemailer.Transporter;
const hasSmtpCreds = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

if (hasSmtpCreds) {
  mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SMTP credentials (SMTP_USER/SMTP_PASS) are required in production.');
  }
  // Development fallback: JSON transport that doesn't actually deliver emails,
  // but allows the app to continue and makes the message available in logs.
  console.warn('SMTP_USER/SMTP_PASS not set – using jsonTransport fallback (development only).');
  mailer = nodemailer.createTransport({ jsonTransport: true } as any);
}

export async function sendVerificationEmail(to: string, fullName: string, verifyUrl: string) {
  const firstName = fullName ? String(fullName).split(' ')[0] : '';

  const mailOptions = {
    from: hasSmtpCreds ? `"Perko" <${process.env.SMTP_USER}>` : '"Perko (dev)" <no-reply@perko.local>',
    to,
    subject: `Activa tu cuenta en Perko, ${firstName}`,
    text: `Hola ${firstName},\n\nGracias por registrarte en Perko. Abre el siguiente enlace para activar tu cuenta:\n${verifyUrl}\n\nEste enlace expira en 1 hora. Si no solicitaste este correo, ignóralo.`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; padding: 28px; color: #1f2937; background: #f8fafc;">
        <div style="max-width:600px;margin:0 auto;background:white;padding:24px;border-radius:12px;border:1px solid #e6eef5;text-align:left;">
          <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px;font-weight:700;">Hola ${firstName},</h2>
          <p style="color:#475569;margin:0 0 16px;font-size:14px;line-height:1.45;">Gracias por crear una cuenta en Perko. Para activar tu cuenta, haz clic en el botón de abajo. El enlace expira en 1 hora.</p>
          <div style="text-align:center;margin:20px 0;">
            <a href="${verifyUrl}" style="display:inline-block;padding:12px 22px;background:#2A9D8F;color:white;border-radius:10px;text-decoration:none;font-weight:600;">Verificar mi cuenta</a>
          </div>
          <p style="color:#94a3b8;font-size:12px;margin:0;">Si no puedes hacer click, copia y pega esta URL en tu navegador:</p>
          <p style="word-break:break-all;color:#475569;font-size:12px;margin:6px 0 0">${verifyUrl}</p>
          <hr style="border:none;border-top:1px solid #eef2f7;margin:18px 0;" />
          <p style="color:#94a3b8;font-size:12px;margin:0;">Si no solicitaste este correo, puedes ignorarlo. Este enlace expirará en 1 hora.</p>
        </div>
      </div>
    `,
  };

  // In development, also log the URL to console for easy testing/debugging
  if (!hasSmtpCreds) {
    console.info('DEV EMAIL (verification link):', verifyUrl);
  }

  try {
    const result = await mailer.sendMail(mailOptions);
    // Log transporter result to help debugging delivery issues
    console.info('sendVerificationEmail result:', result && (result as any).accepted ? { accepted: (result as any).accepted, rejected: (result as any).rejected } : result);
    return result;
  } catch (err) {
    console.error('sendVerificationEmail failed:', err);
    throw err;
  }
}
