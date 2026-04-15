import { useState } from 'react';

export interface ReferralRequest {
    id: number;
    candidateName: string;
    candidateRole: string;
    jobTitle: string;
    company: string;
    requestedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    note?: string;
}

interface Props {
    referral: ReferralRequest;
    onApprove?: (id: number, note: string) => void;
    onReject?: (id: number, note: string) => void;
}

export default function ReferralApprovalCard({ referral, onApprove, onReject }: Props) {
    const [note, setNote] = useState(referral.note ?? '');
    const [showNote, setShowNote] = useState(false);
    const [status, setStatus] = useState(referral.status);
    const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);

    const handle = async (action: 'approve' | 'reject') => {
        setLoading(action);
        await new Promise(r => setTimeout(r, 800));
        setStatus(action === 'approve' ? 'approved' : 'rejected');
        setLoading(null);
        if (action === 'approve') onApprove?.(referral.id, note);
        else onReject?.(referral.id, note);
    };

    const statusConfig = {
        pending: { label: 'Pending', bg: '#fef9ec', color: '#d97706', border: '#fde68a' },
        approved: { label: 'Approved', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
        rejected: { label: 'Rejected', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
    };
    const sc = statusConfig[status];

    return (
        <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
            borderRadius: 14, padding: '16px 18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'box-shadow 0.2s',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--color-sky), var(--color-periwinkle))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, fontWeight: 700, color: 'var(--color-brand-dark)',
                        fontFamily: 'Space Grotesk, sans-serif',
                    }}>
                        {referral.candidateName[0].toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                            {referral.candidateName}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>
                            {referral.candidateRole}
                        </div>
                    </div>
                </div>
                <span style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                    background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                }}>
                    {sc.label}
                </span>
            </div>

            {/* Job info */}
            <div style={{
                padding: '10px 12px', borderRadius: 10,
                background: 'var(--color-sky)', border: '1px solid var(--color-border)',
                marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{referral.jobTitle}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>🏢 {referral.company}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-soft)' }}>{referral.requestedAt}</div>
            </div>

            {/* Note toggle */}
            {status === 'pending' && (
                <div style={{ marginBottom: 12 }}>
                    <button onClick={() => setShowNote(s => !s)} className="btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }}>
                        {showNote ? '▲ Hide note' : '📝 Add note'}
                    </button>
                    {showNote && (
                        <textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder="Add a note for the candidate…"
                            rows={2}
                            style={{
                                display: 'block', width: '100%', marginTop: 8,
                                padding: '8px 12px', borderRadius: 8, fontSize: 12,
                                border: '1px solid var(--color-border-light)',
                                outline: 'none', resize: 'none', boxSizing: 'border-box',
                                fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)',
                            }}
                        />
                    )}
                </div>
            )}

            {/* Actions */}
            {status === 'pending' && (
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => handle('reject')}
                        disabled={!!loading}
                        style={{
                            flex: 1, padding: '8px 0', borderRadius: 8, border: '1.5px solid #fecaca',
                            background: loading === 'reject' ? '#fef2f2' : '#fff',
                            color: '#dc2626', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                        }}>
                        {loading === 'reject' ? '…' : '✕ Reject'}
                    </button>
                    <button
                        onClick={() => handle('approve')}
                        disabled={!!loading}
                        style={{
                            flex: 2, padding: '8px 0', borderRadius: 8, border: 'none',
                            background: loading === 'approve' ? '#dcfce7' : 'linear-gradient(to right, #02868C, #79C5C8)',
                            color: loading === 'approve' ? '#16a34a' : '#fff',
                            fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: 'Space Grotesk, sans-serif',
                            boxShadow: loading ? 'none' : '0 0 12px rgba(20,154,160,0.25)',
                            transition: 'all 0.2s',
                        }}>
                        {loading === 'approve' ? 'Approving…' : '✓ Approve Referral'}
                    </button>
                </div>
            )}

            {status !== 'pending' && (
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center', padding: '4px 0' }}>
                    {status === 'approved' ? '✓ You approved this referral' : '✕ You rejected this referral'}
                    {note && <span style={{ marginLeft: 6, fontStyle: 'italic' }}>· "{note}"</span>}
                </div>
            )}
        </div>
    );
}
