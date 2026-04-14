import { useEffect, useState } from 'react';
import Navbar from '../../components/dashboard/DashNavbar';
import JobCard from '../../components/JobCard';
import api from '../../api/axiosClient';

interface Job {
    id: number;
    title: string;
    company_name: string;
    description: string;
    location: string;
    salary_range: string;
    skills_required: string[];
}

export default function BrowseJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [applied, setApplied] = useState<Set<number>>(new Set());
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        api.get('/api/jobs')
            .then(r => setJobs(r.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleApply = async (jobId: number, title: string) => {
        try {
            await api.post(`/api/jobs/${jobId}/apply`);
            setApplied(prev => new Set(prev).add(jobId));
            showToast(`Applied to "${title}" successfully!`);
        } catch (err: any) {
            showToast(err.response?.data?.error ?? 'Failed to apply.');
        }
    };

    const handleReferral = async (jobId: number, title: string) => {
        try {
            await api.post('/api/referrals/request', { job_id: jobId });
            showToast(`Referral requested for "${title}"!`);
        } catch (err: any) {
            showToast(err.response?.data?.error ?? 'Failed to request referral.');
        }
    };

    const filtered = jobs.filter(j =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company_name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Navbar />

            {toast && (
                <div style={{
                    position: 'fixed', top: 16, right: 16, zIndex: 999,
                    background: 'var(--color-brand)', color: '#fff',
                    padding: '12px 20px', borderRadius: 10, fontSize: 14, fontWeight: 500,
                    boxShadow: '0 4px 16px rgba(20,154,160,0.3)',
                }}>{toast}</div>
            )}

            <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>Browse Jobs</h1>
                    <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 14 }}>{jobs.length} open positions</p>
                </div>

                <input
                    type="text"
                    placeholder="Search by title or company…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="auth-input"
                    style={{ marginBottom: 20 }}
                />

                {loading && <p style={{ color: 'var(--color-text-soft)', textAlign: 'center', padding: '40px 0' }}>Loading jobs…</p>}
                {!loading && filtered.length === 0 && (
                    <p style={{ color: 'var(--color-text-soft)', textAlign: 'center', padding: '40px 0' }}>No jobs found.</p>
                )}
                {filtered.map(job => (
                    <JobCard
                        key={job.id}
                        title={job.title}
                        company={job.company_name ?? 'Company'}
                        location={job.location}
                        salary_range={job.salary_range}
                        skills={job.skills_required}
                        description={job.description}
                        applied={applied.has(job.id)}
                        onApply={() => handleApply(job.id, job.title)}
                        onRequestReferral={() => handleReferral(job.id, job.title)}
                    />
                ))}
            </div>
        </div>
    );
}
