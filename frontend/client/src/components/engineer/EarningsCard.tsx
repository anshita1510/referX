import { useEffect, useState } from 'react';
import api from '../../api/axiosClient';

interface MonthlyPoint { month: string; amount: number }

interface Props {
    totalEarnings?: number;
    pendingPayout?: number;
}

export default function EarningsCard({ totalEarnings, pendingPayout = 0 }: Props) {
    const [withdrawing, setWithdrawing] = useState(false);
    const [withdrawn, setWithdrawn] = useState(false);
    const [interviewEarnings, setInterviewEarnings] = useState(0);
    const [referralEarnings, setReferralEarnings] = useState(0);
    const [monthlyData, setMonthlyData] = useState<MonthlyPoint[]>([]);

    useEffect(() => {
        api.get('/api/payments').then(r => {
            const payments: any[] = r.data ?? [];

            let ivTotal = 0;
            let refTotal = 0;
            const byMonth: Record<string, number> = {};

            payments.forEach((p: any) => {
                if (p.status !== 'paid') return;
                const amt = Number(p.amount);
                if (p.type === 'interview') ivTotal += amt;
                else refTotal += amt;

                const d = new Date(p.created_at);
                const key = d.toLocaleString('en-IN', { month: 'short' });
                byMonth[key] = (byMonth[key] ?? 0) + amt;
            });

            setInterviewEarnings(ivTotal);
            setReferralEarnings(refTotal);

            // Build last 6 months in order
            const months: MonthlyPoint[] = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const label = d.toLocaleString('en-IN', { month: 'short' });
                months.push({ month: label, amount: byMonth[label] ?? 0 });
            }
            setMonthlyData(months);
        }).catch(() => {
            // Build empty 6-month skeleton so chart still renders
            const months: MonthlyPoint[] = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                months.push({ month: d.toLocaleString('en-IN', { month: 'short' }), amount: 0 });
            }
            setMonthlyData(months);
        });
    }, []);

    const maxVal = Math.max(...monthlyData.map(d => d.amount), 1);
    const total = totalEarnings ?? (interviewEarnings + referralEarnings);

    const handleWithdraw = () => {
        setWithdrawing(true);
        setTimeout(() => { setWithdrawing(false); setWithdrawn(true); }, 1500);
    };

    return (
        <div className="dash-card" style={{ padding: '24px 26px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                    <p className="dash-card-sub" style={{ marginBottom: 4 }}>Total Earnings</p>
                    <div style={{
                        fontSize: 36, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif',
                        background: 'linear-gradient(to right, var(--color-brand-dark), var(--color-teal-light))',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        lineHeight: 1,
                    }}>
                        ₹{total.toLocaleString('en-IN')}
                    </div>
                </div>
                {pendingPayout > 0 && (
                    <button
                        onClick={handleWithdraw}
                        disabled={withdrawing || withdrawn}
                        style={{
                            padding: '10px 20px', borderRadius: 10, border: 'none',
                            cursor: withdrawing || withdrawn ? 'not-allowed' : 'pointer',
                            background: withdrawn ? '#f0fdf4' : 'linear-gradient(to right, var(--color-brand-dark), var(--color-teal-light))',
                            color: withdrawn ? '#16a34a' : '#fff',
                            fontSize: 13, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif',
                            boxShadow: withdrawn ? 'none' : '0 0 16px rgba(20,154,160,0.3)',
                            transition: 'all 0.3s', opacity: withdrawing ? 0.7 : 1,
                        }}>
                        {withdrawn ? '✓ Requested' : withdrawing ? 'Processing…' : `💸 Withdraw ₹${pendingPayout.toLocaleString('en-IN')}`}
                    </button>
                )}
            </div>

            {/* Breakdown — only show if we have data */}
            {(interviewEarnings > 0 || referralEarnings > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                    {[
                        { label: 'From Interviews', value: interviewEarnings, icon: '📅', color: '#7c3aed', bg: '#f5f3ff' },
                        { label: 'From Referrals', value: referralEarnings, icon: '🤝', color: 'var(--color-brand-dark)', bg: 'var(--color-sky)' },
                    ].map(item => (
                        <div key={item.label} style={{
                            padding: '14px 16px', borderRadius: 12,
                            background: item.bg, border: '1px solid var(--color-border-light)',
                            display: 'flex', alignItems: 'center', gap: 12,
                        }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                                {item.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: item.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                                    ₹{item.value.toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>{item.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Mini bar chart */}
            {monthlyData.length > 0 && (
                <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12 }}>Monthly Earnings</p>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 64 }}>
                        {monthlyData.map((d, i) => {
                            const isLast = i === monthlyData.length - 1;
                            const pct = (d.amount / maxVal) * 100;
                            return (
                                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <div style={{
                                        width: '100%', borderRadius: '4px 4px 0 0',
                                        height: `${Math.max(pct, 4)}%`,
                                        background: isLast
                                            ? 'linear-gradient(to top, var(--color-brand-dark), var(--color-teal-light))'
                                            : 'var(--color-sky)',
                                        border: isLast ? 'none' : '1px solid var(--color-border)',
                                        transition: 'height 0.5s ease',
                                        boxShadow: isLast ? '0 0 10px rgba(20,154,160,0.3)' : 'none',
                                    }} />
                                    <span style={{ fontSize: 10, color: isLast ? 'var(--color-brand)' : 'var(--color-text-soft)', fontWeight: isLast ? 700 : 400 }}>
                                        {d.month}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
