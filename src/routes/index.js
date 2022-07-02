import express from 'express';
import { productRoute } from './productRoute.js';

const router = express.Router();

router.use('/products', productRoute);

export const apiV1 = router;
