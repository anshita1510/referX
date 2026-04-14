import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Mail } from 'lucide-react';

export default function Register() {
    const { register, error, clearError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [busy, setBusy] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();
        setBusy(true);
        const result = await register(email, password, 'candidate', { name });
        setBusy(false);
        if (result.success) setSent(true);
    };

    if (sent) {
        return (
            <div className="auth-page items-center justify-center px-4 py-12">
                <div className="auth-card w-full max-w-md p-10 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ background: 'var(--color-sky)' }}>
                            <Mail size={32} style={{ color: 'var(--color-brand)' }} />
                        </div>
                    </div>
                    <h2 className="font-heading text-2xl font-extrabold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                        Check your inbox
                    </h2>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        We sent a verification link to
                    </p>
                    <p className="font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>{email}</p>
                    <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
                        Click the link in the email to verify your account, then you can sign in.
                    </p>
                    <Link to="/login" className="auth-btn inline-block">Go to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page items-center justify-center px-4 py-12">
            {/* Left panel */}
            <div className="hidden lg:flex flex-col justify-between w-[380px] flex-shrink-0 rounded-3xl p-10 mr-10"
                style={{ background: 'linear-gradient(145deg, var(--color-brand-dark), var(--color-brand), var(--color-teal-light))', minHeight: 520 }}>
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="ReferX" className="h-9 w-9 rounded-full object-cover" style={{ objectPosition: '50% 35%' }} />
                    <span className="font-heading text-xl font-extrabold text-white">ReferX</span>
                </div>
                <div>
                    <h2 className="font-heading text-3xl font-extrabold text-white mb-4 leading-snug">
                        Your first job starts with a real referral.
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        Create your account, complete your profile, and get referred by engineers at top companies.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    {[
                        { step: '1', label: 'Create your account' },
                        { step: '2', label: 'Complete your profile' },
                        { step: '3', label: 'Get referred & hired' },
                    ].map(s => (
                        <div key={s.step} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.12)' }}>
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}>{s.step}</span>
                            <span className="text-sm text-white">{s.label}</span>
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
                    Create your account
                </h2>
                <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
                    Step 1 of 2 — Basic info
                </p>

                {/* Role badge */}
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6"
                    style={{ background: 'var(--color-sky)', border: '1px solid var(--color-border)' }}>
                    <span className="text-lg">🎯</span>
                    <div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Registering as Candidate</div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Looking for a job via referrals</div>
                    </div>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Full Name</label>
                        <input className="auth-input" type="text" value={name}
                            onChange={e => setName(e.target.value)} required placeholder="Jane Smith" />
                    </div>
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
                                required placeholder="Min. 6 characters" />
                            <button type="button" onClick={() => setShowPw(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                style={{ color: 'var(--color-text-soft)' }}>
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={busy} className="auth-btn mt-1">
                        {busy ? 'Creating account…' : 'Continue →'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold" style={{ color: 'var(--color-brand)' }}>Sign in</Link>
                </p>
                <p className="text-center mt-3 text-xs" style={{ color: 'var(--color-text-soft)' }}>
                    Engineer or Company?{' '}
                    <Link to="/login" className="underline" style={{ color: 'var(--color-brand)' }}>Contact us to join</Link>
                </p>
            </div>
        </div>
    );
}
