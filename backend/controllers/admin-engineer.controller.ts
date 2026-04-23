import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { computeTrustScore } from '../services/engineer-trust.service.js';
import { computeBadges } from '../services/engineer-badges.service.js';

export const listPendingEngineers = async (_req: Request, res: Response) => {
    try {
        const rows = await prisma.engineerProfile.findMany({
            where: { admin_verification_status: 'pending' },
            include: { user: { select: { id: true, email: true, name: true, phone: true, phone_verified: true } } },
            orderBy: { submitted_for_review_at: 'asc' },
        });
        res.json(rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const setEngineerVerification = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        const status = String(req.body?.status ?? '');
        if (!Number.isFinite(userId)) return res.status(400).json({ error: 'Invalid user id' });
        if (status !== 'approved' && status !== 'rejected') return res.status(400).json({ error: 'status must be approved or rejected' });

        const user = await prisma.user.findUnique({ where: { id: userId }, include: { engineer_profile: true } });
        if (!user || user.role !== 'engineer' || !user.engineer_profile) {
            return res.status(404).json({ error: 'Engineer not found' });
        }

        const verified = status === 'approved';
        const admin_verification_status = status;

        const updatedProfile = await prisma.engineerProfile.update({
            where: { user_id: userId },
            data: {
                verified,
                admin_verification_status,
                ...(status === 'rejected'
                    ? {
                          onboarding_wizard_completed: false,
                          submitted_for_review_at: null,
                          badges: [],
                          trust_score: 0,
                      }
                    : {}),
                updated_at: new Date(),
            },
        });

        const trust_score = computeTrustScore(user, updatedProfile as any);
        const badges = computeBadges({ ...updatedProfile, verified } as any);

        const final = await prisma.engineerProfile.update({
            where: { user_id: userId },
            data: { trust_score, badges },
        });

        res.json({ engineer_profile: final });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
