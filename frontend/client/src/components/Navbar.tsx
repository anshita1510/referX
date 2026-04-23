'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS: Record<string, { label: string; href: string }[]> = {
    candidate: [
        { label: 'Dashboard', href: '/candidate/dashboard' },
        { label: 'Browse Jobs', href: '/candidate/jobs' },
        { label: 'My Referrals', href: '/candidate/referrals' },
        { label: 'Interviews', href: '/candidate/interviews' },
        { label: 'Documents', href: '/candidate/documents' },
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
    const { isAuthenticated, role, logout, getDashboardPath, user } = useAuth();
    const pathname = usePathname();
    const links = role ? (NAV_LINKS[role] ?? []) : [];

    return (
        <nav style={{
            display: 'flex', alignItems: 'center', padding: '0 24px', height: 56,
            background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-light)',
            position: 'sticky', top: 0, zIndex: 100,
            boxShadow: '0 1px 8px rgba(20,154,160,0.07)',
        }}>
            <Link href={isAuthenticated ? getDashboardPath() : '/'} style={{
                fontSize: 20, fontWeight: 800, color: 'var(--color-text-primary)',
                textDecoration: 'none', marginRight: 32, fontFamily: 'Space Grotesk, sans-serif',
            }}>
                Refer<span style={{ color: 'var(--color-brand)' }}>X</span>
            </Link>

            {isAuthenticated && (
                <div style={{ display: 'flex', gap: 2, flex: 1, overflowX: 'auto' }}>
                    {links.map(l => (
                        <Link key={l.href} href={l.href} style={{
                            padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                            color: pathname === l.href ? 'var(--color-brand-dark)' : 'var(--color-text-muted)',
                            textDecoration: 'none', whiteSpace: 'nowrap',
                            background: pathname === l.href ? 'var(--color-sky)' : 'transparent',
                            transition: 'background 0.15s',
                        }}>
                            {l.label}
                        </Link>
                    ))}
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
                {isAuthenticated ? (
                    <>
                        <span style={{
                            fontSize: 12, fontWeight: 600, color: 'var(--color-brand-dark)',
                            background: 'var(--color-sky)', padding: '3px 10px',
                            borderRadius: 20, textTransform: 'capitalize',
                        }}>{user?.name ?? role}</span>
                        <button onClick={logout} style={{
                            padding: '6px 14px', border: '1px solid var(--color-border)',
                            borderRadius: 8, background: 'var(--color-surface)', fontSize: 13,
                            cursor: 'pointer', color: 'var(--color-text-muted)', fontFamily: 'DM Sans, sans-serif',
                        }}>Log out</button>
                    </>
                ) : (
                    <>
                        <Link href="/login" style={{ padding: '6px 12px', fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'none' }}>Sign in</Link>
                        <Link href="/register" style={{
                            padding: '7px 16px', background: 'var(--color-brand)', color: '#fff',
                            borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none',
                        }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
