import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/prisma.js';
import { sendVerificationEmail } from '../services/email.service.js';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES = '7d';

function makeToken(user: { id: number | string; role: string }) {
    return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role, name } = req.body;
        if (!email || !password || !role || !name)
            return res.status(400).json({ error: 'email, password, role and name are required' });

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

        const password_hash = await bcrypt.hash(password, 12);
        const verification_token = crypto.randomBytes(32).toString('hex');

        const user = await (prisma.user.create as any)({
            data: { email, password_hash, role, name, verification_token },
        });

        if (role === 'candidate') {
            await prisma.candidateProfile.create({ data: { user_id: user.id } });
        } else if (role === 'engineer') {
            await prisma.engineerProfile.create({ data: { user_id: user.id } });
        }

        await sendVerificationEmail(email, verification_token);

        res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const user = await (prisma.user.findFirst as any)({ where: { verification_token: token } });

        if (!user) {
            return res.status(400).send(verifyPage('Invalid or expired verification link.', false));
        }

        await (prisma.user.update as any)({
            where: { id: user.id },
            data: { email_verified: true, verification_token: null },
        });

        return res.send(verifyPage('Your email has been verified successfully!', true));
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

function verifyPage(message: string, success: boolean) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const color = success ? '#22c55e' : '#ef4444';
    const icon = success ? '✅' : '❌';
    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>Email Verification – ReferX</title>
<style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f8fafc;}
.card{max-width:420px;width:100%;padding:40px;border-radius:16px;border:1px solid #e2e8f0;text-align:center;background:#fff;}
h2{color:#1e293b;margin-bottom:8px;}p{color:#64748b;margin-bottom:28px;}
a{display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;}</style>
</head>
<body><div class="card">
  <div style="font-size:48px;margin-bottom:16px;">${icon}</div>
  <h2 style="color:${color}">${message}</h2>
  ${success ? `<p>You can now sign in to your account.</p><a href="${clientUrl}/login">Go to Login</a>` : `<p>Please try registering again or contact support.</p>`}
</div></body></html>`;
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: 'Email and password are required' });

        const user = await prisma.user.findUnique({ where: { email } }) as any;
        if (!user) return res.status(401).json({ error: 'No account found with this email.' });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Incorrect password.' });

        if (!user.email_verified) {
            return res.status(403).json({ error: 'Please verify your email before signing in. Check your inbox for the verification link.' });
        }

        const token = makeToken(user);
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const id = (req as any).user?.id;
        const user = await prisma.user.findUnique({
            where: { id },
            include: { candidate_profile: true, engineer_profile: true },
        }) as any;
        if (!user) return res.status(404).json({ error: 'User not found' });
        const { password_hash: _, ...safe } = user;
        res.json(safe);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getCandidates = async (_req: Request, res: Response) => {
    try {
        const candidates = await prisma.user.findMany({
            where: { role: 'candidate' },
            include: { candidate_profile: true },
            orderBy: { created_at: 'desc' },
        }) as any[];
        res.json(candidates.map(({ password_hash: _, ...u }: any) => u));
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const id = (req as any).user?.id;
        const role = (req as any).user?.role;
        const { name, avatar_url, skills, resume_url, github, portfolio,
            bio, location, experience_level, projects,
            company, designation, experience_years, linkedin } = req.body;

        if (name || avatar_url) {
            await prisma.user.update({
                where: { id },
                data: { ...(name ? { name } : {}), ...(avatar_url ? { avatar_url } : {}) },
            });
        }

        if (role === 'candidate') {
            await prisma.candidateProfile.upsert({
                where: { user_id: id },
                update: { skills, resume_url, github, portfolio, bio, location, experience_level, projects, updated_at: new Date() },
                create: { user_id: id, skills: skills ?? [], resume_url, github, portfolio, bio, location, experience_level, projects },
            });
        } else if (role === 'engineer') {
            await prisma.engineerProfile.upsert({
                where: { user_id: id },
                update: { company, designation, experience_years, linkedin, skills, bio, updated_at: new Date() },
                create: { user_id: id, company, designation, experience_years: experience_years ?? 0, linkedin, skills: skills ?? [], bio },
            });
        }

        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const uploadResume = async (req: Request, res: Response) => {
    try {
        const id = (req as any).user?.id;
        const file = (req as any).file as { path: string } | undefined;
        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        await prisma.candidateProfile.upsert({
            where: { user_id: id },
            update: { resume_url: file.path, updated_at: new Date() },
            create: { user_id: id, resume_url: file.path },
        });
        res.json({ url: file.path });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
