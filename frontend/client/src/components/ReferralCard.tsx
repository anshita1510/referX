interface ReferralCardProps {
    candidateName: string;
    jobTitle: string;
    status: string;
    date?: string;
}

export default function ReferralCard({ candidateName, jobTitle, status, date }: ReferralCardProps) {
    const statusColor: Record<string, string> = {
        pending: '#f59e0b',
        accepted: '#10b981',
        rejected: '#ef4444',
        hired: '#3b82f6',
    };

    return (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{candidateName}</p>
                    <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>{jobTitle}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ color: statusColor[status] ?? '#6b7280', fontWeight: 600, fontSize: 13 }}>
                        {status}
                    </span>
                    {date && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9ca3af' }}>{date}</p>}
                </div>
            </div>
        </div>
    );
}
