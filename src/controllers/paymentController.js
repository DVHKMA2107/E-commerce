import catchAsyncError from "../middlewares/catchAsyncError.js"
import { env } from "../config/environment.js"
import Stripe from "stripe"

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export const processPayment = catchAsyncError(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    metadata: {
      company: "Ecommerce",
    },
  })

  res.status(200).json({
    success: true,
    client_secret: myPayment.client_secret,
  })
})

export const sendStripeApiKey = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: env.STRIPE_API_KEY,
  })
})
