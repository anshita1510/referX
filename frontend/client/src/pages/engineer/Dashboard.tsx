import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import ReferralCard from '../../components/ReferralCard';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosClient';

interface Referral {
    id: number;
    job_title: string;
    candidate_name: string;
    status: string;
    created_at: string;
}

interface Payment {
    id: number;
    amount: number;
    status: string;
}

export default function EngineerDashboard() {
    const { profile } = useAuth();
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        api.get('/api/referrals').then(r => setReferrals(r.data)).catch(() => { });
        api.get('/api/payments').then(r => setPayments(r.data)).catch(() => { });
    }, []);

    const totalEarned = payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + Number(p.amount), 0);

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.heading}>Welcome, {profile?.name ?? 'Engineer'}</h1>
                        <p style={styles.sub}>Manage your referrals and track earnings.</p>
                    </div>
                    <Link to="/engineer/candidates" style={styles.ctaBtn}>Refer a Candidate</Link>
                </div>

                <div style={styles.statsRow}>
                    {[
                        { label: 'Total Referrals', value: referrals.length, color: '#3b82f6' },
                        { label: 'Hired', value: referrals.filter(r => r.status === 'hired').length, color: '#10b981' },
                        { label: 'Total Earned', value: `₹${totalEarned.toLocaleString()}`, color: '#f59e0b' },
                    ].map(s => (
                        <div key={s.label} style={styles.statCard}>
                            <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
                            <div style={styles.statLabel}>{s.label}</div>
                        </div>
                    ))}
                </div>

                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Recent Referrals</h2>
                        <Link to="/engineer/candidates" style={styles.viewAll}>View all</Link>
                    </div>
                    {referrals.length === 0
                        ? <p style={styles.empty}>No referrals yet. Start referring candidates.</p>
                        : referrals.slice(0, 5).map(r => (
                            <ReferralCard
                                key={r.id}
                                candidateName={r.candidate_name ?? 'Candidate'}
                                jobTitle={r.job_title}
                                status={r.status}
                                date={new Date(r.created_at).toLocaleDateString()}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' },
    content: { maxWidth: 900, margin: '0 auto', padding: '32px 24px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
    heading: { margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#111' },
    sub: { margin: 0, color: '#6b7280', fontSize: 14 },
    ctaBtn: {
        padding: '10px 20px',
        background: '#3b82f6',
        color: '#fff',
        borderRadius: 8,
        textDecoration: 'none',
        fontSize: 14,
        fontWeight: 600,
    },
    statsRow: { display: 'flex', gap: 16, marginBottom: 32 },
    statCard: {
        flex: 1,
        background: '#fff',
        borderRadius: 10,
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
    },
    statValue: { fontSize: 32, fontWeight: 700, marginBottom: 4 },
    statLabel: { fontSize: 13, color: '#6b7280', fontWeight: 500 },
    section: { background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.07)' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { margin: 0, fontSize: 16, fontWeight: 700, color: '#111' },
    viewAll: { fontSize: 13, color: '#3b82f6', textDecoration: 'none', fontWeight: 500 },
    empty: { color: '#9ca3af', fontSize: 14, textAlign: 'center', padding: '24px 0' },
};
