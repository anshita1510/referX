import Link from 'next/link';

interface ActionCardProps {
    icon: string;
    label: string;
    sub: string;
    earn?: string;
    href: string;
    primary?: boolean;
    color: string;
    bg: string;
    border: string;
}

function ActionCard({ icon, label, sub, earn, href, primary, color, bg, border }: ActionCardProps) {
    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <div style={{
                padding: primary ? '20px 22px' : '16px 18px',
                borderRadius: 14,
                background: primary ? `linear-gradient(135deg, ${color}18, ${color}08)` : 'var(--color-surface)',
                border: `1.5px solid ${primary ? color + '40' : border}`,
                boxShadow: primary ? `0 4px 20px ${color}18` : '0 1px 4px rgba(0,0,0,0.04)',
                cursor: 'pointer', transition: 'all 0.18s',
                display: 'flex', flexDirection: 'column', gap: 10, height: '100%',
            }}
                onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = color;
                    el.style.transform = 'translateY(-3px)';
                    el.style.boxShadow = `0 8px 28px ${color}28`;
                }}
                onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = primary ? color + '40' : border;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = primary ? `0 4px 20px ${color}18` : '0 1px 4px rgba(0,0,0,0.04)';
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: bg, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 20, flexShrink: 0,
                        border: `1px solid ${border}`,
                    }}>{icon}</div>
                    {primary && (
                        <span style={{
                            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                            background: color, color: '#fff', letterSpacing: '0.04em',
                        }}>PRIMARY</span>
                    )}
                </div>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 3 }}>
                        {label}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{sub}</div>
                </div>
                {earn && (
                    <div style={{
                        marginTop: 'auto', padding: '6px 10px', borderRadius: 8,
                        background: '#f0fdf4', border: '1px solid #bbf7d0',
                        fontSize: 12, fontWeight: 700, color: '#16a34a',
                        display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
                    }}>
                        💰 {earn}
                    </div>
                )}
            </div>
        </Link>
    );
}

export default function ActionZone() {
    const ACTIONS = [
        {
            icon: '▶', label: 'Start Interview', sub: 'Conduct a mock session and earn per session',
            earn: 'Earn ₹999/session', href: '/engineer/interviews',
            primary: true, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe',
        },
        {
            icon: '👥', label: 'Browse Candidates', sub: 'Find high-match profiles to refer to your company',
            earn: 'Earn ₹5,000/hire', href: '/engineer/candidates',
            primary: false, color: 'var(--color-brand-dark)', bg: 'var(--color-sky)', border: 'var(--color-border)',
        },
        {
            icon: '🤝', label: 'Refer Candidate', sub: 'Approve pending requests or submit new referrals',
            earn: undefined, href: '/engineer/referrals',
            primary: false, color: '#d97706', bg: '#fef9ec', border: '#fde68a',
        },
        {
            icon: '💰', label: 'View Earnings', sub: 'Track income, withdraw, and see your payout history',
            earn: undefined, href: '/engineer/earnings',
            primary: false, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0',
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        Quick Actions
                    </h2>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>Your highest-impact moves right now</p>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {ACTIONS.map(a => <ActionCard key={a.label} {...a} />)}
            </div>
        </div>
    );
}
