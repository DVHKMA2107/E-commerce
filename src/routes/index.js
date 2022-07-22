import express from 'express'
import { productRoute } from './productRoute.js'
import { userRoute } from './userRoute.js'

const router = express.Router()

router.use('/products', productRoute)
router.use('/user', userRoute)

export const apiV1 = router
