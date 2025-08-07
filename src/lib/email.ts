import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendSignupEmails({
  toUser,
  adminEmail,
  userName,
}: {
  toUser: string;
  adminEmail: string;
  userName: string;
}) {
  // Welcome email to user
  await transporter.sendMail({
    from: `"MedData Support" <${process.env.SMTP_USER}>`,
    to: toUser,
    subject: `Welcome to MedData, ${userName}!`,
    html: `<p>Hi ${userName},<br/>Thank you for signing up to MedData. We're excited to have you onboard!</p>`,
  });

  // Notification email to admin
  await transporter.sendMail({
    from: `"MedData System" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `🔔 New User Signup: ${userName}`,
    html: `<p>A new user <strong>${userName}</strong> has signed up with email: ${toUser}</p>`,
  });
}
