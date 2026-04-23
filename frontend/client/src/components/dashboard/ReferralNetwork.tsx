import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../api/axiosClient';

interface Referral {
    id: number;
    engineer: { name: string; engineer_profile?: { company?: string } };
    status: string;
}

function initials(name: string) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--color-brand), var(--color-periwinkle))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.33, fontWeight: 700, color: '#fff',
        }}>{initials(name)}</div>
    );
}

const STATUS_COLOR: Record<string, string> = {
    accepted: '#16a34a',
    pending: '#d97706',
    rejected: '#dc2626',
};

export default function ReferralNetwork() {
    const [referrals, setReferrals] = useState<Referral[]>([]);

    useEffect(() => {
        api.get('/api/referrals').then(r => setReferrals(r.data.slice(0, 3))).catch(() => { });
    }, []);

    return (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)', borderRadius: 16, padding: '20px 22px', boxShadow: '0 2px 12px rgba(20,154,160,0.07)' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>My Referrals</h3>

            {referrals.length === 0 && (
                <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--color-text-soft)' }}>No referrals yet.</p>
            )}

            {referrals.map(r => {
                const color = STATUS_COLOR[r.status] ?? 'var(--color-text-muted)';
                const label = r.status.charAt(0).toUpperCase() + r.status.slice(1);
                return (
                    <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <Avatar name={r.engineer?.name ?? '?'} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.engineer?.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                                {r.engineer?.engineer_profile?.company ? `Engineer at ${r.engineer.engineer_profile.company}` : 'Engineer'}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
                            <span style={{ fontSize: 11, color, fontWeight: 600 }}>{label}</span>
                        </div>
                    </div>
                );
            })}

            <Link href="/candidate/referrals" style={{
                display: 'block', textAlign: 'center', padding: '9px 0', marginTop: 4,
                border: '1.5px solid var(--color-border)', borderRadius: 10,
                fontSize: 13, color: 'var(--color-brand-dark)', textDecoration: 'none', fontWeight: 600,
                background: 'var(--color-sky)',
            }}>Request new referral ↗</Link>
        </div>
    );
}
