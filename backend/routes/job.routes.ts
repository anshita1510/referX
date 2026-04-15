import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkRole } from '../middleware/checkRole.js';
import { validate } from '../middleware/validate.js';
import { jobSchema, jobStatusSchema } from '../schemas/index.js';
import { getJobs, getJobById, createJob, updateJobStatus, getMyApplications, applyToJob, withdrawApplication } from '../controllers/job.controller.js';

const router = Router();

router.get('/', verifyToken, getJobs);
router.get('/my-applications', verifyToken, checkRole('candidate'), getMyApplications);
router.post('/:id/apply', verifyToken, checkRole('candidate'), applyToJob);
router.delete('/:id/apply', verifyToken, checkRole('candidate'), withdrawApplication);
router.get('/:id', verifyToken, getJobById);
router.post('/', verifyToken, checkRole('company'), validate(jobSchema), createJob);
router.patch('/:id/status', verifyToken, checkRole('company', 'admin'), validate(jobStatusSchema), updateJobStatus);

export default router;
