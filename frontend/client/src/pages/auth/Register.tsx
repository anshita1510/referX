import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type Role = 'candidate' | 'engineer' | 'company';

const ROLES: { value: Role; label: string; desc: string }[] = [
    { value: 'candidate', label: 'Candidate', desc: 'Looking for a job via referrals' },
    { value: 'engineer', label: 'Engineer', desc: 'Refer candidates and earn rewards' },
    { value: 'company', label: 'Company / Recruiter', desc: 'Post jobs and hire talent' },
];

export default function Register() {
    const { register, error, clearError } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<Role>('candidate');
    const [busy, setBusy] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();
        setBusy(true);
        const result = await register(email, password, role, { name });
        setBusy(false);
        if (result.success) navigate('/');
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.logo}>ReferX</div>
                <h2 style={styles.title}>Create your account</h2>
                <p style={styles.subtitle}>Join the referral network</p>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            placeholder="Jane Smith"
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="Min. 6 characters"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>I am a…</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                            {ROLES.map(r => (
                                <label key={r.value} style={{
                                    ...styles.roleOption,
                                    ...(role === r.value ? styles.roleOptionActive : {}),
                                }}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value={r.value}
                                        checked={role === r.value}
                                        onChange={() => setRole(r.value)}
                                        style={{ marginRight: 10 }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>{r.label}</div>
                                        <div style={{ fontSize: 12, color: '#6b7280' }}>{r.desc}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={busy} style={styles.primaryBtn}>
                        {busy ? 'Creating account…' : 'Create account'}
                    </button>
                </form>

                <p style={styles.footer}>
                    Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb',
        fontFamily: 'system-ui, sans-serif',
        padding: '24px 0',
    },
    card: {
        background: '#fff',
        borderRadius: 12,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 440,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)',
    },
    logo: { fontSize: 22, fontWeight: 700, color: '#3b82f6', marginBottom: 20 },
    title: { margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#111' },
    subtitle: { margin: '0 0 24px', color: '#6b7280', fontSize: 14 },
    errorBox: {
        background: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#dc2626',
        borderRadius: 6,
        padding: '10px 14px',
        fontSize: 14,
        marginBottom: 16,
    },
    field: { marginBottom: 16 },
    label: { display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 },
    input: {
        display: 'block',
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: 6,
        fontSize: 14,
        outline: 'none',
        boxSizing: 'border-box',
    },
    roleOption: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 12px',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        cursor: 'pointer',
    },
    roleOptionActive: {
        border: '2px solid #3b82f6',
        background: '#eff6ff',
    },
    primaryBtn: {
        width: '100%',
        padding: '11px 0',
        background: '#3b82f6',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
        marginTop: 8,
    },
    footer: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' },
    link: { color: '#3b82f6', textDecoration: 'none', fontWeight: 500 },
};
