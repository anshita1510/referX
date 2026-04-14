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
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid job id' });
        const job = await prisma.job.findUnique({
            where: { id },
            include: { company: { select: { name: true } } },
        });
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getMyApplications = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user?.id;
        const applications = await prisma.application.findMany({
            where: { candidate_id: candidateId },
            include: {
                job: {
                    include: { company: { select: { name: true } } },
                },
            },
            orderBy: { applied_at: 'desc' },
        });
        res.json(applications);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const applyToJob = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user?.id;
        const jobId = parseInt(req.params.id);
        if (isNaN(jobId)) return res.status(400).json({ error: 'Invalid job id' });

        const existing = await prisma.application.findUnique({
            where: { candidate_id_job_id: { candidate_id: candidateId, job_id: jobId } },
        });
        if (existing) return res.status(409).json({ error: 'Already applied to this job' });

        const application = await prisma.application.create({
            data: { candidate_id: candidateId, job_id: jobId, status: 'applied' },
        });
        res.status(201).json(application);
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
                title, description, location, salary_range,
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
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid job id' });
        const { status } = req.body;
        const job = await prisma.job.update({ where: { id }, data: { status } });
        res.json(job);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
