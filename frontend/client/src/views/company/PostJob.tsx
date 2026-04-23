'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import api from '../../api/axiosClient';

export default function PostJob() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDesc] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setBusy(true);
        setError('');
        try {
            await api.post('/api/jobs', { title, description, location, salary });
            router.push('/company/dashboard');
        } catch {
            setError('Failed to post job. Please try again.');
            setBusy(false);
        }
    };

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.header}>
                    <h1 style={styles.heading}>Post a Job</h1>
                    <p style={styles.sub}>Fill in the details to attract the right candidates.</p>
                </div>

                <div style={styles.card}>
                    {error && <div style={styles.errorBox}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div style={styles.field}>
                            <label style={styles.label}>Job Title *</label>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                placeholder="e.g. Senior Frontend Engineer"
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.row}>
                            <div style={{ ...styles.field, flex: 1 }}>
                                <label style={styles.label}>Location</label>
                                <input
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    placeholder="e.g. Bangalore / Remote"
                                    style={styles.input}
                                />
                            </div>
                            <div style={{ ...styles.field, flex: 1 }}>
                                <label style={styles.label}>Salary Range</label>
                                <input
                                    value={salary}
                                    onChange={e => setSalary(e.target.value)}
                                    placeholder="e.g. ₹15–25 LPA"
                                    style={styles.input}
                                />
                            </div>
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Job Description *</label>
                            <textarea
                                value={description}
                                onChange={e => setDesc(e.target.value)}
                                required
                                rows={6}
                                placeholder="Describe the role, responsibilities, and requirements…"
                                style={{ ...styles.input, resize: 'vertical' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                            <button type="submit" disabled={busy} style={styles.primaryBtn}>
                                {busy ? 'Posting…' : 'Post Job'}
                            </button>
                            <button type="button" onClick={() => router.push('/company/dashboard')} style={styles.cancelBtn}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' },
    content: { maxWidth: 680, margin: '0 auto', padding: '32px 24px' },
    header: { marginBottom: 24 },
    heading: { margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#111' },
    sub: { margin: 0, color: '#6b7280', fontSize: 14 },
    card: {
        background: '#fff',
        borderRadius: 12,
        padding: '28px 32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    },
    errorBox: {
        background: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#dc2626',
        borderRadius: 6,
        padding: '10px 14px',
        fontSize: 14,
        marginBottom: 16,
    },
    field: { marginBottom: 18 },
    row: { display: 'flex', gap: 16 },
    label: { display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 },
    input: {
        display: 'block',
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: 6,
        fontSize: 14,
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
    },
    primaryBtn: {
        padding: '10px 28px',
        background: '#3b82f6',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
    },
    cancelBtn: {
        padding: '10px 20px',
        background: '#fff',
        color: '#374151',
        border: '1px solid #d1d5db',
        borderRadius: 6,
        fontSize: 15,
        cursor: 'pointer',
    },
};
