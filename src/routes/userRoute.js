import express from 'express'

import {
  userRegister,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from '../controllers/userController.js'

const router = express.Router()

router.route('/register').post(userRegister)

router.route('/login').post(loginUser)

router.route('/password/forgot').post(forgotPassword)

router.route('/password/reset/:token').put(resetPassword)

router.route('/logout').get(logoutUser)

export const userRoute = router
