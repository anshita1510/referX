import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const NAV = [
    {
        section: 'MAIN', items: [
            { id: 'overview', icon: '⊞', label: 'Overview' },
            { id: 'jobs', icon: '🔍', label: 'Browse Jobs', href: '/candidate/jobs' },
            { id: 'applications', icon: '📋', label: 'My Applications' },
            { id: 'referrals', icon: '🤝', label: 'My Referrals', href: '/candidate/referrals' },
            { id: 'interviews', icon: '📅', label: 'Mock Interviews', href: '/candidate/interviews' },
        ]
    },
    {
        section: 'PROFILE', items: [
            { id: 'profile', icon: '👤', label: 'Edit Profile', href: '/candidate/profile-setup' },
            { id: 'documents', icon: '📄', label: 'Upload Documents', href: '/candidate/documents' },
        ]
    },
];

interface Props { active: string; onNav: (s: string) => void; profile: any; }

export default function Sidebar({ active, onNav, profile }: Props) {
    const { logout } = useAuth();
    return (
        <aside style={{
            width: 220, flexShrink: 0, background: '#161b27',
            borderRight: '1px solid #1e2535', display: 'flex', flexDirection: 'column',
            padding: '20px 0', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        }}>
            {/* Brand */}
            <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #1e2535' }}>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: '#fff' }}>
                    Refer<span style={{ color: '#149AA0' }}>X</span>
                </div>
                <div style={{ fontSize: 11, color: '#4b5563', marginTop: 2 }}>Candidate account</div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '16px 12px' }}>
                {NAV.map(group => (
                    <div key={group.section} style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#374151', letterSpacing: '0.08em', padding: '0 8px', marginBottom: 6 }}>
                            {group.section}
                        </div>
                        {group.items.map(item => {
                            const isActive = active === item.id;
                            const inner = (
                                <div key={item.id}
                                    onClick={() => onNav(item.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                                        background: isActive ? 'rgba(20,154,160,0.15)' : 'transparent',
                                        borderLeft: isActive ? '2px solid #149AA0' : '2px solid transparent',
                                        color: isActive ? '#79C5C8' : '#6b7280',
                                        fontSize: 13, fontWeight: isActive ? 600 : 400,
                                        transition: 'all 0.15s',
                                    }}>
                                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                                    {item.label}
                                </div>
                            );
                            return item.href
                                ? <Link key={item.id} href={item.href} style={{ textDecoration: 'none' }}>{inner}</Link>
                                : inner;
                        })}
                    </div>
                ))}
            </nav>

            {/* User footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #1e2535' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>{profile?.name ?? 'Candidate'}</div>
                <div style={{ fontSize: 11, color: '#4b5563', marginBottom: 10 }}>{profile?.email ?? ''}</div>
                <button onClick={logout} style={{
                    width: '100%', padding: '7px 0', background: 'transparent',
                    border: '1px solid #1e2535', borderRadius: 8, color: '#6b7280',
                    fontSize: 12, cursor: 'pointer',
                }}>Log out</button>
            </div>
        </aside>
    );
}
