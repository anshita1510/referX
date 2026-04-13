import { query } from '../config/db.js';

export const getReferralsByEngineer = (engineerId: string) =>
    query('SELECT * FROM referral_requests WHERE engineer_id = $1 AND is_deleted = false', [engineerId]);

export const createReferral = (engineerId: string, candidateId: string, jobId: string) =>
    query(
        'INSERT INTO referral_requests (engineer_id, candidate_id, job_id, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [engineerId, candidateId, jobId, 'pending']
    );

export const updateReferralStatus = (referralId: string, status: string) =>
    query('UPDATE referral_requests SET status = $1 WHERE id = $2 RETURNING *', [status, referralId]);
