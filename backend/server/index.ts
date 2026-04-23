import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';

import authRoutes from '../routes/auth.routes.js';
import jobRoutes from '../routes/job.routes.js';
import referralRoutes from '../routes/referral.routes.js';
import interviewRoutes from '../routes/interview.routes.js';
import paymentRoutes from '../routes/payment.routes.js';
import documentRoutes from '../routes/document.routes.js';
import engineerRoutes from '../routes/engineer.routes.js';
import adminRoutes from '../routes/admin.routes.js';
import { errorHandler } from '../middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }));

app.use('/uploads', express.static(path.resolve('uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/engineers', engineerRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use(errorHandler);

app.listen(PORT, () => console.log(`ReferX API running on port ${PORT}`));
