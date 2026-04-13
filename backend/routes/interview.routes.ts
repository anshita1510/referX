import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkRole } from '../middleware/checkRole.js';
import { getInterviews, bookInterview, updateInterviewStatus } from '../controllers/interview.controller.js';

const router = Router();

router.get('/', verifyToken, getInterviews);
router.post('/', verifyToken, checkRole('candidate'), bookInterview);
router.patch('/:id', verifyToken, checkRole('engineer'), updateInterviewStatus);

export default router;
