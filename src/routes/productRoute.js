import express from 'express'
import {
  getAllProducts,
  createProduct,
  getProductDetail,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'

const router = express.Router()

router.route('/').get(getAllProducts)

router.route('/new').post(createProduct)

router
  .route('/:id')
  .put(updateProduct)
  .delete(deleteProduct)
  .get(getProductDetail)

export const productRoute = router
