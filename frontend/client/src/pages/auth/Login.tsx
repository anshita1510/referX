import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const { login, loginWithGoogle, error, clearError } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();
        setBusy(true);
        const result = await login(email, password);
        setBusy(false);
        if (result.success) navigate('/');
    };

    const handleGoogle = async () => {
        clearError();
        setBusy(true);
        const result = await loginWithGoogle(null);
        setBusy(false);
        if (result.success) navigate('/');
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.logo}>ReferX</div>
                <h2 style={styles.title}>Welcome back</h2>
                <p style={styles.subtitle}>Sign in to your account</p>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit}>
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
                            placeholder="••••••••"
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" disabled={busy} style={styles.primaryBtn}>
                        {busy ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <div style={styles.divider}><span>or</span></div>

                <button onClick={handleGoogle} disabled={busy} style={styles.googleBtn}>
                    <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: 8 }}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    Continue with Google
                </button>

                <p style={styles.footer}>
                    No account? <Link to="/register" style={styles.link}>Register</Link>
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
    },
    card: {
        background: '#fff',
        borderRadius: 12,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)',
    },
    logo: {
        fontSize: 22,
        fontWeight: 700,
        color: '#3b82f6',
        marginBottom: 20,
    },
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
        marginTop: 4,
    },
    divider: {
        textAlign: 'center',
        margin: '20px 0',
        color: '#9ca3af',
        fontSize: 13,
        position: 'relative',
    },
    googleBtn: {
        width: '100%',
        padding: '10px 0',
        background: '#fff',
        border: '1px solid #d1d5db',
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' },
    link: { color: '#3b82f6', textDecoration: 'none', fontWeight: 500 },
};
