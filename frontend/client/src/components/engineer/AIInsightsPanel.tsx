import { useState } from 'react';

interface Insight {
    icon: string;
    title: string;
    desc: string;
    cta: string | null;
    color: string;
    bg: string;
    border: string;
    urgent?: boolean;
}

interface Props {
    totalEarnings: number;
    pendingReferrals: number;
    upcomingInterviews: number;
    successRate: number;
}

export default function AIInsightsPanel({ totalEarnings, pendingReferrals, upcomingInterviews, successRate }: Props) {
    const [dismissed, setDismissed] = useState<number[]>([]);

    const insights: Insight[] = [
        ...(upcomingInterviews === 0 ? [{
            icon: '🚨',
            title: 'You have open interview slots',
            desc: 'Taking 2 interviews today could add ₹1,998 to this month\'s earnings.',
            cta: 'Browse Candidates',
            color: '#dc2626', bg: '#fef2f2', border: '#fecaca', urgent: true,
        }] : []),
        {
            icon: '💡',
            title: `Earn ₹${(5000 - (totalEarnings % 5000)).toLocaleString('en-IN')} more this week`,
            desc: 'Refer one candidate to hit your next earnings milestone.',
            cta: 'Browse Candidates',
            color: '#d97706', bg: '#fef9ec', border: '#fde68a',
        },
        {
            icon: '🎯',
            title: 'High-match candidates waiting',
            desc: 'Several candidates have 80%+ match for roles at your company.',
            cta: 'View Matches',
            color: 'var(--color-brand-dark)', bg: 'var(--color-sky)', border: 'var(--color-border)',
        },
        {
            icon: '📈',
            title: `Your success rate: ${successRate}%`,
            desc: successRate >= 68
                ? 'Above platform average of 68%. Keep it up!'
                : 'Platform average is 68%. Refer stronger candidates to improve.',
            cta: null,
            color: successRate >= 68 ? '#16a34a' : '#d97706',
            bg: successRate >= 68 ? '#f0fdf4' : '#fef9ec',
            border: successRate >= 68 ? '#bbf7d0' : '#fde68a',
        },
        {
            icon: '🤖',
            title: 'Interview question bank ready',
            desc: 'We\'ve prepared questions based on your upcoming interview topics.',
            cta: 'View Questions',
            color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe',
        },
        ...(pendingReferrals > 0 ? [{
            icon: '⏳',
            title: `${pendingReferrals} referral${pendingReferrals > 1 ? 's' : ''} need your decision`,
            desc: 'Candidates are waiting. Approve to unlock your referral bonus.',
            cta: 'Review Now',
            color: '#d97706', bg: '#fef9ec', border: '#fde68a', urgent: true,
        }] : []),
    ].filter((_, i) => !dismissed.includes(i));

    return (
        <div className="dash-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{
                    width: 26, height: 26, borderRadius: 7,
                    background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                }}>🤖</div>
                <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        AI Insights
                    </p>
                    <p style={{ margin: 0, fontSize: 10, color: 'var(--color-text-muted)' }}>Personalized for you</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {insights.map((ins, i) => (
                    <div key={i} style={{
                        padding: '10px 12px', borderRadius: 10,
                        background: ins.bg, border: `1px solid ${ins.border}`,
                        display: 'flex', gap: 8, alignItems: 'flex-start',
                        boxShadow: ins.urgent ? `0 0 0 2px ${ins.border}` : 'none',
                    }}>
                        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{ins.icon}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: ins.color, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 2 }}>
                                {ins.title}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                                {ins.desc}
                            </div>
                            {ins.cta && (
                                <button style={{
                                    marginTop: 7, padding: '3px 10px', borderRadius: 20,
                                    border: `1px solid ${ins.border}`,
                                    background: '#fff', color: ins.color, fontSize: 10, fontWeight: 700,
                                    cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
                                }}>
                                    {ins.cta} →
                                </button>
                            )}
                        </div>
                        <button onClick={() => setDismissed(d => [...d, i])} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 12, color: 'var(--color-text-soft)', padding: '0 2px', flexShrink: 0,
                        }}>✕</button>
                    </div>
                ))}
                {insights.length === 0 && (
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center', padding: '12px 0' }}>
                        All insights dismissed. Check back tomorrow.
                    </p>
                )}
            </div>
        </div>
    );
}
