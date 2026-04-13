import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { validate } from '../middleware/validate.js';
import { paymentVerifySchema } from '../schemas/index.js';
import { getPayments, createOrder, verifyPayment } from '../controllers/payment.controller.js';

const router = Router();

router.get('/', verifyToken, getPayments);
router.post('/create-order', verifyToken, createOrder);
router.post('/verify', verifyToken, validate(paymentVerifySchema), verifyPayment);

export default router;
