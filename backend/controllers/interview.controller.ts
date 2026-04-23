import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { engineerCanConductInterviews } from '../lib/engineer-access.js';
import { computeBadges } from '../services/engineer-badges.service.js';

export const getInterviews = async (req: Request, res: Response) => {
    try {
        const id = (req as any).user?.id;
        const role = (req as any).user?.role;

        const interviews = await prisma.interview.findMany({
            where: role === 'engineer' ? { engineer_id: id } : { candidate_id: id },
            include: {
                candidate: { select: { name: true } },
                engineer: { select: { name: true, engineer_profile: { select: { company: true, designation: true } } } },
            },
            orderBy: { scheduled_at: 'desc' },
        });
        res.json(interviews);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const bookInterview = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user?.id;
        const { engineerId, scheduledAt, notes } = req.body;
        const engineerProfile = await prisma.engineerProfile.findUnique({
            where: { user_id: Number(engineerId) },
        });
        if (!engineerCanConductInterviews(engineerProfile)) {
            return res.status(403).json({
                error: 'This engineer is not accepting mock interviews yet (onboarding or verification incomplete).',
            });
        }
        const interview = await prisma.interview.create({
            data: {
                candidate_id: candidateId as any,
                engineer_id: engineerId as any,
                scheduled_at: scheduledAt ? new Date(scheduledAt) : null,
                notes: notes ?? null,
            },
        });
        res.status(201).json(interview);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateInterviewStatus = async (req: Request, res: Response) => {
    try {
        const engineerId = (req as any).user?.id as number;
        const { status, feedback } = req.body;
        const existing = await prisma.interview.findFirst({
            where: { id: Number(req.params.id), engineer_id: engineerId },
            include: { engineer: { include: { engineer_profile: true } } },
        });
        if (!existing) return res.status(404).json({ error: 'Interview not found' });

        const interview = await prisma.interview.update({
            where: { id: existing.id },
            data: { status, feedback: feedback ?? null },
        });

        const completed = status === 'completed' || status === 'done';
        const wasCompleted = existing.status === 'completed' || existing.status === 'done';
        if (completed && !wasCompleted && existing.engineer?.engineer_profile) {
            const ep = existing.engineer.engineer_profile;
            const interviews_completed_count = (ep.interviews_completed_count ?? 0) + 1;
            const badges = computeBadges({ ...ep, interviews_completed_count } as any);
            await prisma.engineerProfile.update({
                where: { user_id: engineerId },
                data: { interviews_completed_count, badges },
            });
        }

        res.json(interview);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
