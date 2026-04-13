import { Request, Response } from 'express';
import { query } from '../config/db.js';

export const getReferrals = async (req: Request, res: Response) => {
    try {
        const uid = (req as any).user?.uid;
        const role = (req as any).user?.role;

        // Engineers see referrals they made; candidates see referrals for them
        const col = role === 'candidate' ? 'r.candidate_id' : 'r.engineer_id';

        const result = await query(
            `SELECT r.*,
              j.title  AS job_title,
              j.location,
              c.name   AS candidate_name,
              e.name   AS engineer_name
       FROM referrals r
       LEFT JOIN jobs  j ON j.id = r.job_id
       LEFT JOIN users c ON c.firebase_uid = r.candidate_id
       LEFT JOIN users e ON e.firebase_uid = r.engineer_id
       WHERE ${col} = $1
       ORDER BY r.created_at DESC`,
            [uid]
        );
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createReferral = async (req: Request, res: Response) => {
    try {
        const engineerId = (req as any).user?.uid;
        const { candidateId, jobId, note } = req.body;
        const result = await query(
            `INSERT INTO referrals (engineer_id, candidate_id, job_id, note)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [engineerId, candidateId, jobId, note ?? null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateReferralStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const result = await query(
            `UPDATE referrals SET status = $1 WHERE id = $2 RETURNING *`,
            [status, req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Referral not found' });
        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
