import { useState } from 'react';

export interface CandidateData {
    id: number;
    name: string;
    role: string;
    experience: string;
    location: string;
    skills: string[];
    matchPct: number;
    avatar?: string;
}

interface Props {
    candidate: CandidateData;
    onRefer?: (id: number) => void;
    onInterview?: (id: number) => void;
    onView?: (id: number) => void;
}

export default function CandidateCard({ candidate, onRefer, onInterview, onView }: Props) {
    const [referred, setReferred] = useState(false);
    const [hovered, setHovered] = useState(false);

    const matchColor = candidate.matchPct >= 80 ? '#16a34a' : candidate.matchPct >= 60 ? '#d97706' : '#dc2626';
    const matchBg = candidate.matchPct >= 80 ? '#f0fdf4' : candidate.matchPct >= 60 ? '#fef9ec' : '#fef2f2';

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: 'var(--color-surface)',
                border: `1px solid ${hovered ? 'var(--color-brand)' : 'var(--color-border-light)'}`,
                borderRadius: 16, padding: '18px 20px',
                boxShadow: hovered ? '0 8px 28px rgba(20,154,160,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s', transform: hovered ? 'translateY(-2px)' : 'none',
                cursor: 'default',
            }}>
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--color-sky), var(--color-periwinkle))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 700, color: 'var(--color-brand-dark)',
                        fontFamily: 'Space Grotesk, sans-serif',
                        border: '1px solid var(--color-border)',
                    }}>
                        {candidate.name[0].toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                            {candidate.name}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>
                            {candidate.role} · {candidate.experience}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-soft)', marginTop: 1 }}>
                            📍 {candidate.location}
                        </div>
                    </div>
                </div>
                {/* Match % badge */}
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '6px 12px', borderRadius: 10,
                    background: matchBg, border: `1px solid ${matchColor}30`,
                }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: matchColor, fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>
                        {candidate.matchPct}%
                    </div>
                    <div style={{ fontSize: 9, color: matchColor, fontWeight: 600, letterSpacing: '0.04em', marginTop: 2 }}>MATCH</div>
                </div>
            </div>

            {/* Skills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {candidate.skills.slice(0, 5).map(s => (
                    <span key={s} className="skill-tag">{s}</span>
                ))}
                {candidate.skills.length > 5 && (
                    <span className="skill-tag" style={{ color: 'var(--color-text-soft)' }}>+{candidate.skills.length - 5}</span>
                )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => onView?.(candidate.id)} className="btn-ghost" style={{ flex: 1, fontSize: 12, padding: '7px 0', borderRadius: 8, border: '1px solid var(--color-border-light)' }}>
                    View Profile
                </button>
                <button onClick={() => onInterview?.(candidate.id)} className="btn-outline" style={{ flex: 1, fontSize: 12, padding: '7px 0', borderRadius: 8 }}>
                    📅 Interview
                </button>
                <button
                    onClick={() => { setReferred(true); onRefer?.(candidate.id); }}
                    disabled={referred}
                    style={{
                        flex: 1, fontSize: 12, padding: '7px 0', borderRadius: 8, border: 'none',
                        background: referred ? '#f0fdf4' : 'linear-gradient(to right, #02868C, #79C5C8)',
                        color: referred ? '#16a34a' : '#fff',
                        fontWeight: 600, cursor: referred ? 'default' : 'pointer',
                        fontFamily: 'Space Grotesk, sans-serif',
                        transition: 'all 0.2s',
                    }}>
                    {referred ? '✓ Referred' : '🤝 Refer'}
                </button>
            </div>
        </div>
    );
}
