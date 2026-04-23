import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { computeBadges } from '../services/engineer-badges.service.js';

export const getReferrals = async (req: Request, res: Response) => {
    try {
        const id = (req as any).user?.id;
        const role = (req as any).user?.role;

        const referrals = await prisma.referral.findMany({
            where: role === 'candidate' ? { candidate_id: id } : { engineer_id: id },
            include: {
                job: { select: { title: true, location: true } },
                candidate: { select: { name: true } },
                engineer: { select: { name: true } },
            },
            orderBy: { created_at: 'desc' },
        });
        res.json(referrals);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createReferral = async (req: Request, res: Response) => {
    try {
        const engineerId = (req as any).user?.id;
        const { candidateId, jobId, note, message } = req.body;
        const referral = await prisma.referral.create({
            data: {
                engineer_id: engineerId,
                candidate_id: candidateId as any,
                job_id: jobId as any,
                note: note ?? message ?? null,
            },
        });
        res.status(201).json(referral);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateReferralStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const id = Number(req.params.id);
        const prev = await prisma.referral.findUnique({ where: { id } });
        if (!prev) return res.status(404).json({ error: 'Referral not found' });

        const referral = await prisma.referral.update({
            where: { id },
            data: { status },
        });

        if (status === 'hired' && prev.status !== 'hired') {
            const ep = await prisma.engineerProfile.findUnique({ where: { user_id: prev.engineer_id } });
            if (ep) {
                const successful_hires_count = (ep.successful_hires_count ?? 0) + 1;
                const badges = computeBadges({ ...ep, successful_hires_count } as any);
                await prisma.engineerProfile.update({
                    where: { user_id: prev.engineer_id },
                    data: { successful_hires_count, badges },
                });
            }
        }

        res.json(referral);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
