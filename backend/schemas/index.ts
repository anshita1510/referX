import { z } from 'zod';

export const registerSchema = z.object({
    role: z.enum(['candidate', 'engineer', 'company']),
    name: z.string().min(2).max(100),
});

export const jobSchema = z.object({
    title: z.string().min(3).max(255),
    description: z.string().min(10),
    location: z.string().optional(),
    salary_range: z.string().optional(),
    skills_required: z.array(z.string()).optional(),
});

export const referralSchema = z.object({
    candidateId: z.string().min(1),
    jobId: z.string().min(1),
    note: z.string().max(500).optional(),
    message: z.string().max(500).optional(),
});

export const referralStatusSchema = z.object({
    status: z.enum(['pending', 'accepted', 'rejected', 'hired']),
});

export const jobStatusSchema = z.object({
    status: z.enum(['active', 'closed', 'draft']),
});

export const interviewSchema = z.object({
    engineerId: z.string().min(1),
    scheduledAt: z.string().datetime(),
    notes: z.string().max(500).optional(),
});

export const paymentVerifySchema = z.object({
    amount: z.number().positive(),
    type: z.enum(['job_posting', 'mock_interview', 'premium', 'referral_reward']),
    transaction_id: z.string().min(1),
    referral_id: z.string().optional(),
    engineer_id: z.string().optional(),
});
