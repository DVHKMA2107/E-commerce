import express from 'express'
import { productRoute } from './productRoute.js'
import { userRoute } from './userRoute.js'
import { orderRoute } from './orderRoute.js'

const router = express.Router()

router.use('/', productRoute)
router.use('/', userRoute)
router.use('/', orderRoute)

export const apiV1 = router
