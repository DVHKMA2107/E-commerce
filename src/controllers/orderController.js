import { OrderModel } from '../models/orderModel.js'
import { ProductModel } from '../models/productModel.js'
import catchAsyncError from '../middlewares/catchAsyncError.js'
import ErrorHander from '../utils/errorHander.js'

// Create New Order
export const newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  const order = await OrderModel.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  })

  res.status(201).json({
    success: true,
    order,
  })
})

// Get Single Order
export const getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (!order) {
    return next(new ErrorHander('Order not found with this Id', 404))
  }

  res.status(200).json({
    success: true,
    order,
  })
})

// Get Logged in User Orders
export const myOrders = catchAsyncError(async (req, res, next) => {
  const myOrders = await OrderModel.find({ user: req.user._id })

  res.status(200).json({
    success: true,
    myOrders,
  })
})

// Get All Order -- Admin
export const getAllOrder = catchAsyncError(async (req, res, next) => {
  const orders = await OrderModel.find()

  let totalAmount = 0

  orders.forEach((order) => (totalAmount += order.totalPrice))

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  })
})

//Update Order Status -- Admin
export const updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id)

  if (!order) {
    return next(new ErrorHander('Order not found with this Id'), 404)
  }

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHander('You have already delivered this order', 400))
  }

  order.orderItems.forEach(async (order) => {
    await updateStock(order.product, order.quantity)
  })

  order.orderStatus = req.body.status

  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now()
  }

  await order.save({ validateBeforeSave: false })

  res.status(200).json({
    success: true,
  })
})

const updateStock = async (productId, quantity) => {
  const product = await ProductModel.findById(productId)

  product.Stock -= quantity

  await product.save({ validateBeforeSave: false })
}

// Delete Order
export const deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id)

  if (!order) {
    return next(new ErrorHander('Order not found with this Id', 404))
  }

  await order.remove()

  res.status(200).json({
    success: true,
  })
})
