import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

export const getPayments = async (req: Request, res: Response) => {
    try {
        const id = (req as any).user?.id;
        const payments = await prisma.payment.findMany({
            where: { OR: [{ user_id: id }, { engineer_id: id }] },
            include: { user: { select: { name: true } } },
            orderBy: { created_at: 'desc' },
        });
        res.json(payments);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { amount, type } = req.body;
        // TODO: integrate Razorpay SDK
        res.json({ orderId: `order_stub_${Date.now()}`, amount, currency: 'INR', type });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const id = (req as any).user?.id;
        const { amount, type, transaction_id, referral_id, engineer_id } = req.body;

        const payment = await prisma.payment.create({
            data: {
                user_id: id as any,
                engineer_id: engineer_id ? engineer_id as any : null,
                referral_id: referral_id ? referral_id as any : null,
                amount,
                type,
                status: 'paid',
                transaction_id: transaction_id ?? null,
            },
        });
        res.json(payment);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
