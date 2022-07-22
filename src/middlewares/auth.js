import ErrorHander from '../utils/errorHander.js'
import catchAsyncError from '../middlewares/catchAsyncError.js'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/userModel.js'
import { env } from '../config/environment.js'

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies

  if (!token) {
    return next(new ErrorHander('Please login to access this resource!', 401))
  }

  const decodeData = jwt.verify(token, env.TOKEN_SECRET_KEY)

  req.user = await UserModel.findById(decodeData.id)
  next()
})

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resouce`,
          403
        )
      )
    }

    next()
  }
}
