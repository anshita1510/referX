interface ReferralCardProps {
    candidateName: string;
    jobTitle: string;
    company?: string;
    engineerName?: string;
    status: string;
    date?: string;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: '#fef9ec', color: '#d97706', label: 'Pending' },
    accepted: { bg: '#f0fdf4', color: '#16a34a', label: 'Accepted' },
    rejected: { bg: '#fef2f2', color: '#dc2626', label: 'Rejected' },
    hired: { bg: 'var(--color-sky)', color: 'var(--color-brand-dark)', label: 'Hired 🎉' },
};

export default function ReferralCard({ candidateName, jobTitle, company, engineerName, status, date }: ReferralCardProps) {
    const s = STATUS_STYLES[status] ?? { bg: '#f3f4f6', color: '#6b7280', label: status };
    return (
        <div style={{
            border: '1px solid var(--color-border-light)', borderRadius: 14,
            padding: '16px 20px', marginBottom: 10, background: 'var(--color-surface)',
            boxShadow: '0 1px 4px rgba(20,154,160,0.05)',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                    <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 14, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>{jobTitle}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>
                        {company && <span>{company} · </span>}
                        {engineerName ? `Referred by ${engineerName}` : candidateName}
                    </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                        fontSize: 12, fontWeight: 600, background: s.bg, color: s.color,
                    }}>{s.label}</span>
                    {date && <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--color-text-soft)' }}>{date}</p>}
                </div>
            </div>
        </div>
    );
}
