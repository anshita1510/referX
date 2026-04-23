'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/api/axiosClient';
import { Eye, EyeOff, KeyRound } from 'lucide-react';

type Step = 'email' | 'otp' | 'password';

export default function ForgotPassword() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetToken, setResetToken] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [showPw2, setShowPw2] = useState(false);

    const clearMessages = () => {
        setError(null);
        setInfo(null);
    };

    const submitEmail = async (e: FormEvent) => {
        e.preventDefault();
        clearMessages();
        setBusy(true);
        try {
            const { data } = await api.post('/api/auth/forgot-password', { email });
            setInfo(data.message ?? 'Check your email for the code.');
            setStep('otp');
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Something went wrong.';
            setError(msg);
        } finally {
            setBusy(false);
        }
    };

    const submitOtp = async (e: FormEvent) => {
        e.preventDefault();
        clearMessages();
        setBusy(true);
        try {
            const { data } = await api.post('/api/auth/verify-forgot-otp', { email, otp });
            setResetToken(data.resetToken);
            setInfo(null);
            setStep('password');
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Something went wrong.';
            setError(msg);
        } finally {
            setBusy(false);
        }
    };

    const submitPassword = async (e: FormEvent) => {
        e.preventDefault();
        clearMessages();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!resetToken) {
            setError('Session expired. Start again from the email step.');
            return;
        }
        setBusy(true);
        try {
            await api.post('/api/auth/reset-password', { resetToken, password, confirmPassword });
            router.push('/login');
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Something went wrong.';
            setError(msg);
        } finally {
            setBusy(false);
        }
    };

    const goBackToEmail = () => {
        clearMessages();
        setOtp('');
        setResetToken(null);
        setPassword('');
        setConfirmPassword('');
        setStep('email');
    };

    return (
        <div className="auth-page items-center justify-center px-4 py-12">
            <div
                className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 rounded-3xl p-10 mr-10"
                style={{
                    background: 'linear-gradient(145deg, var(--color-brand-dark), var(--color-brand), var(--color-teal-light))',
                    minHeight: 520,
                }}
            >
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="ReferX" className="h-9 w-9 rounded-full object-cover" style={{ objectPosition: '50% 35%' }} />
                    <span className="font-heading text-xl font-extrabold text-white">ReferX</span>
                </div>
                <div>
                    <h2 className="font-heading text-3xl font-extrabold text-white mb-4 leading-snug">
                        Secure password recovery.
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        We verify your email with a one-time code, then you choose a new password. Your account stays protected end to end.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    {[
                        { step: '1', label: 'Enter your verified email' },
                        { step: '2', label: 'Confirm the code from your inbox' },
                        { step: '3', label: 'Set a new password' },
                    ].map((s) => (
                        <div
                            key={s.step}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.12)' }}
                        >
                            <span
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}
                            >
                                {s.step}
                            </span>
                            <span className="text-sm text-white">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="auth-card w-full max-w-md p-10">
                <div className="flex items-center gap-2 mb-8 lg:hidden">
                    <img src="/logo.png" alt="ReferX" className="h-8 w-8 rounded-full object-cover" style={{ objectPosition: '50% 35%' }} />
                    <span className="font-heading text-xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
                        Refer<span style={{ color: 'var(--color-brand)' }}>X</span>
                    </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--color-sky)' }}
                    >
                        <KeyRound size={20} style={{ color: 'var(--color-brand)' }} />
                    </div>
                    <h2 className="font-heading text-2xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
                        Forgot password
                    </h2>
                </div>
                <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
                    {step === 'email' && 'Enter the email you use to sign in.'}
                    {step === 'otp' && 'Enter the 6-digit code we sent to your inbox.'}
                    {step === 'password' && 'Choose a new password for your account.'}
                </p>

                {info && (
                    <div
                        className="rounded-lg px-3 py-2.5 text-sm mb-4"
                        style={{
                            background: 'var(--color-sky)',
                            border: '1px solid var(--color-border-light)',
                            color: 'var(--color-text-primary)',
                        }}
                    >
                        {info}
                    </div>
                )}
                {error && <div className="auth-error">{error}</div>}

                {step === 'email' && (
                    <form onSubmit={submitEmail} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                                Email
                            </label>
                            <input
                                className="auth-input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </div>
                        <button type="submit" disabled={busy} className="auth-btn mt-1">
                            {busy ? 'Sending code…' : 'Send reset code'}
                        </button>
                    </form>
                )}

                {step === 'otp' && (
                    <form onSubmit={submitOtp} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                                One-time code
                            </label>
                            <input
                                className="auth-input"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                required
                                placeholder="000000"
                                autoComplete="one-time-code"
                            />
                        </div>
                        <button type="submit" disabled={busy || otp.length < 6} className="auth-btn mt-1">
                            {busy ? 'Verifying…' : 'Verify code'}
                        </button>
                        <button type="button" onClick={goBackToEmail} className="text-sm font-medium" style={{ color: 'var(--color-brand)' }}>
                            Use a different email
                        </button>
                    </form>
                )}

                {step === 'password' && (
                    <form onSubmit={submitPassword} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                                New password
                            </label>
                            <div className="relative">
                                <input
                                    className="auth-input pr-10"
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    placeholder="Min. 6 characters"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    style={{ color: 'var(--color-text-soft)' }}
                                >
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                                Confirm password
                            </label>
                            <div className="relative">
                                <input
                                    className="auth-input pr-10"
                                    type={showPw2 ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    placeholder="Repeat password"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw2((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    style={{ color: 'var(--color-text-soft)' }}
                                >
                                    {showPw2 ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={busy} className="auth-btn mt-1">
                            {busy ? 'Updating…' : 'Update password'}
                        </button>
                    </form>
                )}

                <p className="text-center mt-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Remember your password?{' '}
                    <Link href="/login" className="font-semibold" style={{ color: 'var(--color-brand)' }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
