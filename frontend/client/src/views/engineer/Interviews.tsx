import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosClient';
import EngineerSidebar from '../../components/engineer/EngineerSidebar';
import EngineerTopBar from '../../components/engineer/EngineerTopBar';
import InterviewScheduler, { InterviewSlot } from '../../components/engineer/InterviewScheduler';

const DUMMY: InterviewSlot[] = [];

type Tab = 'upcoming' | 'completed' | 'cancelled';

export default function EngineerInterviews() {
    const { profile } = useAuth();
    const [interviews, setInterviews] = useState<InterviewSlot[]>(DUMMY);
    const [tab, setTab] = useState<Tab>('upcoming');
    const [toast, setToast] = useState('');

    useEffect(() => {
        api.get('/api/interviews').then(r => {
            const data: InterviewSlot[] = r.data.map((iv: any) => ({
                id: iv.id,
                candidateName: iv.candidate?.name ?? iv.candidate_name ?? 'Candidate',
                candidateRole: iv.candidate?.candidate_profile?.current_role ?? '—',
                scheduledAt: iv.scheduled_at ?? new Date().toISOString(),
                duration: iv.duration ?? 60,
                status: iv.status === 'booked' ? 'upcoming' : iv.status === 'done' ? 'completed' : (iv.status ?? 'upcoming'),
                earnings: Number(iv.fee ?? 0),
                feedback: iv.feedback ?? undefined,
            }));
            setInterviews(data);
        }).catch(() => { });
    }, []);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const counts = {
        upcoming: interviews.filter(i => i.status === 'upcoming').length,
        completed: interviews.filter(i => i.status === 'completed').length,
        cancelled: interviews.filter(i => i.status === 'cancelled').length,
    };

    const totalEarned = interviews.filter(i => i.status === 'completed').reduce((s, i) => s + i.earnings, 0);
    const filtered = interviews.filter(i => i.status === tab);

    const tabConfig: Record<Tab, { label: string; color: string; bg: string }> = {
        upcoming: { label: 'Upcoming', color: '#2563eb', bg: '#eff6ff' },
        completed: { label: 'Completed', color: '#16a34a', bg: '#f0fdf4' },
        cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#fef2f2' },
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-sky) 60%, var(--color-periwinkle) 100%)' }}>
            <EngineerSidebar active="interviews" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <EngineerTopBar profile={profile} />
                <main style={{ padding: '28px 32px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                                Interviews
                            </h1>
                            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-muted)' }}>
                                Earned ₹{totalEarned.toLocaleString('en-IN')} from {counts.completed} completed sessions
                            </p>
                        </div>
                        <button onClick={() => showToast('Interview scheduling coming soon!')} className="btn-primary" style={{ fontSize: 13, padding: '9px 20px', borderRadius: 10 }}>
                            + Schedule Interview
                        </button>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        {(Object.keys(tabConfig) as Tab[]).map(t => {
                            const tc = tabConfig[t];
                            const isActive = tab === t;
                            return (
                                <button key={t} onClick={() => setTab(t)} style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '8px 18px', borderRadius: 10, cursor: 'pointer',
                                    border: `1px solid ${isActive ? tc.color : 'var(--color-border-light)'}`,
                                    background: isActive ? tc.bg : 'var(--color-surface)',
                                    color: isActive ? tc.color : 'var(--color-text-muted)',
                                    fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                                }}>
                                    {tc.label}
                                    <span style={{
                                        padding: '1px 7px', borderRadius: 20, fontSize: 11,
                                        background: isActive ? '#fff' : 'var(--color-sky)',
                                        color: isActive ? tc.color : 'var(--color-text-muted)',
                                        fontWeight: 700,
                                    }}>{counts[t]}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Interview cards */}
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 6 }}>
                                No {tab} interviews
                            </p>
                            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>
                                {tab === 'upcoming' ? 'Schedule a mock interview to start earning.' : `No ${tab} interviews yet.`}
                            </p>
                            {tab === 'upcoming' && (
                                <button onClick={() => showToast('Interview scheduling coming soon!')} className="btn-primary" style={{ fontSize: 13, padding: '8px 20px', borderRadius: 10 }}>
                                    Schedule Now →
                                </button>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
                            {filtered.map(iv => (
                                <InterviewScheduler
                                    key={iv.id}
                                    interview={iv}
                                    onStart={(id) => showToast(`Starting interview with ${interviews.find(x => x.id === id)?.candidateName}…`)}
                                    onReschedule={(id) => showToast(`Reschedule request sent for ${interviews.find(x => x.id === id)?.candidateName}`)}
                                    onFeedback={(id, fb) => {
                                        setInterviews(prev => prev.map(x => x.id === id ? { ...x, feedback: fb } : x));
                                        showToast('Feedback saved!');
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {toast && (
                <div style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 999,
                    padding: '12px 20px', borderRadius: 12,
                    background: '#0f172a', color: '#fff', fontSize: 13, fontWeight: 500,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}>
                    {toast}
                </div>
            )}
        </div>
    );
}
