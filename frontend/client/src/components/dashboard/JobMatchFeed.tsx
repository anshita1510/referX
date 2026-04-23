import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

interface Job {
    id: number;
    title: string;
    company_name?: string;
    location?: string;
    salary_range?: string;
    skills_required?: string[];
    description?: string;
}

function matchScore(jobSkills: string[], profileSkills: string[]): number {
    if (!jobSkills?.length || !profileSkills?.length) return 0;
    const js = jobSkills.map(s => s.toLowerCase());
    const ps = profileSkills.map(s => s.toLowerCase());
    const matched = js.filter(s => ps.includes(s)).length;
    return Math.round((matched / js.length) * 100);
}

function MatchBadge({ pct }: { pct: number }) {
    const color = pct >= 75 ? 'var(--color-brand)' : pct >= 50 ? '#d97706' : 'var(--color-text-soft)';
    const c = 2 * Math.PI * 14;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flexShrink: 0 }}>
            <svg width={36} height={36}>
                <circle cx={18} cy={18} r={14} fill="none" stroke="var(--color-sky)" strokeWidth={3} />
                <circle cx={18} cy={18} r={14} fill="none" stroke={color} strokeWidth={3}
                    strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)}
                    strokeLinecap="round" transform="rotate(-90 18 18)" />
                <text x={18} y={18} textAnchor="middle" dominantBaseline="central"
                    fill={color} fontSize={8} fontWeight={800} fontFamily="Space Grotesk, sans-serif">{pct}%</text>
            </svg>
            <span style={{ fontSize: 9, color: 'var(--color-text-soft)' }}>match</span>
        </div>
    );
}

export default function JobMatchFeed() {
    const { profile } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applying, setApplying] = useState<number | null>(null);
    const [applied, setApplied] = useState<Set<number>>(new Set());
    const [toast, setToast] = useState<string | null>(null);

    const profileSkills: string[] = profile?.candidate_profile?.skills ?? profile?.skills ?? [];

    useEffect(() => {
        Promise.allSettled([
            api.get('/api/jobs'),
            api.get('/api/jobs/my-applications'),
        ]).then(([jobsRes, appsRes]) => {
            const appliedIds = new Set<number>(
                appsRes.status === 'fulfilled' ? appsRes.value.data.map((a: any) => a.job_id) : []
            );
            if (appliedIds.size > 0) setApplied(appliedIds);
            if (jobsRes.status === 'fulfilled') {
                const unapplied = jobsRes.value.data.filter((j: any) => !appliedIds.has(j.id));
                setJobs(unapplied.slice(0, 4));
            }
        });
    }, []);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const handleApply = async (jobId: number) => {
        const isApplied = applied.has(jobId);
        setApplying(jobId);
        try {
            if (isApplied) {
                await api.delete(`/api/jobs/${jobId}/apply`);
                setApplied(prev => { const s = new Set(prev); s.delete(jobId); return s; });
            } else {
                await api.post(`/api/jobs/${jobId}/apply`);
                setApplied(prev => new Set(prev).add(jobId));
            }
        } catch (err: any) {
            showToast(err.response?.data?.error ?? 'Something went wrong.');
        } finally { setApplying(null); }
    };

    return (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)', borderRadius: 16, padding: '20px 22px', boxShadow: '0 2px 12px rgba(20,154,160,0.07)', position: 'relative' }}>
            {toast && (
                <div style={{
                    position: 'fixed', top: 16, right: 16, zIndex: 999,
                    background: 'var(--color-brand)', color: '#fff',
                    padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                    boxShadow: '0 4px 16px rgba(20,154,160,0.3)',
                }}>{toast}</div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <p className="dash-card-title">Recommended for You</p>
                    <p className="dash-card-sub">Matched based on your skills</p>
                </div>
                <Link href="/candidate/jobs" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-brand)', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
            </div>

            {jobs.length === 0 && (
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-soft)', textAlign: 'center', padding: '20px 0' }}>Loading jobs…</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {jobs.map(job => {
                    const pct = matchScore(job.skills_required ?? [], profileSkills);
                    const isApplied = applied.has(job.id);
                    return (
                        <div key={job.id} style={{
                            background: 'var(--color-sky)', border: '1px solid var(--color-border-light)',
                            borderRadius: 14, padding: '14px 16px', transition: 'border-color 0.2s',
                        }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-brand)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-light)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                                <div style={{ flex: 1 }}>
                                    <p className="text-title" style={{ margin: '0 0 3px' }}>{job.title}</p>
                                    <p className="text-meta" style={{ margin: '0 0 8px' }}>
                                        {job.company_name}{job.location ? ` · ${job.location}` : ''}{job.salary_range ? ` · ${job.salary_range}` : ''}
                                    </p>
                                    {job.skills_required && job.skills_required.length > 0 && (
                                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                                            {job.skills_required.slice(0, 4).map(s => (
                                                <span key={s} className="skill-tag">{s}</span>
                                            ))}
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button
                                            onClick={() => handleApply(job.id)}
                                            disabled={applying === job.id}
                                            style={{
                                                padding: '6px 14px',
                                                background: isApplied ? '#f0fdf4' : 'var(--color-brand)',
                                                color: isApplied ? '#16a34a' : '#fff',
                                                border: isApplied ? '1.5px solid #bbf7d0' : 'none',
                                                borderRadius: 8, fontSize: 'var(--text-sm)', fontWeight: 600,
                                                cursor: applying === job.id ? 'wait' : 'pointer',
                                                fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                                            }}>
                                            {applying === job.id
                                                ? (isApplied ? 'Withdrawing…' : 'Applying…')
                                                : isApplied ? 'Applied ✓' : 'Apply'}
                                        </button>
                                        <Link href="/candidate/referrals" style={{
                                            padding: '6px 14px', background: 'var(--color-surface)',
                                            color: 'var(--color-brand-dark)', border: '1.5px solid var(--color-brand)',
                                            borderRadius: 8, fontSize: 11, fontWeight: 600, textDecoration: 'none',
                                        }}>Ask Referral</Link>
                                    </div>
                                </div>
                                {pct > 0 && <MatchBadge pct={pct} />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
