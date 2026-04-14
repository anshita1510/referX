import { useEffect, useState } from 'react';
import api from '../../api/axiosClient';

interface Stats { applications: number; referrals: number; interviews: number; offers: number }

export default function StatsRow() {
    const [stats, setStats] = useState<Stats>({ applications: 0, referrals: 0, interviews: 0, offers: 0 });

    useEffect(() => {
        Promise.allSettled([
            api.get('/api/jobs/my-applications'),
            api.get('/api/referrals'),
            api.get('/api/interviews'),
        ]).then(([apps, refs, ivs]) => {
            const refData = refs.status === 'fulfilled' ? refs.value.data : [];
            setStats({
                applications: apps.status === 'fulfilled' ? apps.value.data.length : 0,
                referrals: refData.length,
                interviews: ivs.status === 'fulfilled' ? ivs.value.data.length : 0,
                offers: refData.filter((r: any) => r.status === 'hired').length,
            });
        });
    }, []);

    const CARDS = [
        { label: 'Applications sent', value: stats.applications, color: 'var(--color-brand)', bg: 'var(--color-sky)', icon: '📤' },
        { label: 'Referrals received', value: stats.referrals, color: 'var(--color-brand-dark)', bg: 'var(--color-periwinkle)', icon: '🤝' },
        { label: 'Interviews booked', value: stats.interviews, color: 'var(--color-brand)', bg: 'var(--color-sky)', icon: '📅' },
        { label: 'Offers received', value: stats.offers, color: 'var(--color-brand-dark)', bg: 'var(--color-periwinkle)', icon: '🎉' },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, width: '100%' }}>
            {CARDS.map(c => (
                <div key={c.label} style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: 16, padding: '20px 22px',
                    boxShadow: '0 2px 12px rgba(20,154,160,0.07)',
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-brand)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(20,154,160,0.15)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-light)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(20,154,160,0.07)'; }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ fontSize: 32, fontWeight: 800, color: c.color, fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>{c.value}</div>
                            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>{c.label}</div>
                        </div>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: '1px solid var(--color-border-light)' }}>
                            {c.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
