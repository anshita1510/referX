import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import ReferralCard from '../../components/ReferralCard';
import api from '../../api/axiosClient';

interface Referral {
    id: number;
    job_title: string;
    engineer_name: string;
    status: string;
    created_at: string;
}

const STATUS_FILTERS = ['all', 'pending', 'accepted', 'rejected', 'hired'];

export default function MyReferrals() {
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/referrals')
            .then(r => setReferrals(r.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const filtered = filter === 'all' ? referrals : referrals.filter(r => r.status === filter);

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.content}>
                <h1 style={styles.heading}>My Referrals</h1>

                <div style={styles.filters}>
                    {STATUS_FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {loading && <p style={styles.empty}>Loading…</p>}
                {!loading && filtered.length === 0 && (
                    <p style={styles.empty}>No referrals in this category.</p>
                )}
                {filtered.map(r => (
                    <ReferralCard
                        key={r.id}
                        candidateName="You"
                        jobTitle={r.job_title}
                        status={r.status}
                        date={new Date(r.created_at).toLocaleDateString()}
                    />
                ))}
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' },
    content: { maxWidth: 760, margin: '0 auto', padding: '32px 24px' },
    heading: { margin: '0 0 20px', fontSize: 24, fontWeight: 700, color: '#111' },
    filters: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
    filterBtn: {
        padding: '6px 14px',
        border: '1px solid #e5e7eb',
        borderRadius: 20,
        background: '#fff',
        fontSize: 13,
        cursor: 'pointer',
        color: '#374151',
    },
    filterActive: {
        background: '#3b82f6',
        color: '#fff',
        border: '1px solid #3b82f6',
    },
    empty: { color: '#9ca3af', fontSize: 14, textAlign: 'center', padding: '40px 0' },
};
