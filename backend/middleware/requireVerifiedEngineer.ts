import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { engineerCanRefer, engineerCanConductInterviews } from '../lib/engineer-access.js';

export async function requireVerifiedEngineerForReferrals(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.id as number;
        const profile = await prisma.engineerProfile.findUnique({ where: { user_id: userId } });
        if (!engineerCanRefer(profile)) {
            return res.status(403).json({
                error: 'Referrals are available after admin verification. Complete onboarding and wait for approval.',
            });
        }
        next();
    } catch (e: any) {
        res.status(500).json({ error: e?.message ?? String(e) });
    }
}

export async function requireVerifiedEngineerForInterviews(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.id as number;
        const profile = await prisma.engineerProfile.findUnique({ where: { user_id: userId } });
        if (!engineerCanConductInterviews(profile)) {
            return res.status(403).json({
                error: 'Mock interviews require a verified profile and interview capability enabled in onboarding.',
            });
        }
        next();
    } catch (e: any) {
        res.status(500).json({ error: e?.message ?? String(e) });
    }
}
