import dotenv from 'dotenv'
dotenv.config()

export const env = {
  PORT: process.env.PORT,
  DB_URI: process.env.DB_URI,
  TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  COOKIE_EXPIRE: process.env.COOKIE_EXPIRE,
  SMTP_SERVICE: process.env.SMTP_SERVICE,
  SMTP_MAIL: process.env.SMTP_MAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
}
