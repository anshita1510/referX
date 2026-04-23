import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkRole } from '../middleware/checkRole.js';
import { upload } from '../config/upload.js';
import {
    getOnboardingState,
    patchOnboarding,
    submitForReview,
    sendAccountEmailOtp,
    verifyAccountEmailOtp,
    sendPhoneOtp,
    verifyPhoneOtp,
    sendCompanyEmailOtp,
    verifyCompanyEmailOtp,
    uploadProof,
    getDashboardSummary,
} from '../controllers/engineer-onboarding.controller.js';

const router = Router();

router.use(verifyToken, checkRole('engineer'));

router.get('/onboarding', getOnboardingState);
router.patch('/onboarding', patchOnboarding);
router.post('/onboarding/submit', submitForReview);
router.post('/onboarding/otp/account-email/send', sendAccountEmailOtp);
router.post('/onboarding/otp/account-email/verify', verifyAccountEmailOtp);
router.post('/onboarding/otp/phone/send', sendPhoneOtp);
router.post('/onboarding/otp/phone/verify', verifyPhoneOtp);
router.post('/onboarding/otp/company-email/send', sendCompanyEmailOtp);
router.post('/onboarding/otp/company-email/verify', verifyCompanyEmailOtp);
router.post('/onboarding/proof', upload.single('proof'), uploadProof);
router.get('/dashboard-summary', getDashboardSummary);

export default router;
