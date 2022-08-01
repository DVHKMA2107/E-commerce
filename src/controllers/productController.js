import { ProductModel } from '../models/productModel.js'
import ErrorHander from '../utils/errorHander.js'
import catchAsyncError from '../middlewares/catchAsyncError.js'
import ApiFeatures from '../utils/apiFeature.js'

// create product
export const createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id
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

// Create New Review Or Update Reivew
export const createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body

  const review = {
    user: req.user._id,
    name: req.user.name,
    comment,
    rating: Number(rating),
  }

  const product = await ProductModel.findById(productId)

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  )

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        ;(rev.rating = rating), (rev.comment = comment)
      }
    })
  } else {
    product.reviews.push(review)
    product.numOfReviews = product.reviews.length
  }
  let avg = 0
  product.rating =
    product.reviews.reduce(
      (prevValue, curValue) => curValue.rating + prevValue,
      avg
    ) / product.reviews.length

  await product.save({ validateBeforeSave: false })

  res.status(200).json({
    success: true,
  })
})

//Get all Reviews of a product
export const getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await ProductModel.findById(req.query.productId)

  if (!product) {
    return next(new ErrorHander('Product not found', 404))
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  })
})

//Delete Review
export const deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await ProductModel.findById(req.query.productId)

  if (!product) {
    return next(new ErrorHander('Product not found', 404))
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  )

  let avg = 0
  let rating = 0
  if (reviews.length !== 0) {
    rating =
      reviews.reduce(
        (prevValue, curValue) => curValue.rating + prevValue,
        avg
      ) / reviews.length
  }

  const numOfReviews = reviews.length

  await ProductModel.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      numOfReviews,
      rating,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  )

  res.status(200).json({
    success: true,
  })
})
