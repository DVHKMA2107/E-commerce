import express from 'express'
import {
  getAllProducts,
  createProduct,
  getProductDetail,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { isAuthenticated, authorizeRole } from '../middlewares/auth.js'

const router = express.Router()

router.route('/').get(getAllProducts)

router
  .route('/new')
  .post(isAuthenticated, authorizeRole('admin'), createProduct)

router
  .route('/:id')
  .put(isAuthenticated, authorizeRole('admin'), updateProduct)
  .delete(isAuthenticated, authorizeRole('admin'), deleteProduct)
  .get(getProductDetail)

export const productRoute = router
