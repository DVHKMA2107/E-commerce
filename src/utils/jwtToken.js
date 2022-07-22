import { env } from '../config/environment.js'

export const sendToken = (statusCode, user, res) => {
  const token = user.getJWTToken()

  // options for cookie
  const cookieOptions = {
    expires: new Date(Date.now() + env.COOKIE_EXPIRE * 24 * 60 * 60),
    httpOnly: true,
  }

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    user,
    token,
  })
}
