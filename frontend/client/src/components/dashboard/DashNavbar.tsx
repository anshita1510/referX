import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
    { label: 'Overview', href: '/candidate/dashboard' },
    { label: 'Browse Jobs', href: '/candidate/jobs' },
    { label: 'Referrals', href: '/candidate/referrals' },
    { label: 'Interviews', href: '/candidate/interviews' },
    { label: 'Documents', href: '/candidate/documents' },
];

export default function DashNavbar() {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    return (
        <header style={{
            background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--color-border-light)',
            position: 'sticky', top: 0, zIndex: 50,
        }}>
            <div style={{ width: '100%', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Brand */}
                <Link to="/candidate/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                    <img src="/logo.png" alt="ReferX" style={{ height: 32, width: 32, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 35%' }} />
                    <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', letterSpacing: '-0.5px' }}>
                        Refer<span style={{ color: 'var(--color-brand)' }}>X</span>
                    </span>
                </Link>

                {/* Nav links */}
                <nav style={{ display: 'flex', gap: 2 }}>
                    {NAV_LINKS.map(l => {
                        const active = location.pathname === l.href;
                        return (
                            <Link key={l.href} to={l.href} style={{
                                padding: '6px 14px', borderRadius: 8,
                                fontSize: 'var(--text-base)', fontWeight: active ? 600 : 500,
                                color: active ? 'var(--color-brand-dark)' : 'var(--color-text-muted)',
                                background: active ? 'var(--color-sky)' : 'transparent',
                                textDecoration: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap',
                                fontFamily: 'var(--font-body)',
                            }}
                                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = 'var(--color-brand)'; (e.currentTarget as HTMLElement).style.background = 'var(--color-sky)'; } }}
                                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}
                            >{l.label}</Link>
                        );
                    })}
                </nav>

                {/* Right */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                        fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20,
                        background: 'var(--color-sky)', color: 'var(--color-brand-dark)',
                        border: '1px solid var(--color-border)',
                    }}>{user?.name?.split(' ')[0] ?? 'Candidate'}</span>
                    <button onClick={logout} style={{
                        padding: '6px 14px', border: '1px solid var(--color-border)',
                        borderRadius: 8, background: 'var(--color-surface)', fontSize: 13,
                        cursor: 'pointer', color: 'var(--color-text-muted)', fontFamily: 'DM Sans, sans-serif',
                    }}>Log out</button>
                    <button onClick={() => setOpen(o => !o)} style={{ display: 'none', padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-brand)' }}>
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>
        </header>
    );
}
