import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../api/axiosClient';

interface Application { status: string; applied_at: string }

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const FUNNEL_STEPS = [
    { key: 'applied', label: 'Applied', color: 'var(--color-brand)' },
    { key: 'reviewed', label: 'Reviewed', color: 'var(--color-teal-mid)' },
    { key: 'shortlisted', label: 'Shortlisted', color: 'var(--color-periwinkle)' },
    { key: 'interviewed', label: 'Interviewed', color: '#d97706' },
    { key: 'hired', label: 'Offered', color: '#16a34a' },
];

export default function AnalyticsPanel() {
    const [apps, setApps] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/jobs/my-applications')
            .then(r => setApps(r.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (!loading && apps.length === 0) {
        return (
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)', borderRadius: 16, padding: '32px 24px', boxShadow: '0 2px 12px rgba(20,154,160,0.07)', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
                <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>No analytics yet</h3>
                <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--color-text-muted)' }}>Apply to jobs to start tracking your application funnel and activity.</p>
                <Link href="/candidate/jobs" style={{ display: 'inline-block', padding: '9px 20px', background: 'var(--color-brand)', color: '#fff', borderRadius: 9, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                    Browse Jobs →
                </Link>
            </div>
        );
    }

    const funnel = [
        { ...FUNNEL_STEPS[0], value: apps.length },
        { ...FUNNEL_STEPS[1], value: apps.filter(a => a.status !== 'applied').length },
        { ...FUNNEL_STEPS[2], value: apps.filter(a => ['shortlisted', 'interviewed', 'hired'].includes(a.status)).length },
        { ...FUNNEL_STEPS[3], value: apps.filter(a => ['interviewed', 'hired'].includes(a.status)).length },
        { ...FUNNEL_STEPS[4], value: apps.filter(a => a.status === 'hired').length },
    ];

    const weekly = DAYS.map((day, i) => ({
        day,
        count: apps.filter(a => ((new Date(a.applied_at).getDay() + 6) % 7) === i).length,
    }));
    const maxCount = Math.max(...weekly.map(w => w.count), 1);

    const successRate = apps.length > 0 ? Math.round((funnel[4].value / apps.length) * 100) : 0;
    const shortlistRate = apps.length > 0 ? Math.round((funnel[2].value / apps.length) * 100) : 0;

    // Insight message
    let insight = '';
    if (apps.length < 5) insight = `Apply ${5 - apps.length} more jobs to get statistically meaningful results.`;
    else if (shortlistRate < 20) insight = `Your shortlist rate is ${shortlistRate}%. Try tailoring your resume to each job description.`;
    else if (shortlistRate >= 20) insight = `You're in the top 30% of applicants with a ${shortlistRate}% shortlist rate. Keep going!`;

    return (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)', borderRadius: 16, padding: '20px 22px', boxShadow: '0 2px 12px rgba(20,154,160,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>Analytics</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, background: '#f0fdf4', padding: '3px 10px', borderRadius: 20, border: '1px solid #bbf7d0' }}>
                        {successRate}% offer rate
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--color-brand-dark)', fontWeight: 600, background: 'var(--color-sky)', padding: '3px 10px', borderRadius: 20, border: '1px solid var(--color-border)' }}>
                        {shortlistRate}% shortlisted
                    </span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Funnel */}
                <div>
                    <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>Application Funnel</p>
                    {funnel.map((f, i) => (
                        <div key={f.key} style={{ marginBottom: 9 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{f.label}</span>
                                <span style={{ fontSize: 11, color: f.color, fontWeight: 700 }}>{f.value}</span>
                            </div>
                            <div style={{ height: 7, background: 'var(--color-sky)', borderRadius: 99, overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', borderRadius: 99, background: f.color,
                                    width: apps.length > 0 ? `${(f.value / apps.length) * 100}%` : '0%',
                                    transition: 'width 0.9s ease', opacity: 1 - i * 0.07,
                                }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Weekly bar chart */}
                <div>
                    <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>Weekly Activity</p>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 80 }}>
                        {weekly.map(w => (
                            <div key={w.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                                <span style={{ fontSize: 9, fontWeight: 600, color: w.count > 0 ? 'var(--color-brand-dark)' : 'transparent' }}>
                                    {w.count}
                                </span>
                                <div style={{
                                    width: '100%', borderRadius: '4px 4px 0 0',
                                    background: w.count > 0 ? 'var(--color-brand)' : 'var(--color-sky)',
                                    height: `${(w.count / maxCount) * 56}px`, minHeight: 4,
                                    transition: 'height 0.6s ease',
                                    border: '1px solid var(--color-border-light)',
                                }} />
                                <span style={{ fontSize: 9, color: 'var(--color-text-soft)' }}>{w.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Insight */}
            {insight && (
                <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--color-sky)', border: '1px solid var(--color-border)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--color-brand-dark)', lineHeight: 1.5 }}>{insight}</p>
                </div>
            )}
        </div>
    );
}
