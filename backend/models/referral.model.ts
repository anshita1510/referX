import { query } from '../config/db.js';

export const getReferralsByEngineer = (engineerId: string) =>
    query('SELECT * FROM referrals WHERE engineer_id = $1', [engineerId]);

export const getReferralsByCandidate = (candidateId: string) =>
    query('SELECT * FROM referrals WHERE candidate_id = $1', [candidateId]);

export const createReferral = (engineerId: string, candidateId: string, jobId: string) =>
    query(
        'INSERT INTO referrals (engineer_id, candidate_id, job_id, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [engineerId, candidateId, jobId, 'pending']
    );
