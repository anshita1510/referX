import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axiosClient';

interface Candidate {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface Job {
    id: number;
    title: string;
    company_name: string;
}

export default function CandidateList() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [search, setSearch] = useState('');
    const [selectedJob, setSelectedJob] = useState<number | null>(null);
    const [referring, setReferring] = useState<number | null>(null);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        api.get('/api/auth/candidates').then(r => setCandidates(r.data)).catch(() => { });
        api.get('/api/jobs').then(r => setJobs(r.data)).catch(() => { });
    }, []);

    const handleRefer = async (candidateId: number) => {
        if (!selectedJob) return setMsg('Please select a job first.');
        setReferring(candidateId);
        try {
            await api.post('/api/referrals', { candidateId, jobId: selectedJob });
            setMsg('Referral submitted successfully.');
        } catch {
            setMsg('Failed to submit referral.');
        } finally {
            setReferring(null);
        }
    };

    const filtered = candidates.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.content}>
                <h1 style={styles.heading}>Candidates</h1>

                <div style={styles.toolbar}>
                    <input
                        type="text"
                        placeholder="Search candidates…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={styles.search}
                    />
                    <select
                        value={selectedJob ?? ''}
                        onChange={e => setSelectedJob(Number(e.target.value) || null)}
                        style={styles.select}
                    >
                        <option value="">Select a job to refer to</option>
                        {jobs.map(j => (
                            <option key={j.id} value={j.id}>{j.title} — {j.company_name}</option>
                        ))}
                    </select>
                </div>

                {msg && <div style={styles.msg}>{msg}</div>}

                {filtered.length === 0
                    ? <p style={styles.empty}>No candidates found.</p>
                    : filtered.map(c => (
                        <div key={c.id} style={styles.row}>
                            <div style={styles.avatar}>{(c.name ?? 'U')[0].toUpperCase()}</div>
                            <div style={{ flex: 1 }}>
                                <div style={styles.name}>{c.name}</div>
                                <div style={styles.email}>{c.email}</div>
                            </div>
                            <button
                                onClick={() => handleRefer(c.id)}
                                disabled={referring === c.id}
                                style={styles.referBtn}
                            >
                                {referring === c.id ? 'Referring…' : 'Refer'}
                            </button>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' },
    content: { maxWidth: 760, margin: '0 auto', padding: '32px 24px' },
    heading: { margin: '0 0 20px', fontSize: 24, fontWeight: 700, color: '#111' },
    toolbar: { display: 'flex', gap: 12, marginBottom: 16 },
    search: {
        flex: 1,
        padding: '10px 14px',
        border: '1px solid #d1d5db',
        borderRadius: 8,
        fontSize: 14,
        outline: 'none',
    },
    select: {
        flex: 1,
        padding: '10px 14px',
        border: '1px solid #d1d5db',
        borderRadius: 8,
        fontSize: 14,
        outline: 'none',
    },
    msg: {
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        color: '#16a34a',
        borderRadius: 6,
        padding: '10px 14px',
        fontSize: 14,
        marginBottom: 16,
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: '#fff',
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: '#dbeafe',
        color: '#3b82f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 16,
        flexShrink: 0,
    },
    name: { fontWeight: 600, fontSize: 14, color: '#111' },
    email: { fontSize: 13, color: '#6b7280', marginTop: 2 },
    referBtn: {
        padding: '7px 18px',
        background: '#3b82f6',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
    },
    empty: { color: '#9ca3af', fontSize: 14, textAlign: 'center', padding: '40px 0' },
};
