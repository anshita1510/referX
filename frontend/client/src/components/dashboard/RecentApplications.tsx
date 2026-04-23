import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../api/axiosClient';
import { useRefresh } from '../../context/RefreshContext';

interface Application {
    id: number;
    job: { title: string; company?: { name: string }; location?: string };
    status: string;
    applied_at: string;
}

const STATUS: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    applied: { label: 'Applied', color: 'var(--color-text-muted)', bg: 'var(--color-sky)', dot: 'var(--color-border)' },
    under_review: { label: 'Under review', color: '#d97706', bg: '#fef9ec', dot: '#d97706' },
    shortlisted: { label: 'Shortlisted', color: 'var(--color-brand-dark)', bg: 'var(--color-periwinkle)', dot: 'var(--color-brand)' },
    interviewed: { label: 'Interviewed', color: '#7c3aed', bg: '#ede9fe', dot: '#7c3aed' },
    hired: { label: 'Hired 🎉', color: '#16a34a', bg: '#f0fdf4', dot: '#16a34a' },
    rejected: { label: 'Rejected', color: '#dc2626', bg: '#fef2f2', dot: '#dc2626' },
};

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
}

export default function RecentApplications() {
    const { tick } = useRefresh();
    const [apps, setApps] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get('/api/jobs/my-applications')
            .then(r => setApps(r.data.slice(0, 4)))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [tick]);

    return (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)', borderRadius: 16, padding: '20px 22px', boxShadow: '0 2px 12px rgba(20,154,160,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <p className="dash-card-title">Recent Applications</p>
                <Link href="/candidate/jobs" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-brand)', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
            </div>

            {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ height: 56, borderRadius: 12, background: 'var(--color-sky)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                    ))}
                </div>
            )}

            {!loading && apps.length === 0 && (
                <div style={{ textAlign: 'center', padding: '28px 0' }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
                    <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>No applications yet</p>
                    <p style={{ margin: '0 0 16px', fontSize: 12, color: 'var(--color-text-muted)' }}>Start applying to jobs to track your progress here.</p>
                    <Link href="/candidate/jobs" style={{ display: 'inline-block', padding: '8px 18px', background: 'var(--color-brand)', color: '#fff', borderRadius: 9, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                        Browse Jobs →
                    </Link>
                </div>
            )}

            {!loading && apps.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {apps.map(app => {
                        const s = STATUS[app.status] ?? STATUS['applied'];
                        return (
                            <div key={app.id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '12px 16px', background: 'var(--color-sky)',
                                borderRadius: 12, border: '1px solid var(--color-border-light)',
                                transition: 'border-color 0.15s',
                            }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-brand)'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-light)'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                                            {app.job?.title}
                                        </div>
                                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>
                                            {app.job?.company?.name}{app.job?.location ? ` · ${app.job.location}` : ''} · {timeAgo(app.applied_at)}
                                        </div>
                                    </div>
                                </div>
                                <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: s.bg, color: s.color, fontWeight: 600, flexShrink: 0, border: '1px solid var(--color-border-light)' }}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
