import { Link } from 'react-router-dom';

interface Props {
    monthlyEarnings: number;
    totalEarnings: number;
    pendingReferrals: number;
    upcomingInterviews: number;
}

export default function EarningsPriorityBar({ monthlyEarnings, totalEarnings, pendingReferrals, upcomingInterviews }: Props) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 24px', gap: 16, flexWrap: 'wrap',
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border-light)',
            boxShadow: '0 1px 8px rgba(20,154,160,0.06)',
        }}>
            {/* Left: earnings */}
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-soft)', letterSpacing: '0.06em' }}>THIS MONTH</span>
                    <span style={{
                        fontSize: 22, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif',
                        background: 'linear-gradient(to right, var(--color-brand-dark), var(--color-teal-light))',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        ₹{monthlyEarnings.toLocaleString('en-IN')}
                    </span>
                </div>
                <div style={{ width: 1, height: 28, background: 'var(--color-border-light)' }} />
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-soft)', letterSpacing: '0.06em' }}>ALL TIME</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        ₹{totalEarnings.toLocaleString('en-IN')}
                    </span>
                </div>
                {pendingReferrals > 0 && (
                    <>
                        <div style={{ width: 1, height: 28, background: 'var(--color-border-light)' }} />
                        <Link to="/engineer/referrals" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{
                                width: 20, height: 20, borderRadius: '50%', background: '#fef9ec',
                                border: '1px solid #fde68a', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#d97706',
                            }}>{pendingReferrals}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#d97706' }}>pending referrals</span>
                        </Link>
                    </>
                )}
                {upcomingInterviews > 0 && (
                    <>
                        <div style={{ width: 1, height: 28, background: 'var(--color-border-light)' }} />
                        <Link to="/engineer/interviews" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{
                                width: 20, height: 20, borderRadius: '50%', background: '#eff6ff',
                                border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#2563eb',
                            }}>{upcomingInterviews}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>upcoming interviews</span>
                        </Link>
                    </>
                )}
            </div>

            {/* Right: primary CTA */}
            <Link to="/engineer/interviews" style={{ textDecoration: 'none' }}>
                <button style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '9px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(to right, var(--color-brand-dark), var(--color-teal-light))',
                    color: '#fff', fontSize: 13, fontWeight: 700,
                    fontFamily: 'Space Grotesk, sans-serif',
                    boxShadow: '0 0 20px rgba(20,154,160,0.3)',
                    transition: 'opacity 0.15s, transform 0.1s',
                }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                    <span style={{ fontSize: 15 }}>▶</span> Start Interview
                </button>
            </Link>
        </div>
    );
}
