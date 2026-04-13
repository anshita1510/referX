import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkRole } from '../middleware/checkRole.js';
import { validate } from '../middleware/validate.js';
import { referralSchema, referralStatusSchema } from '../schemas/index.js';
import { getReferrals, createReferral, updateReferralStatus } from '../controllers/referral.controller.js';

const router = Router();

router.get('/', verifyToken, getReferrals);
router.post('/', verifyToken, checkRole('engineer'), validate(referralSchema), createReferral);
router.patch('/:id/status', verifyToken, checkRole('engineer', 'company', 'admin'), validate(referralStatusSchema), updateReferralStatus);

export default router;
