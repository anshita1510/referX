import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosClient';
import EngineerSidebar from '../../components/engineer/EngineerSidebar';
import EngineerTopBar from '../../components/engineer/EngineerTopBar';
import EarningsCard from '../../components/engineer/EarningsCard';

interface Payment {
    id: number;
    amount: number;
    status: string;
    referral_id: number;
    type?: 'interview' | 'referral';
    created_at: string;
}

const DUMMY_PAYMENTS: Payment[] = [];


const statusConfig: Record<string, { label: string; bg: string; color: string; border: string }> = {
    paid: { label: 'Paid', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    pending: { label: 'Pending', bg: '#fef9ec', color: '#d97706', border: '#fde68a' },
    failed: { label: 'Failed', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

export default function Earnings() {
    const { profile } = useAuth();
    const [payments, setPayments] = useState<Payment[]>(DUMMY_PAYMENTS);
    const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

    useEffect(() => {
        api.get('/api/payments').then(r => {
            if (r.data?.length) {
                const mapped: Payment[] = r.data.map((p: any) => ({
                    id: p.id,
                    amount: Number(p.amount),
                    status: p.status,
                    referral_id: p.referral_id,
                    type: p.type ?? (p.interview_id ? 'interview' : 'referral'),
                    created_at: p.created_at,
                }));
                setPayments(mapped);
            }
        }).catch(() => { });
    }, []);

    const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0);
    const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0);
    const interviewEarnings = payments.filter(p => p.status === 'paid' && p.type === 'interview').reduce((s, p) => s + Number(p.amount), 0);
    const referralEarnings = payments.filter(p => p.status === 'paid' && p.type === 'referral').reduce((s, p) => s + Number(p.amount), 0);

    const filtered = payments.filter(p => filter === 'all' || p.status === filter);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-sky) 60%, var(--color-periwinkle) 100%)' }}>
            <EngineerSidebar active="earnings" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <EngineerTopBar profile={profile} />
                <main style={{ padding: '28px 32px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Header */}
                    <div>
                        <h1 style={{ margin: 0, fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                            Earnings Dashboard
                        </h1>
                        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-muted)' }}>
                            Track your income from interviews and referrals
                        </p>
                    </div>

                    {/* Main layout */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {/* Big earnings card */}
                            <EarningsCard
                                totalEarnings={totalPaid}
                                pendingPayout={totalPending}
                            />

                            {/* Transaction history */}
                            <div className="dash-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <div>
                                        <p className="dash-card-title">Payment History</p>
                                        <p className="dash-card-sub">{payments.length} transactions total</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        {(['all', 'paid', 'pending'] as const).map(f => (
                                            <button key={f} onClick={() => setFilter(f)} style={{
                                                padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                                border: `1px solid ${filter === f ? 'var(--color-brand)' : 'var(--color-border-light)'}`,
                                                background: filter === f ? 'var(--color-sky)' : 'var(--color-surface)',
                                                color: filter === f ? 'var(--color-brand-dark)' : 'var(--color-text-muted)',
                                                textTransform: 'capitalize',
                                            }}>{f}</button>
                                        ))}
                                    </div>
                                </div>

                                {filtered.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '24px 0', fontSize: 13 }}>
                                        No transactions found.
                                    </p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                        {filtered.map((p, i) => {
                                            const sc = statusConfig[p.status] ?? statusConfig.pending;
                                            const isLast = i === filtered.length - 1;
                                            return (
                                                <div key={p.id} style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    padding: '14px 0',
                                                    borderBottom: isLast ? 'none' : '1px solid var(--color-border-light)',
                                                }}>
                                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                        <div style={{
                                                            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                                            background: p.type === 'interview' ? '#f5f3ff' : 'var(--color-sky)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                                                        }}>
                                                            {p.type === 'interview' ? '📅' : '🤝'}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                                                {p.type === 'interview' ? 'Mock Interview' : 'Referral Bonus'} #{p.referral_id}
                                                            </div>
                                                            <div style={{ fontSize: 11, color: 'var(--color-text-soft)', marginTop: 1 }}>
                                                                {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <span style={{
                                                            fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                                                            background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                                                        }}>{sc.label}</span>
                                                        <div style={{ fontSize: 15, fontWeight: 800, color: p.status === 'paid' ? 'var(--color-text-primary)' : 'var(--color-text-muted)', fontFamily: 'Space Grotesk, sans-serif', minWidth: 80, textAlign: 'right' }}>
                                                            {p.status === 'failed' ? '-' : ''}₹{Number(p.amount).toLocaleString('en-IN')}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: summary stats */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {[
                                { label: 'Total Paid Out', value: `₹${totalPaid.toLocaleString('en-IN')}`, icon: '✅', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
                                { label: 'Pending Payout', value: `₹${totalPending.toLocaleString('en-IN')}`, icon: '⏳', color: '#d97706', bg: '#fef9ec', border: '#fde68a' },
                                { label: 'Total Transactions', value: payments.length.toString(), icon: '📊', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
                            ].map(s => (
                                <div key={s.label} style={{
                                    padding: '16px 18px', borderRadius: 14,
                                    background: s.bg, border: `1px solid ${s.border}`,
                                    display: 'flex', alignItems: 'center', gap: 12,
                                }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                                        {s.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>{s.value}</div>
                                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>{s.label}</div>
                                    </div>
                                </div>
                            ))}

                            {/* Tip */}
                            <div style={{ padding: '14px 16px', borderRadius: 14, background: 'linear-gradient(135deg, #02868C15, #79C5C815)', border: '1px solid var(--color-border)' }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-brand-dark)', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>
                                    💡 Earn more this week
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                                    You have 2 open interview slots. Fill them to earn an extra ₹5,000.
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
