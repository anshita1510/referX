import Link from 'next/link';
import { ReferralRequest } from './ReferralApprovalCard';
import { InterviewSlot } from './InterviewScheduler';

interface Props {
    interviews: InterviewSlot[];
    referrals: ReferralRequest[];
    loading: boolean;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
}

function timeLabel(iso: string) {
    const dt = new Date(iso);
    const isToday = new Date().toDateString() === dt.toDateString();
    const time = dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const date = dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return isToday ? `Today · ${time}` : `${date} · ${time}`;
}

function InterviewRow({ iv }: { iv: InterviewSlot }) {
    const isToday = new Date().toDateString() === new Date(iv.scheduledAt).toDateString();
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 10,
            background: isToday ? 'linear-gradient(to right, #eff6ff, #f5f3ff)' : 'var(--color-surface)',
            border: `1px solid ${isToday ? '#bfdbfe' : 'var(--color-border-light)'}`,
            transition: 'all 0.15s',
        }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#7c3aed'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(124,58,237,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = isToday ? '#bfdbfe' : 'var(--color-border-light)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
        >
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: '#7c3aed', fontFamily: 'Space Grotesk, sans-serif',
                }}>
                    {iv.candidateName[0].toUpperCase()}
                </div>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{iv.candidateName}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{timeLabel(iv.scheduledAt)} · {iv.duration}min</div>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {iv.earnings > 0 && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>+₹{iv.earnings.toLocaleString('en-IN')}</span>
                )}
                <Link href="/engineer/interviews" style={{ textDecoration: 'none' }}>
                    <button style={{
                        padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                        background: isToday ? 'linear-gradient(to right, #7c3aed, #a78bfa)' : 'var(--color-sky)',
                        color: isToday ? '#fff' : 'var(--color-brand-dark)',
                        fontFamily: 'Space Grotesk, sans-serif',
                        boxShadow: isToday ? '0 0 12px rgba(124,58,237,0.3)' : 'none',
                    }}>
                        {isToday ? '▶ Join Now' : 'View'}
                    </button>
                </Link>
            </div>
        </div>
    );
}

function ReferralRow({ r, onApprove, onReject }: { r: ReferralRequest; onApprove: (id: number) => void; onReject: (id: number) => void }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 10,
            background: 'var(--color-surface)', border: '1px solid var(--color-border-light)',
            transition: 'all 0.15s',
        }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#d97706'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(217,119,6,0.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-light)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
        >
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1, minWidth: 0 }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: '#fef9ec', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#d97706',
                    fontFamily: 'Space Grotesk, sans-serif',
                }}>
                    {r.candidateName[0].toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {r.candidateName}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {r.jobTitle} · {r.company}
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 12 }}>
                <button onClick={() => onReject(r.id)} style={{
                    padding: '5px 12px', borderRadius: 7, border: '1px solid #fecaca',
                    background: '#fff', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>✕</button>
                <button onClick={() => onApprove(r.id)} style={{
                    padding: '5px 14px', borderRadius: 7, border: 'none',
                    background: 'linear-gradient(to right, var(--color-brand-dark), var(--color-teal-light))',
                    color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif',
                    boxShadow: '0 0 10px rgba(20,154,160,0.2)',
                }}>✓ Approve</button>
            </div>
        </div>
    );
}

function Skeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1, 2].map(i => <div key={i} style={{ height: 60, borderRadius: 10, background: 'var(--color-sky)', opacity: 0.5 }} />)}
        </div>
    );
}

export default function WorkPipeline({ interviews, referrals, loading, onApprove, onReject }: Props) {
    const upcoming = interviews.filter(i => i.status === 'upcoming');
    const pending = referrals.filter(r => r.status === 'pending');

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {/* Interviews */}
            <div className="dash-card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                            Upcoming Interviews
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--color-text-muted)' }}>
                            {upcoming.length > 0 ? `${upcoming.length} session${upcoming.length > 1 ? 's' : ''} scheduled` : 'No sessions yet'}
                        </p>
                    </div>
                    <Link href="/engineer/interviews" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-brand)', textDecoration: 'none' }}>View all →</Link>
                </div>
                {loading ? <Skeleton /> : upcoming.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>📅</div>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10 }}>
                            You have open slots — start earning now
                        </p>
                        <Link href="/engineer/candidates" style={{ textDecoration: 'none' }}>
                            <button style={{
                                padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                background: 'linear-gradient(to right, #7c3aed, #a78bfa)',
                                color: '#fff', fontSize: 12, fontWeight: 700,
                                fontFamily: 'Space Grotesk, sans-serif',
                            }}>
                                Browse Candidates →
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {upcoming.slice(0, 3).map(iv => <InterviewRow key={iv.id} iv={iv} />)}
                    </div>
                )}
            </div>

            {/* Referrals */}
            <div className="dash-card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                            Pending Referrals
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--color-text-muted)' }}>
                            {pending.length > 0 ? `${pending.length} waiting for your decision` : 'All caught up'}
                        </p>
                    </div>
                    <Link href="/engineer/referrals" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-brand)', textDecoration: 'none' }}>View all →</Link>
                </div>
                {loading ? <Skeleton /> : pending.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>🤝</div>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10 }}>
                            No pending requests — refer a candidate to earn ₹5,000
                        </p>
                        <Link href="/engineer/candidates" style={{ textDecoration: 'none' }}>
                            <button style={{
                                padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                background: 'linear-gradient(to right, var(--color-brand-dark), var(--color-teal-light))',
                                color: '#fff', fontSize: 12, fontWeight: 700,
                                fontFamily: 'Space Grotesk, sans-serif',
                            }}>
                                Browse Candidates →
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {pending.slice(0, 3).map(r => <ReferralRow key={r.id} r={r} onApprove={onApprove} onReject={onReject} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
