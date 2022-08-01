import express from 'express'

import {
  userRegister,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetail,
  updatePassword,
  updateUserProfile,
  getSingleUser,
  getAllUser,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js'
import { authorizeRole, isAuthenticated } from '../middlewares/auth.js'

const router = express.Router()

router.route('/register').post(userRegister)

router.route('/login').post(loginUser)

router.route('/password/forgot').post(forgotPassword)

router.route('/password/reset/:token').put(resetPassword)

router.route('/logout').get(logoutUser)

router.route('/me').get(isAuthenticated, getUserDetail)

router.route('/me/update').put(isAuthenticated, updateUserProfile)

router.route('/password/update').put(isAuthenticated, updatePassword)

router
  .route('/admin/users')
  .get(isAuthenticated, authorizeRole('admin'), getAllUser)

router
  .route('/admin/user/:id')
  .get(isAuthenticated, authorizeRole('admin'), getSingleUser)
  .put(isAuthenticated, authorizeRole('admin'), updateUserRole)
  .delete(isAuthenticated, authorizeRole('admin'), deleteUser)

export const userRoute = router
