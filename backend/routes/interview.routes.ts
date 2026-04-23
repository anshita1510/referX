import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkRole } from '../middleware/checkRole.js';
import { getInterviews, bookInterview, updateInterviewStatus } from '../controllers/interview.controller.js';
import { requireVerifiedEngineerForInterviews } from '../middleware/requireVerifiedEngineer.js';

const router = Router();

router.get('/', verifyToken, getInterviews);
router.post('/', verifyToken, checkRole('candidate'), bookInterview);
router.patch('/:id', verifyToken, checkRole('engineer'), requireVerifiedEngineerForInterviews, updateInterviewStatus);

export default router;
