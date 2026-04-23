import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkRole } from '../middleware/checkRole.js';
import { listPendingEngineers, setEngineerVerification } from '../controllers/admin-engineer.controller.js';

const router = Router();

router.use(verifyToken, checkRole('admin'));

router.get('/engineers/pending', listPendingEngineers);
router.patch('/engineers/:userId/verification', setEngineerVerification);

export default router;
