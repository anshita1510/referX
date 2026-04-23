import { query } from '../config/db.js';

export const getPaymentsByEngineer = (engineerId: string) =>
    query('SELECT * FROM payments WHERE engineer_id = $1 AND is_deleted = false ORDER BY created_at DESC', [engineerId]);

export const createPayment = (engineerId: string, referralId: string, amount: number) =>
    query(
        'INSERT INTO payments (engineer_id, referral_id, amount, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [engineerId, referralId, amount, 'pending']
    );
