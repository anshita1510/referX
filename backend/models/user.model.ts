import { query } from '../config/db.js';

export const findUserById = (id: string) =>
    query('SELECT * FROM users WHERE id = $1 AND is_deleted = false', [id]);

export const createUser = (email: string, password: string, role: string, name: string) =>
    query(
        'INSERT INTO users (email, password, role, name) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, password, role, name]
    );
