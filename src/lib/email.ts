import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT!),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVerificationEmail(email: string, passcode: string) {
  await transporter.sendMail({
    from: `PIKASO ${process.env.FROM_EMAIL}`,
    to: email,
    subject: 'Verify your email',
    html: `<p>Your verification code is: <strong>${passcode}</strong></p>`,
  })
}

export async function sendPasswordResetEmail(email: string, passcode: string) {
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Reset your password',
    html: `<p>Your password reset code is: <strong>${passcode}</strong></p>`,
  })
}