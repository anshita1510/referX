import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const NAV = [
    {
        section: 'MAIN', items: [
            { id: 'overview', icon: '⊞', label: 'Overview', href: '/engineer/dashboard' },
            { id: 'candidates', icon: '👥', label: 'Candidates', href: '/engineer/candidates' },
            { id: 'referrals', icon: '🤝', label: 'Referrals', href: '/engineer/referrals' },
            { id: 'interviews', icon: '📅', label: 'Interviews', href: '/engineer/interviews' },
            { id: 'earnings', icon: '💰', label: 'Earnings', href: '/engineer/earnings' },
        ]
    },
    {
        section: 'ACCOUNT', items: [
            { id: 'profile', icon: '👤', label: 'Profile', href: '/engineer/profile' },
            { id: 'settings', icon: '⚙️', label: 'Settings', href: '/engineer/settings' },
        ]
    },
];

interface Props {
    active: string;
    monthlyEarnings?: number;
}

export default function EngineerSidebar({ active, monthlyEarnings }: Props) {
    const { profile, logout } = useAuth();

    return (
        <aside style={{
            width: 180, flexShrink: 0,
            background: 'var(--color-surface)',
            borderRight: '1px solid var(--color-border-light)',
            display: 'flex', flexDirection: 'column',
            padding: '20px 0', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        }}>
            {/* Brand */}
            <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--color-border-light)' }}>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--color-text-primary)' }}>
                    Refer<span style={{ color: 'var(--color-brand)' }}>X</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-soft)', marginTop: 2 }}>Engineer account</div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '16px 12px' }}>
                {NAV.map(group => (
                    <div key={group.section} style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-soft)', letterSpacing: '0.08em', padding: '0 8px', marginBottom: 6 }}>
                            {group.section}
                        </div>
                        {group.items.map(item => {
                            const isActive = active === item.id;
                            return (
                                <Link key={item.id} href={item.href} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                                        background: isActive ? 'var(--color-sky)' : 'transparent',
                                        borderLeft: isActive ? '2px solid var(--color-brand)' : '2px solid transparent',
                                        color: isActive ? 'var(--color-brand-dark)' : 'var(--color-text-muted)',
                                        fontSize: 13, fontWeight: isActive ? 600 : 400,
                                        transition: 'all 0.15s',
                                    }}>
                                        <span style={{ fontSize: 15 }}>{item.icon}</span>
                                        {item.label}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Earnings quick view — only shown when data is available */}
            {monthlyEarnings !== undefined && (
                <div style={{
                    margin: '0 12px 12px', padding: '12px 14px',
                    background: 'var(--color-sky)', borderRadius: 10,
                    border: '1px solid var(--color-border)',
                }}>
                    <div style={{ fontSize: 10, color: 'var(--color-text-soft)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 4 }}>THIS MONTH</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-brand-dark)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        ₹{monthlyEarnings.toLocaleString('en-IN')}
                    </div>
                </div>
            )}

            {/* User footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-border-light)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 2 }}>{profile?.name ?? 'Engineer'}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-soft)', marginBottom: 10 }}>{profile?.email ?? ''}</div>
                <button onClick={logout} style={{
                    width: '100%', padding: '7px 0', background: 'transparent',
                    border: '1px solid var(--color-border-light)', borderRadius: 8,
                    color: 'var(--color-text-muted)', fontSize: 12, cursor: 'pointer',
                }}>Log out</button>
            </div>
        </aside>
    );
}
