interface JobCardProps {
    title: string;
    company: string;
    location?: string;
    salary_range?: string;
    skills?: string[];
    description?: string;
    onApply?: () => void;
    onRequestReferral?: () => void;
    applied?: boolean;
}

export default function JobCard({ title, company, location, salary_range, skills, description, onApply, onRequestReferral, applied }: JobCardProps) {
    return (
        <div style={{
            border: '1px solid var(--color-border-light)', borderRadius: 14,
            padding: '20px 24px', marginBottom: 12, background: 'var(--color-surface)',
            boxShadow: '0 1px 4px rgba(20,154,160,0.06)', transition: 'box-shadow 0.2s',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h3>
                    <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--color-text-muted)' }}>
                        {company}{location ? ` · ${location}` : ''}{salary_range ? ` · ${salary_range}` : ''}
                    </p>
                    {description && <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{description.slice(0, 120)}{description.length > 120 ? '…' : ''}</p>}
                    {skills && skills.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {skills.slice(0, 5).map(s => (
                                <span key={s} style={{
                                    fontSize: 11, padding: '2px 8px', borderRadius: 20,
                                    background: 'var(--color-sky)', color: 'var(--color-brand-dark)', fontWeight: 500,
                                }}>{s}</span>
                            ))}
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                    {onApply && (
                        <button onClick={onApply} style={{
                            padding: '7px 16px',
                            background: applied ? '#f0fdf4' : 'var(--color-brand)',
                            color: applied ? '#16a34a' : '#fff',
                            border: applied ? '1.5px solid #bbf7d0' : 'none',
                            borderRadius: 8, fontSize: 13, fontWeight: 600,
                            cursor: 'pointer', fontFamily: 'var(--font-body)',
                            transition: 'all 0.15s',
                        }}>{applied ? 'Applied ✓' : 'Apply'}</button>
                    )}
                    {onRequestReferral && (
                        <button onClick={onRequestReferral} style={{
                            padding: '7px 16px', background: 'var(--color-surface)',
                            color: 'var(--color-brand-dark)', border: '1.5px solid var(--color-brand)',
                            borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            fontFamily: 'DM Sans, sans-serif',
                        }}>Request Referral</button>
                    )}
                </div>
            </div>
        </div>
    );
}
