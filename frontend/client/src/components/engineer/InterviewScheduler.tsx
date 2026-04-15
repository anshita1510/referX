import { useState } from 'react';

export interface InterviewSlot {
    id: number;
    candidateName: string;
    candidateRole: string;
    scheduledAt: string;
    duration: number; // minutes
    status: 'upcoming' | 'completed' | 'cancelled';
    earnings: number;
    feedback?: string;
}

interface Props {
    interview: InterviewSlot;
    onStart?: (id: number) => void;
    onReschedule?: (id: number) => void;
    onFeedback?: (id: number, feedback: string) => void;
}

export default function InterviewScheduler({ interview, onStart, onReschedule, onFeedback }: Props) {
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState(interview.feedback ?? '');
    const [saved, setSaved] = useState(false);

    const dt = new Date(interview.scheduledAt);
    const isToday = new Date().toDateString() === dt.toDateString();
    const timeStr = dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = isToday ? 'Today' : dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    const statusConfig = {
        upcoming: { label: 'Upcoming', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
        completed: { label: 'Completed', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
        cancelled: { label: 'Cancelled', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
    };
    const sc = statusConfig[interview.status];

    const saveFeedback = () => {
        setSaved(true);
        onFeedback?.(interview.id, feedback);
        setTimeout(() => setShowFeedback(false), 800);
    };

    return (
        <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
            borderRadius: 14, padding: '16px 18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            borderLeft: interview.status === 'upcoming' && isToday ? '3px solid var(--color-brand)' : '3px solid transparent',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{
                        width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                        background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, fontWeight: 700, color: '#7c3aed',
                        fontFamily: 'Space Grotesk, sans-serif',
                    }}>
                        {interview.candidateName[0].toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                            {interview.candidateName}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>
                            {interview.candidateRole}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span style={{
                        fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                        background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                    }}>
                        {sc.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#16a34a', fontFamily: 'Space Grotesk, sans-serif' }}>
                        +₹{interview.earnings.toLocaleString('en-IN')}
                    </span>
                </div>
            </div>

            {/* Time info */}
            <div style={{
                display: 'flex', gap: 16, padding: '10px 12px', borderRadius: 10,
                background: interview.status === 'upcoming' ? 'var(--color-sky)' : '#f8fafc',
                border: '1px solid var(--color-border-light)', marginBottom: 12,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>📅</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{dateStr}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>🕐</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{timeStr}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>⏱</span>
                    <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{interview.duration} min</span>
                </div>
            </div>

            {/* Feedback section */}
            {interview.status === 'completed' && (
                <div style={{ marginBottom: 12 }}>
                    {!showFeedback && !interview.feedback && (
                        <button onClick={() => setShowFeedback(true)} className="btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }}>
                            📝 Add feedback
                        </button>
                    )}
                    {interview.feedback && !showFeedback && (
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '6px 10px', background: '#f8fafc', borderRadius: 8 }}>
                            "{interview.feedback}"
                            <button onClick={() => setShowFeedback(true)} style={{ marginLeft: 8, fontSize: 11, color: 'var(--color-brand)', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                        </div>
                    )}
                    {showFeedback && (
                        <div>
                            <textarea
                                value={feedback}
                                onChange={e => setFeedback(e.target.value)}
                                placeholder="Share your feedback about this candidate…"
                                rows={2}
                                style={{
                                    display: 'block', width: '100%',
                                    padding: '8px 12px', borderRadius: 8, fontSize: 12,
                                    border: '1px solid var(--color-border-light)',
                                    outline: 'none', resize: 'none', boxSizing: 'border-box',
                                    fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)',
                                    marginBottom: 8,
                                }}
                            />
                            <button onClick={saveFeedback} className="btn-primary" style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8 }}>
                                {saved ? '✓ Saved' : 'Save Feedback'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            {interview.status === 'upcoming' && (
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => onReschedule?.(interview.id)} className="btn-ghost" style={{ flex: 1, fontSize: 12, padding: '7px 0', borderRadius: 8, border: '1px solid var(--color-border-light)' }}>
                        🔄 Reschedule
                    </button>
                    <button
                        onClick={() => onStart?.(interview.id)}
                        style={{
                            flex: 2, padding: '8px 0', borderRadius: 8, border: 'none',
                            background: isToday ? 'linear-gradient(to right, #7c3aed, #a78bfa)' : 'linear-gradient(to right, #02868C, #79C5C8)',
                            color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                            fontFamily: 'Space Grotesk, sans-serif',
                            boxShadow: `0 0 12px ${isToday ? 'rgba(124,58,237,0.3)' : 'rgba(20,154,160,0.25)'}`,
                        }}>
                        {isToday ? '🚀 Start Now' : '📅 View Details'}
                    </button>
                </div>
            )}
        </div>
    );
}
