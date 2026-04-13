import { Request, Response } from 'express';
import { query } from '../config/db.js';

export const uploadDocuments = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user?.id;
        const { referral_id } = req.body;
        const files = (req as any).files as Record<string, { path: string }[]>;

        const offerUrl = files?.offer_letter?.[0]?.path ?? null;
        const joiningUrl = files?.joining_letter?.[0]?.path ?? null;
        const salaryUrl = files?.salary_slip?.[0]?.path ?? null;

        const result = await query(
            `INSERT INTO documents (candidate_id, referral_id, offer_letter_url, joining_letter_url, salary_slip_url)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (candidate_id, referral_id) DO UPDATE
         SET offer_letter_url   = COALESCE($3, documents.offer_letter_url),
             joining_letter_url = COALESCE($4, documents.joining_letter_url),
             salary_slip_url    = COALESCE($5, documents.salary_slip_url),
             uploaded_at        = NOW()
       RETURNING *`,
            [candidateId, referral_id ?? null, offerUrl, joiningUrl, salaryUrl]
        );
        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getDocuments = async (req: Request, res: Response) => {
    try {
        const uid = (req as any).user?.id;
        const role = (req as any).user?.role;
        const col = role === 'admin' ? '1=1' : 'candidate_id = $1';

        const result = await query(
            `SELECT d.*, u.name AS candidate_name
       FROM documents d
       LEFT JOIN users u ON u.id = d.candidate_id
       WHERE ${col}
       ORDER BY d.uploaded_at DESC`,
            role === 'admin' ? [] : [uid]
        );
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
