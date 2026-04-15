import { Link } from 'react-router-dom';

interface Candidate {
    id: number;
    name: string;
    role: string;
    skills: string[];
    matchPct: number;
}

interface Props {
    candidates: Candidate[];
    loading: boolean;
}

function MatchBar({ pct }: { pct: number }) {
    const color = pct >= 80 ? '#16a34a' : pct >= 60 ? '#d97706' : '#dc2626';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ flex: 1, height: 4, borderRadius: 4, background: 'var(--color-border-light)', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color, minWidth: 28 }}>{pct}%</span>
        </div>
    );
}

export default function OpportunitiesPanel({ candidates, loading }: Props) {
    return (
        <div className="dash-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        🎯 Top Candidate Matches
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--color-text-muted)' }}>
                        AI-ranked by fit for your company · Refer to earn ₹5,000/hire
                    </p>
                </div>
                <Link to="/engineer/candidates" style={{ textDecoration: 'none' }}>
                    <button style={{
                        padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(to right, var(--color-brand-dark), var(--color-teal-light))',
                        color: '#fff', fontSize: 12, fontWeight: 700,
                        fontFamily: 'Space Grotesk, sans-serif',
                        boxShadow: '0 0 12px rgba(20,154,160,0.2)',
                    }}>
                        Browse All →
                    </button>
                </Link>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {[1, 2, 3].map(i => <div key={i} style={{ height: 100, borderRadius: 10, background: 'var(--color-sky)', opacity: 0.5 }} />)}
                </div>
            ) : candidates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>👥</div>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10 }}>
                        No candidates yet — they'll appear here as they sign up
                    </p>
                    <Link to="/engineer/candidates" style={{ textDecoration: 'none' }}>
                        <button style={{
                            padding: '7px 16px', borderRadius: 8, cursor: 'pointer',
                            background: 'var(--color-sky)', color: 'var(--color-brand-dark)',
                            fontSize: 12, fontWeight: 600, border: '1px solid var(--color-border)',
                        }}>
                            Browse Candidates
                        </button>
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                    {candidates.slice(0, 6).map(c => (
                        <div key={c.id} style={{
                            padding: '12px 14px', borderRadius: 10,
                            background: 'var(--color-surface)', border: '1px solid var(--color-border-light)',
                            transition: 'all 0.15s', cursor: 'default',
                        }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-brand)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(20,154,160,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-light)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                    background: 'linear-gradient(135deg, var(--color-sky), var(--color-periwinkle))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 13, fontWeight: 700, color: 'var(--color-brand-dark)',
                                    fontFamily: 'Space Grotesk, sans-serif',
                                }}>
                                    {c.name[0].toUpperCase()}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.role}</div>
                                </div>
                            </div>
                            <MatchBar pct={c.matchPct} />
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                                {c.skills.slice(0, 2).map(s => (
                                    <span key={s} style={{
                                        fontSize: 9, fontWeight: 500, padding: '2px 7px', borderRadius: 20,
                                        background: 'var(--color-sky)', color: 'var(--color-brand-dark)',
                                        border: '1px solid var(--color-border)',
                                    }}>{s}</span>
                                ))}
                            </div>
                            <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                                <Link to="/engineer/candidates" style={{ flex: 1, textDecoration: 'none' }}>
                                    <button style={{
                                        width: '100%', padding: '5px 0', borderRadius: 7, border: 'none', cursor: 'pointer',
                                        background: 'linear-gradient(to right, var(--color-brand-dark), var(--color-teal-light))',
                                        color: '#fff', fontSize: 10, fontWeight: 700,
                                        fontFamily: 'Space Grotesk, sans-serif',
                                    }}>
                                        Refer +₹5K
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
