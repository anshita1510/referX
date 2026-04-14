import { useEffect, useState } from 'react';
import Navbar from '../../components/dashboard/DashNavbar';
import api from '../../api/axiosClient';

interface Document {
    id: number;
    referral_id: number | null;
    offer_letter_url: string | null;
    joining_letter_url: string | null;
    salary_slip_url: string | null;
    verified: boolean;
    uploaded_at: string;
}

type DocField = 'offer_letter' | 'joining_letter' | 'salary_slip';

const DOC_LABELS: Record<DocField, { label: string; icon: string; desc: string }> = {
    offer_letter: { label: 'Offer Letter', icon: '📋', desc: 'Upload your job offer letter' },
    joining_letter: { label: 'Joining Letter', icon: '✍️', desc: 'Upload your joining confirmation' },
    salary_slip: { label: 'Salary Slip', icon: '💰', desc: 'Upload your first salary slip' },
};

export default function Documents() {
    const [docs, setDocs] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<DocField | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const load = () => {
        api.get('/api/documents').then(r => setDocs(r.data)).catch(() => { }).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

    const handleUpload = async (field: DocField, file: File) => {
        setUploading(field);
        const form = new FormData();
        form.append(field, file);
        try {
            await api.post('/api/documents/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
            showToast(`${DOC_LABELS[field].label} uploaded successfully!`);
            load();
        } catch (err: any) {
            showToast(err.response?.data?.error ?? 'Upload failed.');
        } finally { setUploading(null); }
    };

    const latest = docs[0];

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
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>Documents</h1>
                    <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-muted)' }}>Upload your post-hire documents to complete your profile.</p>
                </div>

                {/* Status banner */}
                {latest && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px',
                        borderRadius: 12, marginBottom: 24,
                        background: latest.verified ? '#f0fdf4' : 'var(--color-sky)',
                        border: `1px solid ${latest.verified ? '#bbf7d0' : 'var(--color-border)'}`,
                    }}>
                        <span style={{ fontSize: 22 }}>{latest.verified ? '✅' : '⏳'}</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: latest.verified ? '#16a34a' : 'var(--color-brand-dark)' }}>
                                {latest.verified ? 'Documents verified' : 'Verification pending'}
                            </p>
                            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>
                                Last updated {new Date(latest.uploaded_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                )}

                {loading && <p style={{ color: 'var(--color-text-soft)', textAlign: 'center', padding: '40px 0' }}>Loading…</p>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {(Object.keys(DOC_LABELS) as DocField[]).map(field => {
                        const meta = DOC_LABELS[field];
                        const existing = latest?.[`${field}_url` as keyof Document] as string | null;
                        return (
                            <div key={field} style={{
                                border: '1px solid var(--color-border-light)', borderRadius: 14,
                                padding: '20px 24px', background: 'var(--color-surface)',
                                boxShadow: '0 1px 4px rgba(20,154,160,0.05)',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <span style={{ fontSize: 28 }}>{meta.icon}</span>
                                    <div>
                                        <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 14, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>{meta.label}</p>
                                        <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>
                                            {existing ? '✓ Uploaded' : meta.desc}
                                        </p>
                                    </div>
                                </div>
                                <label style={{
                                    padding: '8px 18px', borderRadius: 9,
                                    background: existing ? 'var(--color-sky)' : 'var(--color-brand)',
                                    color: existing ? 'var(--color-brand-dark)' : '#fff',
                                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                    fontFamily: 'DM Sans, sans-serif', flexShrink: 0,
                                    opacity: uploading === field ? 0.6 : 1,
                                }}>
                                    {uploading === field ? 'Uploading…' : existing ? 'Replace' : 'Upload'}
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        style={{ display: 'none' }}
                                        disabled={uploading !== null}
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUpload(field, file);
                                            e.target.value = '';
                                        }}
                                    />
                                </label>
                            </div>
                        );
                    })}
                </div>

                <p style={{ marginTop: 20, fontSize: 12, color: 'var(--color-text-soft)', textAlign: 'center' }}>
                    Accepted formats: PDF, JPG, PNG · Max 5MB per file
                </p>
            </div>
        </div>
    );
}
