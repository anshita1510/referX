import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkRole } from '../middleware/checkRole.js';
import { upload } from '../config/upload.js';
import { register, login, getMe, getCandidates, updateProfile, uploadResume } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.get('/candidates', verifyToken, getCandidates);
router.put('/profile', verifyToken, updateProfile);
router.post('/upload-resume', verifyToken, checkRole('candidate'), upload.single('resume'), uploadResume);

export default router;
