'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const { login, error, clearError } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [busy, setBusy] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();
        setBusy(true);
        const result = await login(email, password);
        setBusy(false);
        if (result.success) router.push('/');
    };

    return (
        <div className="auth-page items-center justify-center px-4 py-12">
            {/* Left decorative panel */}
            <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 rounded-3xl p-10 mr-10"
                style={{ background: 'linear-gradient(145deg, var(--color-brand-dark), var(--color-brand), var(--color-teal-light))', minHeight: 520 }}>
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="ReferX" className="h-9 w-9 rounded-full object-cover" style={{ objectPosition: '50% 35%' }} />
                    <span className="font-heading text-xl font-extrabold text-white">ReferX</span>
                </div>
                <div>
                    <h2 className="font-heading text-3xl font-extrabold text-white mb-4 leading-snug">
                        Your next job starts with a real referral.
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        Engineers refer. Candidates get hired. Companies find quality talent — all in one place.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    {[
                        { stat: '12,000+', label: 'Candidates registered' },
                        { stat: '3,400+', label: 'Successful referrals' },
                        { stat: '₹42L+', label: 'Paid to engineers' },
                    ].map(s => (
                        <div key={s.label} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.12)' }}>
                            <span className="font-heading font-extrabold text-white text-lg">{s.stat}</span>
                            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Card */}
            <div className="auth-card w-full max-w-md p-10">
                <div className="flex items-center gap-2 mb-8 lg:hidden">
                    <img src="/logo.png" alt="ReferX" className="h-8 w-8 rounded-full object-cover" style={{ objectPosition: '50% 35%' }} />
                    <span className="font-heading text-xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
                        Refer<span style={{ color: 'var(--color-brand)' }}>X</span>
                    </span>
                </div>

                <h2 className="font-heading text-2xl font-extrabold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                    Welcome back
                </h2>
                <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>Sign in to your account</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Email</label>
                        <input className="auth-input" type="email" value={email}
                            onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Password</label>
                        <div className="relative">
                            <input className="auth-input pr-10" type={showPw ? 'text' : 'password'}
                                value={password} onChange={e => setPassword(e.target.value)}
                                required placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPw(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                style={{ color: 'var(--color-text-soft)' }}>
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <p className="text-center m-0 -mb-1">
                        <Link
                            href="/forgot-password"
                            className="text-sm font-semibold underline underline-offset-2"
                            style={{ color: 'var(--color-brand-dark)' }}
                        >
                            Forgot password?
                        </Link>
                    </p>
                    <button type="submit" disabled={busy} className="auth-btn mt-1">
                        {busy ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    No account?{' '}
                    <Link href="/register" className="font-semibold" style={{ color: 'var(--color-brand)' }}>Register</Link>
                </p>
            </div>
        </div>
    );
}
