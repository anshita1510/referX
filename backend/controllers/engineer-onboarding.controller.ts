import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { z } from 'zod';
import { encryptPaymentPayload } from '../services/encryption.service.js';
import { createOtpChallenge, verifyOtpChallenge } from '../services/otp.service.js';
import { sendOnboardingOtpEmail } from '../services/email.service.js';
import { computeTrustScore } from '../services/engineer-trust.service.js';
import { computeBadges } from '../services/engineer-badges.service.js';
import { companyDomainMatchesCompany } from '../lib/company-email.js';
import { engineerCanRefer } from '../lib/engineer-access.js';

const linkedinUrl = z
    .string()
    .url()
    .refine((u) => /linkedin\.com/i.test(new URL(u).hostname), 'Must be a LinkedIn profile URL');

const experienceBand = z.enum(['0-1', '1-3', '3-5', '5+']);
const interviewTypeEnum = z.enum(['MCQ', 'Coding', 'System Design', 'HR']);
const paymentMethodEnum = z.enum(['UPI', 'bank_transfer']);

const timeSlotSchema = z.object({
    day: z.string().min(1).max(32),
    start: z.string().min(1).max(16),
    end: z.string().min(1).max(16),
});

const patchSchema = z.object({
    step: z.number().int().min(0).max(7).optional(),
    full_name: z.string().min(2).max(120).optional(),
    phone: z.string().min(8).max(32).optional(),
    company: z.string().min(1).max(255).optional(),
    designation: z.string().min(1).max(255).optional(),
    experience_band: experienceBand.optional(),
    skills: z.array(z.string().min(1).max(64)).max(40).optional(),
    location: z.string().min(1).max(255).optional(),
    linkedin: linkedinUrl.optional(),
    company_email: z.string().email().max(255).optional(),
    proof_document_url: z.string().url().optional().nullable(),
    can_refer_in_company: z.boolean().optional(),
    referral_companies: z.array(z.string().min(1).max(120)).max(50).optional(),
    max_referrals_per_month: z.number().int().min(0).max(500).optional(),
    can_mock_interviews: z.boolean().optional(),
    interview_types: z.array(interviewTypeEnum).max(10).optional(),
    interview_experience_notes: z.string().max(2000).optional().nullable(),
    hours_per_week: z.number().int().min(0).max(80).optional(),
    preferred_time_slots: z.array(timeSlotSchema).max(21).optional(),
    payment_method: paymentMethodEnum.optional(),
    payment_details: z
        .object({
            upi_id: z.string().max(128).optional(),
            account_holder: z.string().max(255).optional(),
            bank_name: z.string().max(255).optional(),
            account_number: z.string().max(64).optional(),
            ifsc: z.string().max(32).optional(),
        })
        .optional(),
    terms_accepted: z.boolean().optional(),
    referral_policy_accepted: z.boolean().optional(),
});

async function ensureEngineerProfile(userId: number) {
    return prisma.engineerProfile.upsert({
        where: { user_id: userId },
        update: {},
        create: { user_id: userId },
    });
}

function profileCompletionPct(p: Awaited<ReturnType<typeof prisma.engineerProfile.findUnique>>, u: { phone_verified: boolean; name: string | null }) {
    if (!p) return 0;
    let done = 0;
    const total = 14;
    if (u.name && u.name.length >= 2) done++;
    if (u.phone_verified) done++;
    if (p.company) done++;
    if (p.designation) done++;
    if (p.experience_band || (p.experience_years != null && p.experience_years > 0)) done++;
    if ((p.skills?.length ?? 0) > 0) done++;
    if (p.location) done++;
    if (p.linkedin) done++;
    if (p.company_email && p.company_email_verified) done++;
    if (p.max_referrals_per_month != null) done++;
    if (p.hours_per_week != null) done++;
    if ((p.preferred_time_slots as unknown[])?.length) done++;
    if (p.payment_method && p.payment_details_encrypted) done++;
    if (p.terms_accepted_at) done++;
    if (p.referral_policy_accepted_at) done++;
    return Math.round((done / total) * 100);
}

export const getOnboardingState = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id as number;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { engineer_profile: true },
        });
        if (!user || user.role !== 'engineer') return res.status(403).json({ error: 'Engineer access only' });

        const p = user.engineer_profile ?? (await ensureEngineerProfile(userId));
        const trust_score = computeTrustScore(user, p as any);
        const badges = computeBadges(p as any);

        const { payment_details_encrypted: _enc, ...safeProfile } = p as any;

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                phone_verified: user.phone_verified,
            },
            engineer_profile: {
                ...safeProfile,
                has_payment_on_file: !!p.payment_details_encrypted,
            },
            trust_score,
            badges,
            profile_completion_pct: profileCompletionPct(p, user),
            can_refer: engineerCanRefer(p),
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const patchOnboarding = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id as number;
        const user = await prisma.user.findUnique({ where: { id: userId }, include: { engineer_profile: true } });
        if (!user || user.role !== 'engineer') return res.status(403).json({ error: 'Engineer access only' });
        if (user.engineer_profile?.admin_verification_status === 'pending') {
            return res.status(400).json({ error: 'Profile is under admin review; updates are locked until a decision is made.' });
        }

        const parsed = patchSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

        const body = parsed.data;
        let profile = user.engineer_profile ?? (await ensureEngineerProfile(userId));

        if (body.full_name != null) {
            await prisma.user.update({ where: { id: userId }, data: { name: body.full_name } });
        }

        const userUpdates: { phone?: string } = {};
        if (body.phone != null) {
            const normalized = body.phone.replace(/\s/g, '');
            const taken = await prisma.user.findFirst({ where: { phone: normalized, NOT: { id: userId } } });
            if (taken) return res.status(409).json({ error: 'This phone number is already registered.' });
            userUpdates.phone = normalized;
        }

        if (Object.keys(userUpdates).length) {
            await prisma.user.update({ where: { id: userId }, data: userUpdates });
        }

        const epData: Record<string, unknown> = {};
        if (body.company != null) epData.company = body.company;
        if (body.designation != null) epData.designation = body.designation;
        if (body.experience_band != null) {
            epData.experience_band = body.experience_band;
            const yMap: Record<string, number> = { '0-1': 0, '1-3': 2, '3-5': 4, '5+': 6 };
            epData.experience_years = yMap[body.experience_band] ?? 0;
        }
        if (body.skills != null) epData.skills = body.skills;
        if (body.location != null) epData.location = body.location;
        if (body.linkedin != null) epData.linkedin = body.linkedin;
        if (body.company_email != null) {
            epData.company_email = body.company_email.trim().toLowerCase();
            epData.company_email_verified = false;
        }
        if (body.proof_document_url !== undefined) epData.proof_document_url = body.proof_document_url;
        if (body.can_refer_in_company != null) epData.can_refer_in_company = body.can_refer_in_company;
        if (body.referral_companies != null) epData.referral_companies = body.referral_companies;
        if (body.max_referrals_per_month != null) epData.max_referrals_per_month = body.max_referrals_per_month;
        if (body.can_mock_interviews != null) epData.can_mock_interviews = body.can_mock_interviews;
        if (body.interview_types != null) epData.interview_types = body.interview_types;
        if (body.interview_experience_notes !== undefined) epData.interview_experience_notes = body.interview_experience_notes;
        if (body.hours_per_week != null) epData.hours_per_week = body.hours_per_week;
        if (body.preferred_time_slots != null) epData.preferred_time_slots = body.preferred_time_slots as object;

        if (body.terms_accepted === true) epData.terms_accepted_at = new Date();
        if (body.referral_policy_accepted === true) epData.referral_policy_accepted_at = new Date();

        if (body.payment_method != null) epData.payment_method = body.payment_method;
        if (body.payment_details && body.payment_method) {
            try {
                epData.payment_details_encrypted = encryptPaymentPayload({
                    method: body.payment_method,
                    ...body.payment_details,
                });
            } catch (e: any) {
                return res.status(500).json({ error: e?.message ?? 'Payment encryption misconfigured' });
            }
        }

        const nextStep = body.step != null ? Math.max(profile.onboarding_step ?? 0, body.step) : profile.onboarding_step;
        epData.onboarding_step = nextStep;
        epData.onboarding_draft = { ...(profile.onboarding_draft as object), last_saved: new Date().toISOString(), step: nextStep };
        epData.updated_at = new Date();

        profile = await prisma.engineerProfile.update({
            where: { user_id: userId },
            data: epData as any,
        });

        const freshUser = await prisma.user.findUnique({ where: { id: userId } });
        const trust_score = computeTrustScore(freshUser!, profile as any);
        await prisma.engineerProfile.update({
            where: { user_id: userId },
            data: { trust_score },
        });

        const { payment_details_encrypted: _x, ...safe } = profile as any;
        res.json({
            engineer_profile: { ...safe, has_payment_on_file: !!profile.payment_details_encrypted },
            trust_score,
            profile_completion_pct: profileCompletionPct(profile, freshUser!),
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const submitForReview = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id as number;
        const user = await prisma.user.findUnique({ where: { id: userId }, include: { engineer_profile: true } });
        if (!user || user.role !== 'engineer') return res.status(403).json({ error: 'Engineer access only' });
        const p = user.engineer_profile ?? (await ensureEngineerProfile(userId));

        if (p.admin_verification_status === 'pending') {
            return res.status(400).json({ error: 'Your application is already pending admin review.' });
        }
        if (p.verified && p.admin_verification_status === 'approved') {
            return res.status(400).json({ error: 'You are already verified.' });
        }

        const errors: string[] = [];
        if (!user.name || user.name.length < 2) errors.push('Full name is required');
        if (!user.phone_verified) errors.push('Phone must be verified with OTP');
        if (!p.primary_email_otp_verified) errors.push('Account email must be verified with OTP');
        if (!p.company || !p.designation) errors.push('Company and job title are required');
        if (!p.experience_band && (p.experience_years == null || p.experience_years < 0)) errors.push('Experience is required');
        if (!(p.skills?.length)) errors.push('Select at least one skill');
        if (!p.location) errors.push('Location is required');
        if (!p.linkedin) errors.push('LinkedIn URL is required');
        if (!p.company_email || !p.company_email_verified) errors.push('Company email must be provided and verified');
        if (p.company_email && p.company && !companyDomainMatchesCompany(p.company, p.company_email)) {
            errors.push('Company email domain should match your stated company');
        }
        if (p.max_referrals_per_month == null) errors.push('Max referrals per month is required');
        if (p.hours_per_week == null) errors.push('Availability (hours per week) is required');
        if (!p.preferred_time_slots || !(p.preferred_time_slots as unknown[]).length) errors.push('Add at least one preferred time slot');
        if (!p.payment_method || !p.payment_details_encrypted) errors.push('Payment setup is required');
        if (!p.terms_accepted_at || !p.referral_policy_accepted_at) errors.push('Terms and referral policy must be accepted');

        if (errors.length) return res.status(400).json({ error: 'Incomplete onboarding', details: errors });

        const trust_score = computeTrustScore(user, p as any);
        const badges = computeBadges({ ...p, verified: false } as any);

        const updated = await prisma.engineerProfile.update({
            where: { user_id: userId },
            data: {
                onboarding_wizard_completed: true,
                onboarding_step: 7,
                admin_verification_status: 'pending',
                submitted_for_review_at: new Date(),
                trust_score,
                badges,
                updated_at: new Date(),
            },
        });

        res.json({
            message: 'Submitted for admin verification. You will get full referral access once approved.',
            engineer_profile: updated,
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const sendAccountEmailOtp = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id as number;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== 'engineer') return res.status(403).json({ error: 'Engineer access only' });

        const { plainCode } = await createOtpChallenge({
            userId,
            channel: 'email',
            target: user.email,
            purpose: 'engineer_primary_email',
        });
        await sendOnboardingOtpEmail(user.email, plainCode, 'Your ReferX engineer verification code');
        res.json({ message: 'OTP sent to your account email.' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const verifyAccountEmailOtp = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id as number;
        const code = String(req.body?.code ?? '');
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== 'engineer') return res.status(403).json({ error: 'Engineer access only' });

        const ok = await verifyOtpChallenge({
            userId,
            target: user.email,
            purpose: 'engineer_primary_email',
            code,
        });
        if (!ok) return res.status(400).json({ error: 'Invalid or expired OTP' });

        await prisma.engineerProfile.update({
            where: { user_id: userId },
            data: { primary_email_otp_verified: true, updated_at: new Date() },
        });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const sendPhoneOtp = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id as number;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== 'engineer') return res.status(403).json({ error: 'Engineer access only' });
        if (!user.phone) return res.status(400).json({ error: 'Save a phone number in onboarding first' });

        const { plainCode } = await createOtpChallenge({
            userId,
            channel: 'sms',
            target: user.phone,
            purpose: 'engineer_phone',
        });
        console.warn(`[sms] Engineer phone OTP for ${user.phone}: ${plainCode} (connect SMS provider in production)`);
        res.json({ message: 'OTP sent (see server logs if SMS is not configured).' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const verifyPhoneOtp = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id as number;
        const code = String(req.body?.code ?? '');
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== 'engineer') return res.status(403).json({ error: 'Engineer access only' });
        if (!user.phone) return res.status(400).json({ error: 'No phone on file' });

        const ok = await verifyOtpChallenge({
            userId,
            target: user.phone,
            purpose: 'engineer_phone',
            code,
        });
        if (!ok) return res.status(400).json({ error: 'Invalid or expired OTP' });

        await prisma.user.update({ where: { id: userId }, data: { phone_verified: true } });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const sendCompanyEmailOtp = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id as number;
        const user = await prisma.user.findUnique({ where: { id: userId }, include: { engineer_profile: true } });
        if (!user || user.role !== 'engineer') return res.status(403).json({ error: 'Engineer access only' });
        const ce = user.engineer_profile?.company_email;
        if (!ce) return res.status(400).json({ error: 'Save company email in onboarding first' });
        if (user.engineer_profile?.company && !companyDomainMatchesCompany(user.engineer_profile.company, ce)) {
            return res.status(400).json({ error: 'Company email domain does not match your stated company' });
        }

        const { plainCode } = await createOtpChallenge({
            userId,
            channel: 'email',
            target: ce,
            purpose: 'engineer_company_email',
        });
        await sendOnboardingOtpEmail(ce, plainCode, 'Verify your work email — ReferX');
        res.json({ message: `OTP sent to ${ce}` });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const verifyCompanyEmailOtp = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id as number;
        const code = String(req.body?.code ?? '');
        const user = await prisma.user.findUnique({ where: { id: userId }, include: { engineer_profile: true } });
        if (!user || user.role !== 'engineer') return res.status(403).json({ error: 'Engineer access only' });
        const ce = user.engineer_profile?.company_email;
        if (!ce) return res.status(400).json({ error: 'No company email on file' });

        const ok = await verifyOtpChallenge({
            userId,
            target: ce,
            purpose: 'engineer_company_email',
            code,
        });
        if (!ok) return res.status(400).json({ error: 'Invalid or expired OTP' });

        await prisma.engineerProfile.update({
            where: { user_id: userId },
            data: { company_email_verified: true, updated_at: new Date() },
        });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const uploadProof = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id as number;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== 'engineer') return res.status(403).json({ error: 'Engineer access only' });
        const file = (req as any).file as { path?: string } | undefined;
        if (!file?.path) return res.status(400).json({ error: 'No file uploaded' });

        const normalized = file.path.replace(/\\/g, '/');
        const publicPath = normalized.startsWith('uploads/') ? `/${normalized}` : `/uploads/${normalized.split('/').pop()}`;
        await prisma.engineerProfile.update({
            where: { user_id: userId },
            data: { proof_document_url: publicPath, updated_at: new Date() },
        });
        res.json({ url: publicPath });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getDashboardSummary = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id as number;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { engineer_profile: true },
        });
        if (!user || user.role !== 'engineer') return res.status(403).json({ error: 'Engineer access only' });
        const p = user.engineer_profile ?? (await ensureEngineerProfile(userId));

        const [referrals, payments, candidates] = await Promise.all([
            prisma.referral.findMany({ where: { engineer_id: userId } }),
            prisma.payment.findMany({ where: { engineer_id: userId } }),
            prisma.user.count({ where: { role: 'candidate' } }),
        ]);

        const pendingReferrals = referrals.filter((r) => r.status === 'pending').length;
        const successfulHires = referrals.filter((r) => r.status === 'hired').length;
        const accepted = referrals.filter((r) => r.status === 'accepted' || r.status === 'hired').length;
        const successRate = referrals.length ? Math.round((accepted / referrals.length) * 100) : 0;

        let earnings = 0;
        for (const pay of payments) {
            if (pay.status === 'paid') earnings += Number(pay.amount);
        }

        res.json({
            profile_completion_pct: profileCompletionPct(p, user),
            trust_score: p.trust_score,
            badges: p.badges,
            verified: p.verified,
            admin_verification_status: p.admin_verification_status,
            candidates_available: candidates,
            pending_referral_requests: pendingReferrals,
            earnings_summary: earnings,
            referral_success_rate: successRate,
            successful_hires: successfulHires,
            can_refer: engineerCanRefer(p),
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
