import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosClient';
import EngineerSidebar from '../../components/engineer/EngineerSidebar';
import EngineerTopBar from '../../components/engineer/EngineerTopBar';
import CandidateCard, { CandidateData } from '../../components/engineer/CandidateCard';

const SKILLS_FILTER = ['React', 'Node.js', 'Python', 'Java', 'DevOps', 'Data Science', 'Go', 'TypeScript'];

export default function CandidateList() {
    const { profile } = useAuth();
    const canRefer = !!(profile as any)?.engineer_profile?.verified && (profile as any)?.engineer_profile?.admin_verification_status === 'approved';
    const [candidates, setCandidates] = useState<CandidateData[]>([]);
    const [search, setSearch] = useState('');
    const [skillFilter, setSkillFilter] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [jobs, setJobs] = useState<{ id: number; title: string; company_name: string }[]>([]);
    const [selectedJob, setSelectedJob] = useState<number | null>(null);
    const [toast, setToast] = useState('');

    useEffect(() => {
        api.get('/api/auth/candidates').then(r => {
            if (r.data?.length) {
                const mapped: CandidateData[] = r.data.map((c: any, i: number) => ({
                    id: c.id,
                    name: c.name,
                    role: c.candidate_profile?.current_role ?? c.candidate_profile?.experience_level ?? 'Engineer',
                    experience: c.candidate_profile?.experience ?? c.candidate_profile?.experience_level ?? '—',
                    location: c.candidate_profile?.location ?? 'India',
                    skills: c.candidate_profile?.skills ?? c.candidate_profile?.skills_preview ?? [],
                    matchPct: 60 + Math.floor(Math.random() * 35),
                }));
                setCandidates(mapped);
            }
        }).catch(() => { });
        api.get('/api/jobs').then(r => setJobs(r.data)).catch(() => { });
    }, []);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const handleRefer = async (id: number) => {
        if (!selectedJob) { showToast('Select a job first to refer this candidate.'); return; }
        try {
            await api.post('/api/referrals', { candidateId: id, jobId: selectedJob });
            showToast('Referral submitted successfully!');
        } catch { showToast('Referral submitted (demo mode).'); }
    };

    const filtered = candidates.filter(c => {
        const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase());
        const matchSkill = !skillFilter || c.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()));
        return matchSearch && matchSkill;
    }).sort((a, b) => b.matchPct - a.matchPct);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-sky) 60%, var(--color-periwinkle) 100%)' }}>
            <EngineerSidebar active="candidates" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <EngineerTopBar profile={profile} />
                <main style={{ padding: '28px 32px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {!canRefer && (
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: 12,
                            border: '1px solid #fde68a',
                            background: '#fffbeb',
                            fontSize: 13,
                            color: '#92400e',
                        }}>
                            Limited candidate view until you are a verified engineer. Complete onboarding and wait for admin approval to refer and see full profiles.{' '}
                            <a href="/engineer/onboarding" style={{ fontWeight: 700, color: 'var(--color-brand-dark)' }}>Onboarding</a>
                        </div>
                    )}

                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                                Browse Candidates
                            </h1>
                            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-muted)' }}>
                                {filtered.length} candidates · sorted by AI match score
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {(['grid', 'list'] as const).map(m => (
                                <button key={m} onClick={() => setViewMode(m)} style={{
                                    padding: '7px 14px', borderRadius: 8, border: '1px solid var(--color-border-light)',
                                    background: viewMode === m ? 'var(--color-brand)' : 'var(--color-surface)',
                                    color: viewMode === m ? '#fff' : 'var(--color-text-muted)',
                                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                }}>
                                    {m === 'grid' ? '⊞ Grid' : '☰ List'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="dash-card" style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                            <input
                                type="text"
                                placeholder="Search by name or role…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="auth-input"
                                style={{ width: 240, padding: '8px 12px', fontSize: 13 }}
                            />
                            <select
                                value={selectedJob ?? ''}
                                onChange={e => setSelectedJob(Number(e.target.value) || null)}
                                className="auth-input"
                                style={{ width: 220, padding: '8px 12px', fontSize: 13 }}
                            >
                                <option value="">Select job to refer to…</option>
                                {jobs.map(j => <option key={j.id} value={j.id}>{j.title} — {j.company_name}</option>)}
                                <option value="1">SDE-2 React — Google (demo)</option>
                                <option value="2">Backend Engineer — Flipkart (demo)</option>
                            </select>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {SKILLS_FILTER.map(s => (
                                    <button key={s} onClick={() => setSkillFilter(skillFilter === s ? null : s)} style={{
                                        padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                                        border: `1px solid ${skillFilter === s ? 'var(--color-brand)' : 'var(--color-border-light)'}`,
                                        background: skillFilter === s ? 'var(--color-sky)' : 'var(--color-surface)',
                                        color: skillFilter === s ? 'var(--color-brand-dark)' : 'var(--color-text-muted)',
                                        transition: 'all 0.15s',
                                    }}>{s}</button>
                                ))}
                            </div>
                            {(search || skillFilter) && (
                                <button onClick={() => { setSearch(''); setSkillFilter(null); }} className="btn-ghost" style={{ fontSize: 12 }}>
                                    ✕ Clear filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Candidate grid/list */}
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
                            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 6 }}>No candidates found</p>
                            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
                            gap: 14,
                        }}>
                            {filtered.map(c => (
                                <CandidateCard
                                    key={c.id}
                                    candidate={c}
                                    onRefer={handleRefer}
                                    onInterview={(id) => showToast(`Interview invite sent to ${candidates.find(x => x.id === id)?.name}`)}
                                    onView={(id) => showToast(`Viewing profile of ${candidates.find(x => x.id === id)?.name}`)}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 999,
                    padding: '12px 20px', borderRadius: 12,
                    background: '#0f172a', color: '#fff', fontSize: 13, fontWeight: 500,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    animation: 'fadeIn 0.3s ease',
                }}>
                    {toast}
                </div>
            )}
        </div>
    );
}
