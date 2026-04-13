import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import JobCard from '../../components/JobCard';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosClient';

interface Job {
    id: number;
    title: string;
    description: string;
    created_at: string;
}

interface Referral {
    id: number;
    status: string;
}

export default function CompanyDashboard() {
    const { profile } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [referrals, setReferrals] = useState<Referral[]>([]);

    useEffect(() => {
        api.get('/api/jobs').then(r => setJobs(r.data)).catch(() => { });
        api.get('/api/referrals').then(r => setReferrals(r.data)).catch(() => { });
    }, []);

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.heading}>Welcome, {profile?.name ?? 'Company'}</h1>
                        <p style={styles.sub}>Manage your job postings and track applicants.</p>
                    </div>
                    <Link to="/company/post-job" style={styles.ctaBtn}>+ Post a Job</Link>
                </div>

                <div style={styles.statsRow}>
                    {[
                        { label: 'Active Jobs', value: jobs.length, color: '#3b82f6' },
                        { label: 'Total Referrals', value: referrals.length, color: '#8b5cf6' },
                        { label: 'Hired', value: referrals.filter(r => r.status === 'hired').length, color: '#10b981' },
                    ].map(s => (
                        <div key={s.label} style={styles.statCard}>
                            <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
                            <div style={styles.statLabel}>{s.label}</div>
                        </div>
                    ))}
                </div>

                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Your Job Postings</h2>
                        <Link to="/company/post-job" style={styles.viewAll}>+ New Job</Link>
                    </div>
                    {jobs.length === 0
                        ? <p style={styles.empty}>No jobs posted yet. <Link to="/company/post-job">Post your first job</Link></p>
                        : jobs.map(j => (
                            <JobCard
                                key={j.id}
                                title={j.title}
                                company={profile?.name ?? 'Your Company'}
                                description={j.description}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' },
    content: { maxWidth: 900, margin: '0 auto', padding: '32px 24px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
    heading: { margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#111' },
    sub: { margin: 0, color: '#6b7280', fontSize: 14 },
    ctaBtn: {
        padding: '10px 20px',
        background: '#3b82f6',
        color: '#fff',
        borderRadius: 8,
        textDecoration: 'none',
        fontSize: 14,
        fontWeight: 600,
    },
    statsRow: { display: 'flex', gap: 16, marginBottom: 32 },
    statCard: {
        flex: 1,
        background: '#fff',
        borderRadius: 10,
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
    },
    statValue: { fontSize: 32, fontWeight: 700, marginBottom: 4 },
    statLabel: { fontSize: 13, color: '#6b7280', fontWeight: 500 },
    section: { background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.07)' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { margin: 0, fontSize: 16, fontWeight: 700, color: '#111' },
    viewAll: { fontSize: 13, color: '#3b82f6', textDecoration: 'none', fontWeight: 500 },
    empty: { color: '#9ca3af', fontSize: 14, textAlign: 'center', padding: '24px 0' },
};
