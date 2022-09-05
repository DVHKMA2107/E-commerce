import { ProductModel } from "../models/productModel.js"
import ErrorHander from "../utils/errorHander.js"
import catchAsyncError from "../middlewares/catchAsyncError.js"
import ApiFeatures from "../utils/apiFeature.js"
import cloudinary from "cloudinary"

// create product
export const createProduct = catchAsyncError(async (req, res, next) => {
  let images = []

  if (typeof req.body.images === "string") {
    images.push(req.body.images)
  } else {
    images = req.body.images
  }

  const imageLinks = []
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    })

    imageLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    })
  }

  req.body.images = imageLinks
  req.body.user = req.user.id
  const product = await ProductModel.create(req.body)
  res.status(200).json({
    success: true,
    product,
  })
})

// get all product

export const getAllProducts = catchAsyncError(async (req, res, next) => {
  // return next(new ErrorHander("This is temp error", 404))
  const resultPerPage = 8
  const productCount = await ProductModel.countDocuments()
  // Query if you don't pass a callback function or .then or await, just return a query
  const apiFeature = new ApiFeatures(ProductModel.find(), req.query)
    .search()
    .filter()

  let products = await apiFeature.query

  let filteredProductsCount = products.length

  apiFeature.pagination(resultPerPage)

  products = await apiFeature.query.clone()

  res.status(200).json({
    success: true,
    products,
    productCount,
    filteredProductsCount,
    resultPerPage,
  })
})

// get product list (Admin)

export const getProductList = catchAsyncError(async (req, res, next) => {
  const products = await ProductModel.find()

  res.status(200).json({
    success: true,
    products,
  })
})

//get detail product
export const getProductDetail = catchAsyncError(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id)

  if (!product) {
    return next(new ErrorHander("Product not found", 404))
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
    return next(new ErrorHander("Product not found", 404))
  }

  let images = []

  if (typeof req.body.images === "string") {
    images.push(req.body.images)
  } else {
    images = req.body.images
  }

  if (images !== undefined) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    const imageLinks = []

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      })

      imageLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      })
    }

    req.body.images = imageLinks
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
    return next(new ErrorHander("Product not found", 404))
  }

  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id)
  }

  await product.remove()

  res.status(200).json({
    success: true,
    message: "product remove success",
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
    return next(new ErrorHander("Product not found", 404))
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
    return next(new ErrorHander("Product not found", 404))
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
