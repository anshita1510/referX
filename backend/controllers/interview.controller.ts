import { Request, Response } from 'express';
import { query } from '../config/db.js';

export const getInterviews = async (req: Request, res: Response) => {
    try {
        const uid = (req as any).user?.uid;
        const role = (req as any).user?.role;
        const col = role === 'engineer' ? 'i.engineer_id' : 'i.candidate_id';

        const result = await query(
            `SELECT i.*,
              c.name AS candidate_name,
              e.name AS engineer_name,
              ep.company, ep.designation
       FROM interviews i
       LEFT JOIN users c ON c.firebase_uid = i.candidate_id
       LEFT JOIN users e ON e.firebase_uid = i.engineer_id
       LEFT JOIN engineer_profiles ep ON ep.user_id = i.engineer_id
       WHERE ${col} = $1
       ORDER BY i.scheduled_at DESC`,
            [uid]
        );
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const bookInterview = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user?.uid;
        const { engineerId, scheduledAt, notes } = req.body;

        const result = await query(
            `INSERT INTO interviews (candidate_id, engineer_id, scheduled_at, notes)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [candidateId, engineerId, scheduledAt, notes ?? null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateInterviewStatus = async (req: Request, res: Response) => {
    try {
        const { status, feedback } = req.body;
        const result = await query(
            `UPDATE interviews SET status = $1, feedback = $2 WHERE id = $3 RETURNING *`,
            [status, feedback ?? null, req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Interview not found' });
        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
