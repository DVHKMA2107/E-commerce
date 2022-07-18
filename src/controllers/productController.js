import { ProductModel } from '../models/productModel.js'
import ErrorHander from '../utils/errorHander.js'
import catchAsyncError from '../middlewares/catchAsyncError.js'
import ApiFeatures from '../utils/apiFeature.js'

// create product
export const createProduct = catchAsyncError(async (req, res, next) => {
  const product = await ProductModel.create(req.body)
  res.status(200).json({
    success: true,
    product,
  })
})

// get all product

export const getAllProducts = catchAsyncError(async (req, res) => {
  const resultPerPage = 5
  const productCount = await ProductModel.countDocuments()
  // Query if you don't pass a callback function or .then or await, just return a query
  const apiFeature = new ApiFeatures(ProductModel.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage)

  const products = await apiFeature.query

  res.status(200).json({
    success: true,
    products,
    productCount,
  })
})

//get detail product
export const getProductDetail = catchAsyncError(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id)

  if (!product) {
    return next(new ErrorHander('Product not found', 404))
  }

  res.status(200).json({
    success: true,
    product,
  })
})

// update product

export const updateProduct = catchAsyncError(async (req, res) => {
  let product = await ProductModel.findById(req.params.id)

  if (!product) {
    return next(new ErrorHander('Product not found', 404))
  }

  product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
    product,
  })
})

// delete product

export const deleteProduct = catchAsyncError(async (req, res) => {
  const product = await ProductModel.findById(req.params.id)

  if (!product) {
    return next(new ErrorHander('Product not found', 404))
  }

  await product.remove()

  res.status(200).json({
    success: true,
    message: 'product remove success',
  })
})
