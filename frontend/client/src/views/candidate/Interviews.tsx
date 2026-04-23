import { useEffect, useState } from 'react';
import Navbar from '../../components/dashboard/DashNavbar';
import api from '../../api/axiosClient';

interface Interview {
    id: number;
    engineer: { name: string; engineer_profile?: { company?: string; designation?: string } };
    scheduled_at: string | null;
    status: string;
    notes: string | null;
    feedback: string | null;
}

interface Engineer {
    id: number;
    name: string;
    engineer_profile?: { company?: string; designation?: string; experience_years?: number };
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
    booked: { bg: 'var(--color-sky)', color: 'var(--color-brand-dark)' },
    completed: { bg: '#f0fdf4', color: '#16a34a' },
    cancelled: { bg: '#fef2f2', color: '#dc2626' },
};

export default function Interviews() {
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [engineers, setEngineers] = useState<Engineer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBook, setShowBook] = useState(false);
    const [selectedEng, setSelectedEng] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');
    const [notes, setNotes] = useState('');
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const load = () => {
        api.get('/api/interviews').then(r => setInterviews(r.data)).catch(() => { }).finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
        api.get('/api/auth/candidates').then(r => setEngineers(r.data)).catch(() => { });
    }, []);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const handleBook = async () => {
        if (!selectedEng || !scheduledAt) return;
        setBusy(true);
        try {
            await api.post('/api/interviews', { engineer_id: Number(selectedEng), scheduled_at: scheduledAt, notes });
            showToast('Interview booked!');
            setShowBook(false);
            setSelectedEng(''); setScheduledAt(''); setNotes('');
            load();
        } catch (err: any) {
            showToast(err.response?.data?.error ?? 'Failed to book.');
        } finally { setBusy(false); }
    };

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h1 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>Mock Interviews</h1>
                        <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-muted)' }}>Book sessions with engineers to prep for your interviews.</p>
                    </div>
                    <button onClick={() => setShowBook(true)} style={{
                        padding: '10px 20px', background: 'var(--color-brand)', color: '#fff',
                        border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                        fontFamily: 'DM Sans, sans-serif',
                    }}>+ Book Interview</button>
                </div>

                {/* Book modal */}
                {showBook && (
                    <div style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
                    }}>
                        <div style={{ background: 'var(--color-surface)', borderRadius: 16, padding: 32, width: '100%', maxWidth: 440, boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}>
                            <h2 style={{ margin: '0 0 20px', fontFamily: 'Space Grotesk, sans-serif', color: 'var(--color-text-primary)' }}>Book a Mock Interview</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', display: 'block', marginBottom: 6 }}>Select Engineer</label>
                                    <select value={selectedEng} onChange={e => setSelectedEng(e.target.value)} className="auth-input">
                                        <option value="">Choose an engineer…</option>
                                        {engineers.map(e => (
                                            <option key={e.id} value={e.id}>
                                                {e.name}{e.engineer_profile?.company ? ` — ${e.engineer_profile.company}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', display: 'block', marginBottom: 6 }}>Date & Time</label>
                                    <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} className="auth-input" />
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', display: 'block', marginBottom: 6 }}>Notes (optional)</label>
                                    <textarea value={notes} onChange={e => setNotes(e.target.value)} className="auth-input" rows={3} placeholder="Topics you want to cover…" style={{ resize: 'vertical' }} />
                                </div>
                                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                                    <button onClick={() => setShowBook(false)} style={{
                                        flex: 1, padding: '10px 0', border: '1.5px solid var(--color-border)',
                                        borderRadius: 10, background: 'var(--color-surface)', cursor: 'pointer',
                                        fontSize: 14, color: 'var(--color-text-muted)', fontFamily: 'DM Sans, sans-serif',
                                    }}>Cancel</button>
                                    <button onClick={handleBook} disabled={busy || !selectedEng || !scheduledAt} className="auth-btn" style={{ flex: 1 }}>
                                        {busy ? 'Booking…' : 'Confirm Booking'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {loading && <p style={{ color: 'var(--color-text-soft)', textAlign: 'center', padding: '40px 0' }}>Loading…</p>}
                {!loading && interviews.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>No interviews booked yet.</p>
                    </div>
                )}
                {interviews.map(iv => {
                    const s = STATUS_STYLES[iv.status] ?? { bg: '#f3f4f6', color: '#6b7280' };
                    return (
                        <div key={iv.id} style={{
                            border: '1px solid var(--color-border-light)', borderRadius: 14,
                            padding: '18px 22px', marginBottom: 12, background: 'var(--color-surface)',
                            boxShadow: '0 1px 4px rgba(20,154,160,0.05)',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 15, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                                        {iv.engineer?.name}
                                    </p>
                                    <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--color-text-muted)' }}>
                                        {iv.engineer?.engineer_profile?.company ?? 'Engineer'}
                                        {iv.scheduled_at ? ` · ${new Date(iv.scheduled_at).toLocaleString()}` : ' · Time TBD'}
                                    </p>
                                    {iv.notes && <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>📝 {iv.notes}</p>}
                                    {iv.feedback && <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--color-brand-dark)', background: 'var(--color-sky)', padding: '4px 10px', borderRadius: 8, display: 'inline-block' }}>Feedback: {iv.feedback}</p>}
                                </div>
                                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color, flexShrink: 0 }}>
                                    {iv.status.charAt(0).toUpperCase() + iv.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
