import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

export const uploadDocuments = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user?.id;
        const { referral_id } = req.body;
        const files = (req as any).files as Record<string, { path: string }[]>;

        const offerUrl   = files?.offer_letter?.[0]?.path   ?? null;
        const joiningUrl = files?.joining_letter?.[0]?.path ?? null;
        const salaryUrl  = files?.salary_slip?.[0]?.path    ?? null;
        const refId      = referral_id ? Number(referral_id) : null;

        const doc = await (prisma.document.upsert as any)({
            where: { candidate_id_referral_id: { candidate_id: candidateId, referral_id: refId } },
            update: {
                ...(offerUrl   ? { offer_letter_url:   offerUrl }   : {}),
                ...(joiningUrl ? { joining_letter_url: joiningUrl } : {}),
                ...(salaryUrl  ? { salary_slip_url:    salaryUrl }  : {}),
                uploaded_at: new Date(),
            },
            create: { candidate_id: candidateId, referral_id: refId, offer_letter_url: offerUrl, joining_letter_url: joiningUrl, salary_slip_url: salaryUrl },
        });
        res.status(201).json(doc);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getDocuments = async (req: Request, res: Response) => {
    try {
        const id   = (req as any).user?.id;
        const role = (req as any).user?.role;
        const docs = await prisma.document.findMany({
            where: role === 'candidate' ? { candidate_id: id } : {},
            include: { candidate: { select: { name: true } } },
            orderBy: { uploaded_at: 'desc' },
        });
        res.json(docs);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
