import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS: Record<string, { label: string; href: string }[]> = {
    candidate: [
        { label: 'Dashboard', href: '/candidate/dashboard' },
        { label: 'Browse Jobs', href: '/candidate/jobs' },
        { label: 'My Referrals', href: '/candidate/referrals' },
    ],
    engineer: [
        { label: 'Dashboard', href: '/engineer/dashboard' },
        { label: 'Candidates', href: '/engineer/candidates' },
        { label: 'Earnings', href: '/engineer/earnings' },
    ],
    company: [
        { label: 'Dashboard', href: '/company/dashboard' },
        { label: 'Post a Job', href: '/company/post-job' },
    ],
};

export default function Navbar() {
    const { isAuthenticated, role, logout, getDashboardPath } = useAuth();
    const location = useLocation();
    const links = role ? (NAV_LINKS[role] ?? []) : [];

    return (
        <nav style={styles.nav}>
            <Link to={isAuthenticated ? getDashboardPath() : '/'} style={styles.brand}>
                Refer<span style={{ color: '#3b82f6' }}>X</span>
            </Link>

            {isAuthenticated && (
                <div style={styles.links}>
                    {links.map(l => (
                        <Link
                            key={l.href}
                            to={l.href}
                            style={{
                                ...styles.link,
                                ...(location.pathname === l.href ? styles.linkActive : {}),
                            }}
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>
            )}

            <div style={styles.right}>
                {isAuthenticated ? (
                    <>
                        <span style={styles.roleBadge}>{role}</span>
                        <button onClick={logout} style={styles.logoutBtn}>Log out</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Sign in</Link>
                        <Link to="/register" style={styles.registerBtn}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

const styles: Record<string, React.CSSProperties> = {
    nav: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        height: 56,
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        fontFamily: 'system-ui, sans-serif',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    brand: {
        fontSize: 20,
        fontWeight: 800,
        color: '#111',
        textDecoration: 'none',
        marginRight: 32,
        letterSpacing: '-0.5px',
    },
    links: { display: 'flex', gap: 4, flex: 1 },
    link: {
        padding: '6px 12px',
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 500,
        color: '#374151',
        textDecoration: 'none',
    },
    linkActive: {
        background: '#eff6ff',
        color: '#3b82f6',
    },
    right: { display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' },
    roleBadge: {
        fontSize: 12,
        fontWeight: 600,
        color: '#6b7280',
        background: '#f3f4f6',
        padding: '3px 10px',
        borderRadius: 20,
        textTransform: 'capitalize',
    },
    logoutBtn: {
        padding: '6px 14px',
        border: '1px solid #d1d5db',
        borderRadius: 6,
        background: '#fff',
        fontSize: 14,
        cursor: 'pointer',
        color: '#374151',
    },
    registerBtn: {
        padding: '6px 14px',
        background: '#3b82f6',
        color: '#fff',
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 500,
        textDecoration: 'none',
    },
};
