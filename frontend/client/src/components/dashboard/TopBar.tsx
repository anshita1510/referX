import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../api/axiosClient';

interface Notif { id: number; icon: string; text: string; time: string; unread: boolean }

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

export default function TopBar({ profile }: { profile: any }) {
    const [open, setOpen] = useState(false);
    const [notifs, setNotifs] = useState<Notif[]>([]);

    useEffect(() => {
        // Build notifications from real referral + interview data
        Promise.allSettled([
            api.get('/api/referrals'),
            api.get('/api/interviews'),
        ]).then(([refs, ivs]) => {
            const items: Notif[] = [];
            if (refs.status === 'fulfilled') {
                refs.value.data.slice(0, 2).forEach((r: any) => {
                    items.push({
                        id: r.id,
                        icon: r.status === 'accepted' ? '🤝' : '📋',
                        text: `${r.engineer?.name ?? 'An engineer'} ${r.status === 'accepted' ? 'accepted' : 'updated'} your referral for ${r.job?.title ?? 'a job'}`,
                        time: timeAgo(r.created_at),
                        unread: r.status === 'accepted',
                    });
                });
            }
            if (ivs.status === 'fulfilled') {
                ivs.value.data.slice(0, 2).forEach((iv: any) => {
                    if (iv.scheduled_at) {
                        items.push({
                            id: iv.id + 1000,
                            icon: '📅',
                            text: `Interview with ${iv.engineer?.name ?? 'engineer'} on ${new Date(iv.scheduled_at).toLocaleDateString()}`,
                            time: timeAgo(iv.created_at),
                            unread: iv.status === 'booked',
                        });
                    }
                });
            }
            setNotifs(items);
        });
    }, []);

    const unread = notifs.filter(n => n.unread).length;

    return (
        <header style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 28px', height: 60,
            background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--color-border-light)',
            position: 'sticky', top: 0, zIndex: 50,
        }}>
            <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {getGreeting()}, {profile?.name?.split(' ')[0] ?? 'there'} 👋
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Here's your job search overview</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Link href="/candidate/jobs" className="btn-hero" style={{ padding: '8px 18px', fontSize: 13 }}>
                    Browse jobs ↗
                </Link>

                <div style={{ position: 'relative' }}>
                    <button onClick={() => setOpen(o => !o)} style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: 'var(--color-sky)', border: '1px solid var(--color-border)',
                        cursor: 'pointer', fontSize: 17,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>🔔</button>
                    {unread > 0 && (
                        <span style={{
                            position: 'absolute', top: -4, right: -4, width: 18, height: 18,
                            background: '#dc2626', borderRadius: '50%', fontSize: 10, fontWeight: 700,
                            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '2px solid var(--color-surface)',
                        }}>{unread}</span>
                    )}
                    {open && (
                        <div style={{
                            position: 'absolute', top: 46, right: 0, width: 320,
                            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                            borderRadius: 14, boxShadow: '0 16px 48px rgba(20,154,160,0.15)',
                            zIndex: 100, overflow: 'hidden',
                        }}>
                            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>Notifications</span>
                                <span onClick={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))}
                                    style={{ fontSize: 11, color: 'var(--color-brand)', cursor: 'pointer', fontWeight: 600 }}>
                                    Mark all read
                                </span>
                            </div>
                            {notifs.length === 0 && (
                                <p style={{ margin: 0, padding: '20px 18px', fontSize: 13, color: 'var(--color-text-soft)', textAlign: 'center' }}>No notifications yet.</p>
                            )}
                            {notifs.map(n => (
                                <div key={n.id} style={{
                                    display: 'flex', gap: 12, padding: '12px 18px',
                                    borderBottom: '1px solid var(--color-border-light)',
                                    background: n.unread ? 'var(--color-sky)' : 'transparent',
                                }}>
                                    <span style={{ fontSize: 20, flexShrink: 0 }}>{n.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-primary)', lineHeight: 1.5 }}>{n.text}</p>
                                        <p style={{ margin: '3px 0 0', fontSize: 11, color: 'var(--color-text-soft)' }}>{n.time}</p>
                                    </div>
                                    {n.unread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-brand)', flexShrink: 0, marginTop: 4 }} />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
