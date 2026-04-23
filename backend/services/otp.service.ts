import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function generateSixDigitOtp(): string {
    return String(crypto.randomInt(100000, 1000000));
}

export async function createOtpChallenge(params: {
    userId?: number;
    channel: 'email' | 'sms';
    target: string;
    purpose: string;
}): Promise<{ plainCode: string }> {
    const normalizedTarget = params.target.trim().toLowerCase();
    const plainCode = generateSixDigitOtp();
    const code_hash = await bcrypt.hash(plainCode, 10);
    const expires_at = new Date(Date.now() + OTP_TTL_MS);

    await prisma.otpChallenge.updateMany({
        where: {
            target: normalizedTarget,
            purpose: params.purpose,
            consumed: false,
        },
        data: { consumed: true },
    });

    await prisma.otpChallenge.create({
        data: {
            user_id: params.userId ?? null,
            channel: params.channel,
            target: normalizedTarget,
            purpose: params.purpose,
            code_hash,
            expires_at,
        },
    });

    return { plainCode };
}

export async function verifyOtpChallenge(params: {
    userId?: number;
    target: string;
    purpose: string;
    code: string;
}): Promise<boolean> {
    const normalizedTarget = params.target.trim().toLowerCase();
    const codeStr = String(params.code).replace(/\s/g, '');

    const row = await prisma.otpChallenge.findFirst({
        where: {
            target: normalizedTarget,
            purpose: params.purpose,
            consumed: false,
            ...(params.userId != null ? { user_id: params.userId } : {}),
        },
        orderBy: { id: 'desc' },
    });

    if (!row) return false;
    if (new Date() > row.expires_at) return false;
    if (row.attempts >= MAX_ATTEMPTS) return false;

    const match = await bcrypt.compare(codeStr, row.code_hash);
    if (!match) {
        await prisma.otpChallenge.update({
            where: { id: row.id },
            data: { attempts: { increment: 1 } },
        });
        return false;
    }

    await prisma.otpChallenge.update({
        where: { id: row.id },
        data: { consumed: true },
    });
    return true;
}
