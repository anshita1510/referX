import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkRole } from '../middleware/checkRole.js';
import { upload } from '../config/upload.js';
import { uploadDocuments, getDocuments } from '../controllers/document.controller.js';

const router = Router();

router.get('/', verifyToken, getDocuments);
router.post('/', verifyToken, checkRole('candidate'),
    upload.fields([
        { name: 'offer_letter', maxCount: 1 },
        { name: 'joining_letter', maxCount: 1 },
        { name: 'salary_slip', maxCount: 1 },
    ]),
    uploadDocuments
);

export default router;
