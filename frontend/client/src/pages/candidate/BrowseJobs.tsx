import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import JobCard from '../../components/JobCard';
import api from '../../api/axiosClient';

interface Job {
    id: number;
    title: string;
    company_name: string;
    description: string;
    created_at: string;
}

export default function BrowseJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/jobs')
            .then(r => setJobs(r.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const filtered = jobs.filter(j =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company_name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.header}>
                    <h1 style={styles.heading}>Browse Jobs</h1>
                    <p style={styles.sub}>{jobs.length} open positions</p>
                </div>

                <input
                    type="text"
                    placeholder="Search by title or company…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={styles.search}
                />

                {loading && <p style={styles.empty}>Loading jobs…</p>}
                {!loading && filtered.length === 0 && (
                    <p style={styles.empty}>No jobs found.</p>
                )}
                {filtered.map(job => (
                    <JobCard
                        key={job.id}
                        title={job.title}
                        company={job.company_name ?? 'Company'}
                        description={job.description}
                        onApply={() => alert(`Applied to: ${job.title}`)}
                    />
                ))}
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' },
    content: { maxWidth: 760, margin: '0 auto', padding: '32px 24px' },
    header: { marginBottom: 20 },
    heading: { margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#111' },
    sub: { margin: 0, color: '#6b7280', fontSize: 14 },
    search: {
        display: 'block',
        width: '100%',
        padding: '10px 14px',
        border: '1px solid #d1d5db',
        borderRadius: 8,
        fontSize: 14,
        marginBottom: 20,
        boxSizing: 'border-box',
        outline: 'none',
    },
    empty: { color: '#9ca3af', fontSize: 14, textAlign: 'center', padding: '40px 0' },
};
