import express from "express"
import { productRoute } from "./productRoute.js"
import { userRoute } from "./userRoute.js"
import { orderRoute } from "./orderRoute.js"
import { paymentRoute } from "./paymentRoute.js"

const router = express.Router()

router.use("/", productRoute)
router.use("/", userRoute)
router.use("/", orderRoute)
router.use("/", paymentRoute)

export const apiV1 = router
