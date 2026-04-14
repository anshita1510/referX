import nodemailer from 'nodemailer';

function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

export async function sendVerificationEmail(toEmail: string, token: string) {
    const verifyUrl = `${process.env.API_URL || 'http://localhost:5000'}/api/auth/verify-email/${token}`;

    console.log('[email] SMTP config:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        passSet: !!process.env.SMTP_PASS,
    });
    console.log('[email] Sending verification to:', toEmail);
    console.log('[email] Verify URL:', verifyUrl);

    const transporter = createTransporter();

    const info = await transporter.sendMail({
        from: `"ReferX" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: 'Verify your ReferX account',
        html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
                <h2 style="color:#1e293b;margin-bottom:8px;">Welcome to ReferX 👋</h2>
                <p style="color:#475569;margin-bottom:24px;">
                    Thanks for signing up. Click the button below to verify your email address and activate your account.
                </p>
                <a href="${verifyUrl}"
                   style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;">
                    Verify Email
                </a>
                <p style="color:#94a3b8;font-size:12px;margin-top:24px;">
                    If you didn't create an account, you can safely ignore this email.<br/>
                    This link expires in 24 hours.
                </p>
            </div>
        `,
    });

    console.log('[email] Sent successfully. MessageId:', info.messageId);
}
