import express from 'express'
import {
  getAllProducts,
  createProduct,
  getProductDetail,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
} from '../controllers/productController.js'
import { isAuthenticated, authorizeRole } from '../middlewares/auth.js'

const router = express.Router()

router.route('/products').get(getAllProducts)

router
  .route('/admin/product/new')
  .post(isAuthenticated, authorizeRole('admin'), createProduct)

router
  .route('/admin/product/:id')
  .put(isAuthenticated, authorizeRole('admin'), updateProduct)
  .delete(isAuthenticated, authorizeRole('admin'), deleteProduct)

router.route('/product/:id').get(getProductDetail)

router
  .route('/reviews')
  .get(getProductReviews)
  .delete(isAuthenticated, deleteReview)

router.route('/review').put(isAuthenticated, createProductReview)

export const productRoute = router
