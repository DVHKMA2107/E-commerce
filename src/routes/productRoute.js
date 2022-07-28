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

router.route('/').get(getAllProducts)

router
  .route('/admin/new')
  .post(isAuthenticated, authorizeRole('admin'), createProduct)

router
  .route('/admin/:id')
  .put(isAuthenticated, authorizeRole('admin'), updateProduct)
  .delete(isAuthenticated, authorizeRole('admin'), deleteProduct)

router
  .route('/reviews')
  .get(getProductReviews)
  .delete(isAuthenticated, deleteReview)
router.route('/:id').get(getProductDetail)

router.route('/review').put(isAuthenticated, createProductReview)

export const productRoute = router
