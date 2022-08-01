import express from 'express'
import {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrder,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController.js'
import { isAuthenticated, authorizeRole } from '../middlewares/auth.js'

const router = express.Router()

router.route('/order/new').post(isAuthenticated, newOrder)

router.route('/order/:id').get(isAuthenticated, getSingleOrder)

router.route('/orders/me').get(isAuthenticated, myOrders)

router
  .route('/admin/orders')
  .get(isAuthenticated, authorizeRole('admin'), getAllOrder)

router
  .route('/admin/order/:id')
  .put(isAuthenticated, authorizeRole('admin'), updateOrder)
  .delete(isAuthenticated, authorizeRole('admin'), deleteOrder)

export const orderRoute = router
