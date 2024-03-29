import crypto from "crypto"
import cloudinary from "cloudinary"
import ErrorHander from "../utils/errorHander.js"
import catchAsyncError from "../middlewares/catchAsyncError.js"
import { env } from "../config/environment.js"
import { UserModel } from "../models/userModel.js"
import { sendToken } from "../utils/jwtToken.js"
import { sendEmail } from "../utils/sendEmail.js"

// User Register
export const userRegister = catchAsyncError(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folders: "avatars",
    width: 150,
    crop: "scale",
  })

  const { name, email, password } = req.body

  const user = await UserModel.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  })

  sendToken(201, user, res)
})

// Login User
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorHander("Please enter email & password", 400))
  }

  const user = await UserModel.findOne({ email }).select("+password")

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401))
  }

  const isPasswordMatched = await user.comparePassword(password)

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401))
  }

  sendToken(200, user, res)
})

export const logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: "Logout",
  })
})

// Forgot Password
export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorHander("User not found", 404))
  }

  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  const resetPasswordUrl = `${env.FRONT_END_URL}/api/v1/password/reset/${resetToken}`

  const message = `Your password reset token is: - \n\n${resetPasswordUrl} \n\nIf you not requested this email then, please ignore it.`

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecomerce Password Recovery`,
      message,
    })

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorHander(error.message, 500))
  }
})

// Reset Pasword
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

  const user = await UserModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    )
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHander("Password does not match confirm Password", 400)
    )
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  sendToken(200, user, res)
})

// Get User Detail
export const getUserDetail = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.findById(req.user.id)

  res.status(200).json({
    success: true,
    user,
  })
})

// Update Password
export const updatePassword = catchAsyncError(async (req, res, next) => {
  let user = await UserModel.findById(req.user.id).select("+password")

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

  if (!isPasswordMatched) {
    return next(new ErrorHander("Old password is incorrect", 400))
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not match", 400))
  }

  user.password = req.body.newPassword

  await user.save()

  sendToken(200, user, res)
})

// Update User Profile
export const updateUserProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  }

  if (req.body.avatar !== "") {
    const user = await UserModel.findById(req.user._id)

    const imageId = user.avatar.public_id

    await cloudinary.v2.uploader.destroy(imageId)

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    })

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    }
  }

  const user = await UserModel.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
  })
})

// Get All User -- Admin
export const getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await UserModel.find()

  res.status(200).json({
    success: true,
    users,
  })
})

//Get Single User
export const getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id)

  if (!user) {
    return next(new ErrorHander(`User does not exit with id: ${req.params.id}`))
  }

  res.status(200).json({
    success: true,
    user,
  })
})

// Update User Role
export const updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    email: req.body.email,
    name: req.body.name,
    role: req.body.role,
  }

  await UserModel.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
  })
})

// Delete User -- Admin
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id)

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`)
    )
  }

  const imageId = user.avatar.public_id

  await cloudinary.v2.uploader.destroy(imageId)

  await user.remove()

  res.status(200).json({
    success: true,
    message: "Delete User successfully",
  })
})
