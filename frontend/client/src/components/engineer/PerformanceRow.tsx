import Link from 'next/link';

interface Props {
    totalEarnings: number;
    interviewEarnings: number;
    referralEarnings: number;
    monthlyData: { month: string; amount: number }[];
    successRate: number;
    interviewsDone: number;
    successfulReferrals: number;
}

export default function PerformanceRow({
    totalEarnings, interviewEarnings, referralEarnings,
    monthlyData, successRate, interviewsDone, successfulReferrals,
}: Props) {
    const maxVal = Math.max(...monthlyData.map(d => d.amount), 1);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.8fr', gap: 14 }}>

            {/* Earnings breakdown */}
            <div className="dash-card" style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: 'var(--color-text-soft)', letterSpacing: '0.06em' }}>TOTAL EARNINGS</p>
                        <div style={{
                            fontSize: 30, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.1, marginTop: 2,
                            background: 'linear-gradient(to right, var(--color-brand-dark), var(--color-teal-light))',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>
                            ₹{totalEarnings.toLocaleString('en-IN')}
                        </div>
                    </div>
                    <Link href="/engineer/earnings" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-brand)', textDecoration: 'none' }}>
                        Details →
                    </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                        { label: 'Interviews', value: interviewEarnings, icon: '📅', color: '#7c3aed', bg: '#f5f3ff' },
                        { label: 'Referrals', value: referralEarnings, icon: '🤝', color: 'var(--color-brand-dark)', bg: 'var(--color-sky)' },
                    ].map(item => (
                        <div key={item.label} style={{
                            padding: '10px 12px', borderRadius: 10,
                            background: item.bg, border: '1px solid var(--color-border-light)',
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <span style={{ fontSize: 16 }}>{item.icon}</span>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: item.color, fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>
                                    ₹{item.value.toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>{item.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Monthly chart */}
            <div className="dash-card" style={{ padding: '20px 22px' }}>
                <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 600, color: 'var(--color-text-soft)', letterSpacing: '0.06em' }}>MONTHLY TREND</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 72 }}>
                    {monthlyData.map((d, i) => {
                        const isLast = i === monthlyData.length - 1;
                        const pct = (d.amount / maxVal) * 100;
                        return (
                            <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <div title={`₹${d.amount.toLocaleString('en-IN')}`} style={{
                                    width: '100%', borderRadius: '4px 4px 0 0',
                                    height: `${Math.max(pct, 5)}%`,
                                    background: isLast
                                        ? 'linear-gradient(to top, var(--color-brand-dark), var(--color-teal-light))'
                                        : 'var(--color-sky)',
                                    border: isLast ? 'none' : '1px solid var(--color-border)',
                                    transition: 'height 0.6s ease',
                                    boxShadow: isLast ? '0 0 10px rgba(20,154,160,0.3)' : 'none',
                                    cursor: 'default',
                                }} />
                                <span style={{ fontSize: 9, color: isLast ? 'var(--color-brand)' : 'var(--color-text-soft)', fontWeight: isLast ? 700 : 400 }}>
                                    {d.month}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Success metrics */}
            <div className="dash-card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: 'var(--color-text-soft)', letterSpacing: '0.06em' }}>PERFORMANCE</p>
                {[
                    { label: 'Referral Success', value: `${successRate}%`, color: '#16a34a', sub: 'of referrals hired' },
                    { label: 'Interviews Done', value: String(interviewsDone), color: '#7c3aed', sub: 'total sessions' },
                    { label: 'Hires Enabled', value: String(successfulReferrals), color: 'var(--color-brand-dark)', sub: 'candidates placed' },
                ].map(m => (
                    <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 1 }}>{m.label}</div>
                            <div style={{ fontSize: 9, color: 'var(--color-text-soft)' }}>{m.sub}</div>
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: m.color, fontFamily: 'Space Grotesk, sans-serif' }}>{m.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
