import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Check { label: string; done: boolean; points: number; fixHref: string; fixLabel: string }

function buildChecks(profile: any): Check[] {
    const cp = profile?.candidate_profile ?? {};
    return [
        { label: 'Skills added (3+)', done: cp.skills?.length >= 3, points: 20, fixHref: '/candidate/profile-setup', fixLabel: 'Add skills' },
        { label: 'Resume uploaded', done: !!cp.resume_url, points: 20, fixHref: '/candidate/profile-setup', fixLabel: 'Upload resume' },
        { label: 'GitHub linked', done: !!cp.github, points: 15, fixHref: '/candidate/profile-setup', fixLabel: 'Add GitHub' },
        { label: 'Bio written', done: !!cp.bio, points: 10, fixHref: '/candidate/profile-setup', fixLabel: 'Write bio' },
        { label: 'Projects added', done: cp.projects?.length >= 1, points: 10, fixHref: '/candidate/profile-setup', fixLabel: 'Add projects' },
        { label: 'Portfolio linked', done: !!cp.portfolio, points: 5, fixHref: '/candidate/profile-setup', fixLabel: 'Add portfolio' },
    ];
}

export default function ResumeScoreCard() {
    const { profile } = useAuth();
    const [expanded, setExpanded] = useState(false);

    const checks = buildChecks(profile);
    const score = 20 + checks.filter(c => c.done).reduce((s, c) => s + c.points, 0); // 20 base
    const capped = Math.min(score, 100);

    const color = capped >= 80 ? '#16a34a' : capped >= 55 ? '#d97706' : 'var(--color-brand)';
    const label = capped >= 80 ? 'Strong 🔥' : capped >= 55 ? 'Good 👍' : 'Needs work';

    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (capped / 100) * circumference;

    const incomplete = checks.filter(c => !c.done);
    const pointsLeft = incomplete.reduce((s, c) => s + c.points, 0);

    return (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)', borderRadius: 16, padding: '20px 22px', boxShadow: '0 2px 12px rgba(20,154,160,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>Profile Score</h3>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--color-text-muted)' }}>
                        {incomplete.length > 0 ? `+${pointsLeft} pts available` : 'Fully complete!'}
                    </p>
                </div>
                <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, background: 'var(--color-sky)', color: 'var(--color-brand-dark)', fontWeight: 700, border: '1px solid var(--color-border)' }}>
                    ✨ AI
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16 }}>
                <svg width={88} height={88} style={{ flexShrink: 0 }}>
                    <circle cx={44} cy={44} r={36} fill="none" stroke="var(--color-sky)" strokeWidth={7} />
                    <circle cx={44} cy={44} r={36} fill="none" stroke={color} strokeWidth={7}
                        strokeDasharray={circumference} strokeDashoffset={offset}
                        strokeLinecap="round" transform="rotate(-90 44 44)"
                        style={{ transition: 'stroke-dashoffset 1s ease' }} />
                    <text x={44} y={40} textAnchor="middle" dominantBaseline="central"
                        fill={color} fontSize={17} fontWeight={800} fontFamily="Space Grotesk, sans-serif">{capped}</text>
                    <text x={44} y={56} textAnchor="middle" fill="var(--color-text-soft)" fontSize={9}>/100</text>
                </svg>
                <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color, fontFamily: 'Space Grotesk, sans-serif' }}>{label}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4, lineHeight: 1.5 }}>
                        {capped < 100
                            ? `Complete ${incomplete.length} more item${incomplete.length > 1 ? 's' : ''} to reach 100`
                            : 'Engineers can see your full profile'}
                    </div>
                </div>
            </div>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {checks.map(c => (
                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: c.done ? 'var(--color-brand)' : 'var(--color-sky)',
                                border: c.done ? 'none' : '1.5px solid var(--color-border)',
                                fontSize: 10, color: '#fff',
                            }}>{c.done ? '✓' : ''}</div>
                            <span style={{ fontSize: 12, color: c.done ? 'var(--color-text-primary)' : 'var(--color-text-muted)', textDecoration: c.done ? 'none' : 'none' }}>
                                {c.label}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 10, color: c.done ? '#16a34a' : 'var(--color-text-soft)', fontWeight: 600 }}>
                                {c.done ? `+${c.points}` : `+${c.points} pts`}
                            </span>
                            {!c.done && (
                                <Link to={c.fixHref} style={{
                                    fontSize: 10, padding: '2px 8px', borderRadius: 6,
                                    background: 'var(--color-sky)', color: 'var(--color-brand-dark)',
                                    textDecoration: 'none', fontWeight: 700, border: '1px solid var(--color-border)',
                                    whiteSpace: 'nowrap',
                                }}>Fix →</Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Tip */}
            {incomplete.length > 0 && (
                <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--color-sky)', borderRadius: 10, border: '1px solid var(--color-border-light)' }}>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--color-brand-dark)', lineHeight: 1.5 }}>
                        💡 Candidates with score 80+ get <strong>3x more referral requests</strong>
                    </p>
                </div>
            )}
        </div>
    );
}
