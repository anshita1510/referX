import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axiosClient';

interface Payment {
    id: number;
    amount: number;
    status: string;
    referral_id: number;
    created_at: string;
}

export default function Earnings() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/payments')
            .then(r => setPayments(r.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0);
    const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0);

    const statusColor: Record<string, string> = {
        paid: '#10b981',
        pending: '#f59e0b',
        failed: '#ef4444',
    };

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.content}>
                <h1 style={styles.heading}>Earnings</h1>

                <div style={styles.statsRow}>
                    {[
                        { label: 'Total Paid', value: `₹${totalPaid.toLocaleString()}`, color: '#10b981' },
                        { label: 'Pending', value: `₹${totalPending.toLocaleString()}`, color: '#f59e0b' },
                        { label: 'Transactions', value: payments.length, color: '#3b82f6' },
                    ].map(s => (
                        <div key={s.label} style={styles.statCard}>
                            <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
                            <div style={styles.statLabel}>{s.label}</div>
                        </div>
                    ))}
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Payment History</h2>
                    {loading && <p style={styles.empty}>Loading…</p>}
                    {!loading && payments.length === 0 && (
                        <p style={styles.empty}>No payments yet. Refer candidates to start earning.</p>
                    )}
                    {payments.map(p => (
                        <div key={p.id} style={styles.row}>
                            <div>
                                <div style={styles.rowTitle}>Referral #{p.referral_id}</div>
                                <div style={styles.rowDate}>{new Date(p.created_at).toLocaleDateString()}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={styles.amount}>₹{Number(p.amount).toLocaleString()}</div>
                                <span style={{ ...styles.badge, background: statusColor[p.status] + '20', color: statusColor[p.status] }}>
                                    {p.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' },
    content: { maxWidth: 760, margin: '0 auto', padding: '32px 24px' },
    heading: { margin: '0 0 24px', fontSize: 24, fontWeight: 700, color: '#111' },
    statsRow: { display: 'flex', gap: 16, marginBottom: 28 },
    statCard: {
        flex: 1,
        background: '#fff',
        borderRadius: 10,
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
    },
    statValue: { fontSize: 28, fontWeight: 700, marginBottom: 4 },
    statLabel: { fontSize: 13, color: '#6b7280', fontWeight: 500 },
    section: { background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.07)' },
    sectionTitle: { margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#111' },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 0',
        borderBottom: '1px solid #f3f4f6',
    },
    rowTitle: { fontWeight: 600, fontSize: 14, color: '#111' },
    rowDate: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
    amount: { fontWeight: 700, fontSize: 16, color: '#111', marginBottom: 4 },
    badge: {
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 20,
        textTransform: 'capitalize',
    },
    empty: { color: '#9ca3af', fontSize: 14, textAlign: 'center', padding: '24px 0' },
};
