import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosClient';
import EngineerSidebar from '../../components/engineer/EngineerSidebar';
import EngineerTopBar from '../../components/engineer/EngineerTopBar';
import ReferralApprovalCard, { ReferralRequest } from '../../components/engineer/ReferralApprovalCard';

const DUMMY: ReferralRequest[] = [];

type Tab = 'pending' | 'approved' | 'rejected';

export default function EngineerReferrals() {
    const { profile } = useAuth();
    const [referrals, setReferrals] = useState<ReferralRequest[]>(DUMMY);
    const [tab, setTab] = useState<Tab>('pending');

    useEffect(() => {
        api.get('/api/referrals').then(r => {
            const data: ReferralRequest[] = r.data.map((ref: any) => ({
                id: ref.id,
                candidateName: ref.candidate?.name ?? ref.candidate_name ?? 'Candidate',
                candidateRole: ref.candidate?.candidate_profile?.current_role ?? '—',
                jobTitle: ref.job?.title ?? ref.job_title ?? '—',
                company: ref.job?.company_name ?? '—',
                requestedAt: new Date(ref.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                status: ref.status as ReferralRequest['status'],
                note: ref.note,
            }));
            setReferrals(data);
        }).catch(() => { });
    }, []);

    const counts = {
        pending: referrals.filter(r => r.status === 'pending').length,
        approved: referrals.filter(r => r.status === 'approved').length,
        rejected: referrals.filter(r => r.status === 'rejected').length,
    };

    const filtered = referrals.filter(r => r.status === tab);

    const tabConfig: Record<Tab, { label: string; color: string; bg: string }> = {
        pending: { label: 'Pending', color: '#d97706', bg: '#fef9ec' },
        approved: { label: 'Approved', color: '#16a34a', bg: '#f0fdf4' },
        rejected: { label: 'Rejected', color: '#dc2626', bg: '#fef2f2' },
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-sky) 60%, var(--color-periwinkle) 100%)' }}>
            <EngineerSidebar active="referrals" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <EngineerTopBar profile={profile} />
                <main style={{ padding: '28px 32px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                    <div>
                        <h1 style={{ margin: 0, fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                            Referral Requests
                        </h1>
                        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-muted)' }}>
                            Review and manage candidate referral requests
                        </p>
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

                    {/* Cards */}
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>🤝</div>
                            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 6 }}>
                                No {tab} referrals
                            </p>
                            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                                {tab === 'pending' ? 'All caught up! No pending requests.' : `No ${tab} referrals yet.`}
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
                            {filtered.map(r => (
                                <ReferralApprovalCard
                                    key={r.id}
                                    referral={r}
                                    onApprove={(id) => setReferrals(prev => prev.map(x => x.id === id ? { ...x, status: 'approved' } : x))}
                                    onReject={(id) => setReferrals(prev => prev.map(x => x.id === id ? { ...x, status: 'rejected' } : x))}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
