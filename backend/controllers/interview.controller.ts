import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

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
        const { status, feedback } = req.body;
        const interview = await prisma.interview.update({
            where: { id: req.params.id as any },
            data: { status, feedback: feedback ?? null },
        });
        res.json(interview);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
