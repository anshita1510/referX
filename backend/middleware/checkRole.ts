import { Request, Response, NextFunction } from 'express';

export function checkRole(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const role = (req as any).user?.role;
        if (!role || !roles.includes(role)) {
            return res.status(403).json({ error: `Access denied. Required role: ${roles.join(' or ')}` });
        }
        next();
    };
}
