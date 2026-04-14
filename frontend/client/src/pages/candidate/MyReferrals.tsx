import { useEffect, useState } from 'react';
import Navbar from '../../components/dashboard/DashNavbar';
import ReferralCard from '../../components/ReferralCard';
import api from '../../api/axiosClient';

interface Referral {
    id: number;
    job: { title: string; company?: { name: string } };
    engineer: { name: string };
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
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Navbar />
            <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
                <h1 style={{ margin: '0 0 20px', fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>My Referrals</h1>

                <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                    {STATUS_FILTERS.map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            padding: '6px 16px', borderRadius: 20, fontSize: 13, cursor: 'pointer', fontWeight: 500,
                            border: filter === f ? '1.5px solid var(--color-brand)' : '1.5px solid var(--color-border-light)',
                            background: filter === f ? 'var(--color-brand)' : 'var(--color-surface)',
                            color: filter === f ? '#fff' : 'var(--color-text-muted)',
                            fontFamily: 'DM Sans, sans-serif',
                        }}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {loading && <p style={{ color: 'var(--color-text-soft)', textAlign: 'center', padding: '40px 0' }}>Loading…</p>}
                {!loading && filtered.length === 0 && (
                    <p style={{ color: 'var(--color-text-soft)', textAlign: 'center', padding: '40px 0' }}>No referrals in this category.</p>
                )}
                {filtered.map(r => (
                    <ReferralCard
                        key={r.id}
                        candidateName="You"
                        jobTitle={r.job?.title ?? 'Job'}
                        company={r.job?.company?.name}
                        engineerName={r.engineer?.name}
                        status={r.status}
                        date={new Date(r.created_at).toLocaleDateString()}
                    />
                ))}
            </div>
        </div>
    );
}
