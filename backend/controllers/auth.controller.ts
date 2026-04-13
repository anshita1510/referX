import { Request, Response } from 'express';
import { query } from '../config/db.js';

export const getMe = async (req: Request, res: Response) => {
    try {
        const uid = (req as any).user?.uid;
        const result = await query(
            `SELECT u.*,
        cp.skills AS candidate_skills, cp.resume_url, cp.github, cp.portfolio, cp.bio AS candidate_bio,
        ep.company, ep.designation, ep.experience_years, ep.linkedin, ep.verified, ep.bio AS engineer_bio
       FROM users u
       LEFT JOIN candidate_profiles cp ON cp.user_id = u.firebase_uid
       LEFT JOIN engineer_profiles  ep ON ep.user_id = u.firebase_uid
       WHERE u.firebase_uid = $1`,
            [uid]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const uid = (req as any).user?.uid;
        const email = (req as any).user?.email;
        const { role, name } = req.body;

        const user = await query(
            `INSERT INTO users (firebase_uid, email, role, name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (firebase_uid) DO UPDATE SET role = $3, name = COALESCE($4, users.name)
       RETURNING *`,
            [uid, email, role, name ?? email]
        );

        // Create role-specific profile row
        if (role === 'candidate') {
            await query(
                `INSERT INTO candidate_profiles (user_id) VALUES ($1) ON CONFLICT DO NOTHING`,
                [uid]
            );
        } else if (role === 'engineer') {
            await query(
                `INSERT INTO engineer_profiles (user_id) VALUES ($1) ON CONFLICT DO NOTHING`,
                [uid]
            );
        }

        res.status(201).json(user.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const googleAuth = async (req: Request, res: Response) => {
    try {
        const uid = (req as any).user?.uid;
        const email = (req as any).user?.email;
        const name = (req as any).user?.name ?? email;
        const { role } = req.body;

        const user = await query(
            `INSERT INTO users (firebase_uid, email, role, name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (firebase_uid) DO UPDATE SET name = COALESCE($4, users.name)
       RETURNING *`,
            [uid, email, role ?? 'candidate', name]
        );

        const r = (user.rows[0] as any).role;
        if (r === 'candidate') {
            await query(`INSERT INTO candidate_profiles (user_id) VALUES ($1) ON CONFLICT DO NOTHING`, [uid]);
        } else if (r === 'engineer') {
            await query(`INSERT INTO engineer_profiles (user_id) VALUES ($1) ON CONFLICT DO NOTHING`, [uid]);
        }

        res.json(user.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getCandidates = async (_req: Request, res: Response) => {
    try {
        const result = await query(
            `SELECT u.firebase_uid AS id, u.name, u.email, u.avatar_url,
              cp.skills, cp.resume_url, cp.github, cp.bio
       FROM users u
       LEFT JOIN candidate_profiles cp ON cp.user_id = u.firebase_uid
       WHERE u.role = 'candidate'
       ORDER BY u.created_at DESC`,
            []
        );
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const uid = (req as any).user?.uid;
        const role = (req as any).user?.role;
        const { name, avatar_url, skills, resume_url, github, portfolio, bio,
            company, designation, experience_years, linkedin } = req.body;

        if (name || avatar_url) {
            await query(
                `UPDATE users SET name = COALESCE($1, name), avatar_url = COALESCE($2, avatar_url) WHERE firebase_uid = $3`,
                [name, avatar_url, uid]
            );
        }

        if (role === 'candidate') {
            await query(
                `INSERT INTO candidate_profiles (user_id, skills, resume_url, github, portfolio, bio)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (user_id) DO UPDATE
         SET skills=$2, resume_url=COALESCE($3,candidate_profiles.resume_url),
             github=COALESCE($4,candidate_profiles.github),
             portfolio=COALESCE($5,candidate_profiles.portfolio),
             bio=COALESCE($6,candidate_profiles.bio), updated_at=NOW()`,
                [uid, skills, resume_url, github, portfolio, bio]
            );
        } else if (role === 'engineer') {
            await query(
                `INSERT INTO engineer_profiles (user_id, company, designation, experience_years, linkedin, skills, bio)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (user_id) DO UPDATE
         SET company=COALESCE($2,engineer_profiles.company),
             designation=COALESCE($3,engineer_profiles.designation),
             experience_years=COALESCE($4,engineer_profiles.experience_years),
             linkedin=COALESCE($5,engineer_profiles.linkedin),
             skills=COALESCE($6,engineer_profiles.skills),
             bio=COALESCE($7,engineer_profiles.bio), updated_at=NOW()`,
                [uid, company, designation, experience_years, linkedin, skills, bio]
            );
        }

        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const uploadResume = async (req: Request, res: Response) => {
    try {
        const uid = (req as any).user?.uid;
        const file = (req as any).file as { path: string } | undefined;
        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        const resumeUrl = file.path;
        await query(
            `UPDATE candidate_profiles SET resume_url = $1, updated_at = NOW() WHERE user_id = $2`,
            [resumeUrl, uid]
        );
        res.json({ resume_url: resumeUrl });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
