import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosClient';
import EngineerSidebar from '../../components/engineer/EngineerSidebar';
import EngineerTopBar from '../../components/engineer/EngineerTopBar';
import EarningsPriorityBar from '../../components/engineer/EarningsPriorityBar';
import ActionZone from '../../components/engineer/ActionZone';
import PerformanceRow from '../../components/engineer/PerformanceRow';
import WorkPipeline from '../../components/engineer/WorkPipeline';
import OpportunitiesPanel from '../../components/engineer/OpportunitiesPanel';
import AIInsightsPanel from '../../components/engineer/AIInsightsPanel';
import { ReferralRequest } from '../../components/engineer/ReferralApprovalCard';
import { InterviewSlot } from '../../components/engineer/InterviewScheduler';

interface Stats {
    totalEarnings: number;
    monthlyEarnings: number;
    interviewEarnings: number;
    referralEarnings: number;
    interviewsDone: number;
    pendingReferrals: number;
    successfulReferrals: number;
    successRate: number;
    monthlyData: { month: string; amount: number }[];
}

interface CandidateMatch {
    id: number;
    name: string;
    role: string;
    skills: string[];
    matchPct: number;
}

export default function EngineerDashboard() {
    const { profile } = useAuth();
    const [referrals, setReferrals] = useState<ReferralRequest[]>([]);
    const [interviews, setInterviews] = useState<InterviewSlot[]>([]);
    const [candidates, setCandidates] = useState<CandidateMatch[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalEarnings: 0, monthlyEarnings: 0,
        interviewEarnings: 0, referralEarnings: 0,
        interviewsDone: 0, pendingReferrals: 0,
        successfulReferrals: 0, successRate: 0,
        monthlyData: [],
    });
    const [loading, setLoading] = useState(true);

    const firstName = profile?.name?.split(' ')[0] ?? 'Engineer';

    useEffect(() => {
        Promise.allSettled([
            api.get('/api/referrals'),
            api.get('/api/interviews'),
            api.get('/api/payments'),
            api.get('/api/auth/candidates'),
        ]).then(([refsRes, ivsRes, paymentsRes, candidatesRes]) => {

            // ── Referrals ──────────────────────────────────────
            const rawRefs = refsRes.status === 'fulfilled' ? refsRes.value.data : [];
            setReferrals(rawRefs.map((r: any) => ({
                id: r.id,
                candidateName: r.candidate?.name ?? 'Candidate',
                candidateRole: r.candidate?.candidate_profile?.current_role ?? '—',
                jobTitle: r.job?.title ?? '—',
                company: r.job?.company_name ?? '—',
                requestedAt: new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                status: r.status as ReferralRequest['status'],
            })));

            // ── Interviews ─────────────────────────────────────
            const rawIvs = ivsRes.status === 'fulfilled' ? ivsRes.value.data : [];
            setInterviews(rawIvs.map((iv: any) => ({
                id: iv.id,
                candidateName: iv.candidate?.name ?? 'Candidate',
                candidateRole: iv.candidate?.candidate_profile?.current_role ?? '—',
                scheduledAt: iv.scheduled_at ?? new Date().toISOString(),
                duration: iv.duration ?? 60,
                status: iv.status === 'booked' ? 'upcoming' : iv.status === 'done' ? 'completed' : (iv.status ?? 'upcoming'),
                earnings: Number(iv.fee ?? 0),
                feedback: iv.feedback ?? undefined,
            })));

            // ── Candidates ─────────────────────────────────────
            const rawCandidates = candidatesRes.status === 'fulfilled' ? candidatesRes.value.data : [];
            setCandidates(rawCandidates.map((c: any, i: number) => ({
                id: c.id,
                name: c.name,
                role: c.candidate_profile?.current_role ?? c.candidate_profile?.experience_level ?? 'Engineer',
                skills: c.candidate_profile?.skills ?? [],
                matchPct: Math.min(95, 60 + ((c.id * 7 + i * 13) % 36)),
            })).sort((a: CandidateMatch, b: CandidateMatch) => b.matchPct - a.matchPct));

            // ── Payments → stats ───────────────────────────────
            const payments = paymentsRes.status === 'fulfilled' ? paymentsRes.value.data : [];
            const now = new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

            let totalEarnings = 0, monthlyEarnings = 0, interviewEarnings = 0, referralEarnings = 0;
            const byMonth: Record<string, number> = {};

            payments.forEach((p: any) => {
                if (p.status !== 'paid') return;
                const amt = Number(p.amount);
                totalEarnings += amt;
                if (new Date(p.created_at) >= monthStart) monthlyEarnings += amt;
                if (p.type === 'interview_booking') interviewEarnings += amt;
                else referralEarnings += amt;
                const key = new Date(p.created_at).toLocaleString('en-IN', { month: 'short' });
                byMonth[key] = (byMonth[key] ?? 0) + amt;
            });

            const monthlyData = Array.from({ length: 6 }, (_, i) => {
                const d = new Date();
                d.setMonth(d.getMonth() - (5 - i));
                const label = d.toLocaleString('en-IN', { month: 'short' });
                return { month: label, amount: byMonth[label] ?? 0 };
            });

            const pendingReferrals = rawRefs.filter((r: any) => r.status === 'pending').length;
            const successfulReferrals = rawRefs.filter((r: any) => r.status === 'hired' || r.status === 'accepted').length;
            const totalRefs = rawRefs.length;
            const successRate = totalRefs > 0 ? Math.round((successfulReferrals / totalRefs) * 100) : 0;

            setStats({
                totalEarnings, monthlyEarnings, interviewEarnings, referralEarnings,
                interviewsDone: rawIvs.filter((iv: any) => iv.status === 'done' || iv.status === 'completed').length,
                pendingReferrals, successfulReferrals, successRate, monthlyData,
            });
        }).finally(() => setLoading(false));
    }, []);

    const upcomingCount = interviews.filter(i => i.status === 'upcoming').length;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-sky) 60%, var(--color-periwinkle) 100%)' }}>
            <EngineerSidebar active="overview" monthlyEarnings={loading ? undefined : stats.monthlyEarnings} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Zone A: Top bar with greeting + notifications */}
                <EngineerTopBar profile={profile} monthlyEarnings={loading ? undefined : stats.monthlyEarnings} />

                {/* Zone A: Priority earnings bar */}
                {!loading && (
                    <EarningsPriorityBar
                        monthlyEarnings={stats.monthlyEarnings}
                        totalEarnings={stats.totalEarnings}
                        pendingReferrals={stats.pendingReferrals}
                        upcomingInterviews={upcomingCount}
                    />
                )}

                {/* Zone B: Main content — 2/3 + 1/3 grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 0, flex: 1, alignItems: 'start' }}>

                    {/* Main column */}
                    <main style={{ padding: '24px 24px 48px', display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>

                        {/* Greeting */}
                        <div>
                            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>
                                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                            <h1 style={{
                                margin: '4px 0 0', fontSize: 'var(--text-2xl)', fontWeight: 800,
                                color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)',
                                lineHeight: 1.2, letterSpacing: '-0.02em',
                            }}>
                                {firstName}'s Engineer Hub
                            </h1>
                        </div>

                        {/* Row 1: Action Zone */}
                        <ActionZone />

                        {/* Row 2: Performance Overview */}
                        {loading ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.8fr', gap: 14 }}>
                                {[1, 2, 3].map(i => <div key={i} style={{ height: 120, borderRadius: 14, background: 'var(--color-sky)', opacity: 0.5 }} />)}
                            </div>
                        ) : (
                            <PerformanceRow
                                totalEarnings={stats.totalEarnings}
                                interviewEarnings={stats.interviewEarnings}
                                referralEarnings={stats.referralEarnings}
                                monthlyData={stats.monthlyData}
                                successRate={stats.successRate}
                                interviewsDone={stats.interviewsDone}
                                successfulReferrals={stats.successfulReferrals}
                            />
                        )}

                        {/* Row 3: Work Pipeline */}
                        <WorkPipeline
                            interviews={interviews}
                            referrals={referrals}
                            loading={loading}
                            onApprove={(id) => setReferrals(prev => prev.map(x => x.id === id ? { ...x, status: 'approved' } : x))}
                            onReject={(id) => setReferrals(prev => prev.map(x => x.id === id ? { ...x, status: 'rejected' } : x))}
                        />

                        {/* Row 4: Opportunities */}
                        <OpportunitiesPanel candidates={candidates} loading={loading} />
                    </main>

                    {/* Zone C: Right panel — sticky AI insights */}
                    <aside style={{
                        padding: '24px 20px 48px 4px',
                        position: 'sticky', top: 0, maxHeight: '100vh',
                        overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14,
                    }}>
                        <AIInsightsPanel
                            totalEarnings={stats.totalEarnings}
                            pendingReferrals={stats.pendingReferrals}
                            upcomingInterviews={upcomingCount}
                            successRate={stats.successRate}
                        />

                        {/* Profile card */}
                        <div className="dash-card" style={{ padding: '16px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                                    background: 'linear-gradient(135deg, var(--color-sky), var(--color-periwinkle))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 16, fontWeight: 700, color: 'var(--color-brand-dark)',
                                    fontFamily: 'Space Grotesk, sans-serif',
                                }}>
                                    {(profile?.name ?? 'E')[0].toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                                        {profile?.name ?? 'Engineer'}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                                        {(profile as any)?.engineer_profile?.company ?? 'Engineer'}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
                                {[
                                    { label: 'Success Rate', value: `${stats.successRate}%`, color: '#16a34a' },
                                    { label: 'Interviews', value: String(stats.interviewsDone), color: '#7c3aed' },
                                ].map(m => (
                                    <div key={m.label} style={{
                                        padding: '8px 10px', borderRadius: 8,
                                        background: 'var(--color-sky)', border: '1px solid var(--color-border)',
                                        textAlign: 'center',
                                    }}>
                                        <div style={{ fontSize: 16, fontWeight: 800, color: m.color, fontFamily: 'Space Grotesk, sans-serif' }}>{m.value}</div>
                                        <div style={{ fontSize: 9, color: 'var(--color-text-muted)', marginTop: 1 }}>{m.label}</div>
                                    </div>
                                ))}
                            </div>
                            <a href="/engineer/profile" style={{
                                display: 'block', textAlign: 'center', textDecoration: 'none',
                                padding: '7px 0', borderRadius: 8, fontSize: 12, fontWeight: 600,
                                border: '1.5px solid var(--color-brand)', color: 'var(--color-brand-dark)',
                                background: 'var(--color-surface)', transition: 'background 0.15s',
                            }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-sky)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-surface)'; }}
                            >
                                Edit Profile
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
