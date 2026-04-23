import Link from 'next/link';

const ACTIONS = [
    {
        icon: '🔍', label: 'Browse Jobs', sub: 'Find open positions', href: '/candidate/jobs',
        color: 'var(--color-brand)', bg: 'var(--color-sky)',
    },
    {
        icon: '🤝', label: 'Request Referral', sub: 'Ask an engineer to refer you', href: '/candidate/referrals',
        color: 'var(--color-brand-dark)', bg: 'var(--color-periwinkle)',
    },
    {
        icon: '📅', label: 'Book Interview', sub: 'Mock interview with engineer', href: '/candidate/interviews',
        color: '#7c3aed', bg: '#ede9fe',
    },
    {
        icon: '📄', label: 'Upload Docs', sub: 'Offer letter, salary slip', href: '/candidate/documents',
        color: '#d97706', bg: '#fef9ec',
    },
];

export default function QuickActions() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, width: '100%' }}>
            {ACTIONS.map(a => (
                <Link key={a.label} href={a.href} style={{ textDecoration: 'none' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '14px 16px', borderRadius: 14,
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border-light)',
                        boxShadow: '0 1px 6px rgba(20,154,160,0.06)',
                        cursor: 'pointer', transition: 'all 0.18s',
                    }}
                        onMouseEnter={e => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.borderColor = a.color;
                            el.style.background = a.bg;
                            el.style.transform = 'translateY(-2px)';
                            el.style.boxShadow = `0 6px 20px ${a.color}22`;
                        }}
                        onMouseLeave={e => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.borderColor = 'var(--color-border-light)';
                            el.style.background = 'var(--color-surface)';
                            el.style.transform = 'translateY(0)';
                            el.style.boxShadow = '0 1px 6px rgba(20,154,160,0.06)';
                        }}
                    >
                        <div style={{
                            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                            background: a.bg, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 20,
                            border: '1px solid var(--color-border-light)',
                        }}>{a.icon}</div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>{a.label}</div>
                            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>{a.sub}</div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
