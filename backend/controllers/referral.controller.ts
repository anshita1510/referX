import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

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
        const referral = await prisma.referral.update({
            where: { id: req.params.id as any },
            data: { status },
        });
        res.json(referral);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
