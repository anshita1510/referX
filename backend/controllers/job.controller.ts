import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

export const getJobs = async (_req: Request, res: Response) => {
    try {
        const jobs = await prisma.job.findMany({
            where: { status: 'active' },
            include: { company: { select: { name: true } } },
            orderBy: { posted_at: 'desc' },
        });
        res.json(jobs);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getJobById = async (req: Request, res: Response) => {
    try {
        const job = await prisma.job.findUnique({
            where: { id: req.params.id as any },
            include: { company: { select: { name: true } } },
        });
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createJob = async (req: Request, res: Response) => {
    try {
        const companyId = (req as any).user?.id;
        const { title, description, location, salary_range, skills_required } = req.body;
        const job = await prisma.job.create({
            data: {
                company_id: companyId,
                title,
                description,
                location,
                salary_range,
                skills_required: skills_required ?? [],
            },
        });
        res.status(201).json(job);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateJobStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const job = await prisma.job.update({
            where: { id: req.params.id as any },
            data: { status },
        });
        res.json(job);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
