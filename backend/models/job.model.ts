import { query } from '../config/db.js';

export const getAllJobs = () =>
    query('SELECT * FROM jobs ORDER BY created_at DESC', []);

export const getJobById = (id: string) =>
    query('SELECT * FROM jobs WHERE id = $1', [id]);

export const createJob = (title: string, description: string, companyId: string) =>
    query(
        'INSERT INTO jobs (title, description, company_id) VALUES ($1, $2, $3) RETURNING *',
        [title, description, companyId]
    );
