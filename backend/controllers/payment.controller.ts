import { Request, Response } from 'express';
import { query } from '../config/db.js';

export const getPayments = async (req: Request, res: Response) => {
    try {
        const uid = (req as any).user?.uid;
        const result = await query(
            `SELECT p.*, u.name AS payer_name
       FROM payments p
       LEFT JOIN users u ON u.firebase_uid = p.user_id
       WHERE p.user_id = $1 OR p.engineer_id = $1
       ORDER BY p.created_at DESC`,
            [uid]
        );
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// Creates a Razorpay order (stub — wire up Razorpay SDK when ready)
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { amount, type } = req.body; // amount in paise
        // TODO: integrate Razorpay — const order = await razorpay.orders.create(...)
        res.json({
            orderId: `order_stub_${Date.now()}`,
            amount,
            currency: 'INR',
            type,
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// Verifies Razorpay payment signature and records it
export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const uid = (req as any).user?.uid;
        const { amount, type, transaction_id, referral_id, engineer_id } = req.body;

        // TODO: verify Razorpay signature here before recording

        const result = await query(
            `INSERT INTO payments (user_id, engineer_id, referral_id, amount, type, status, transaction_id)
       VALUES ($1, $2, $3, $4, $5, 'paid', $6) RETURNING *`,
            [uid, engineer_id ?? null, referral_id ?? null, amount, type, transaction_id]
        );

        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
