import nodeMailer from 'nodemailer'
import { env } from '../config/environment.js'

export const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    service: env.SMTP_SERVICE,
    auth: {
      user: env.SMTP_MAIL,
      pass: env.SMTP_PASSWORD,
    },
  })

  const mailOptions = {
    from: env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  await transporter.sendMail(mailOptions)
}
