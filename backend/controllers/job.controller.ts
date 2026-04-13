import { Request, Response } from 'express';
import { query } from '../config/db.js';

export const getJobs = async (_req: Request, res: Response) => {
    try {
        const result = await query(
            `SELECT j.*, u.name AS company_name
       FROM jobs j
       LEFT JOIN users u ON u.firebase_uid = j.company_id
       WHERE j.status = 'active'
       ORDER BY j.posted_at DESC`,
            []
        );
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getJobById = async (req: Request, res: Response) => {
    try {
        const result = await query(
            `SELECT j.*, u.name AS company_name
       FROM jobs j
       LEFT JOIN users u ON u.firebase_uid = j.company_id
       WHERE j.id = $1`,
            [req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Job not found' });
        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createJob = async (req: Request, res: Response) => {
    try {
        const companyId = (req as any).user?.uid;
        const { title, description, location, salary_range, skills_required } = req.body;
        const result = await query(
            `INSERT INTO jobs (company_id, title, description, location, salary_range, skills_required)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [companyId, title, description, location, salary_range, skills_required ?? []]
        );
        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateJobStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const result = await query(
            `UPDATE jobs SET status = $1 WHERE id = $2 RETURNING *`,
            [status, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
