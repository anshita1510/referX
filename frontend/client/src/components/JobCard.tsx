interface JobCardProps {
    title: string;
    company: string;
    description?: string;
    onApply?: () => void;
}

export default function JobCard({ title, company, description, onApply }: JobCardProps) {
    return (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <h3 style={{ margin: '0 0 4px' }}>{title}</h3>
            <p style={{ margin: '0 0 8px', color: '#6b7280', fontSize: 14 }}>{company}</p>
            {description && <p style={{ margin: '0 0 12px', fontSize: 14 }}>{description}</p>}
            {onApply && (
                <button onClick={onApply}
                    style={{ padding: '6px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    Apply
                </button>
            )}
        </div>
    );
}
