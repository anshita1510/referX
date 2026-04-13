import { query } from '../config/db.js';

export const findByFirebaseUid = (uid: string) =>
    query('SELECT * FROM users WHERE firebase_uid = $1', [uid]);

export const createUser = (uid: string, email: string, role: string, name: string) =>
    query(
        'INSERT INTO users (firebase_uid, email, role, name) VALUES ($1, $2, $3, $4) RETURNING *',
        [uid, email, role, name]
    );
