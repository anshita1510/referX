import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET!;

type JwtPayload = {
    id: number | string;
    role?: string;
};

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const userId = typeof decoded.id === 'string' ? Number(decoded.id) : decoded.id;
        if (!Number.isFinite(userId)) {
            return res.status(401).json({ error: 'Invalid token payload' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, role: true },
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found for token' });
        }

        (req as any).user = {
            id: user.id,
            uid: String(user.id),
            email: user.email,
            name: user.name,
            role: user.role,
        };

        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
