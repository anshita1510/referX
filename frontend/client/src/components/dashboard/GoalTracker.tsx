import { useEffect, useState } from 'react';
import api from '../../api/axiosClient';

const DAILY_GOAL = 3;
const WEEKLY_GOAL = 10;
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function GoalTracker() {
    const [weeklyDone, setWeeklyDone] = useState(0);
    const [dailyDone, setDailyDone] = useState(0);
    const [streak, setStreak] = useState(0);
    const [activeDays, setActiveDays] = useState<boolean[]>(Array(7).fill(false));

    useEffect(() => {
        api.get('/api/jobs/my-applications').then(r => {
            const apps: { applied_at: string }[] = r.data;
            const now = new Date();

            // Weekly count (last 7 days)
            const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
            const weekly = apps.filter(a => new Date(a.applied_at) >= weekAgo);
            setWeeklyDone(weekly.length);

            // Daily count (today)
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const daily = apps.filter(a => new Date(a.applied_at) >= today);
            setDailyDone(daily.length);

            // Active days this week (Mon=0 … Sun=6)
            const active = Array(7).fill(false);
            weekly.forEach(a => {
                const day = (new Date(a.applied_at).getDay() + 6) % 7;
                active[day] = true;
            });
            setActiveDays(active);
            setStreak(active.filter(Boolean).length);
        }).catch(() => { });
    }, []);

    const dailyPct = Math.min((dailyDone / DAILY_GOAL) * 100, 100);
    const weeklyPct = Math.min((weeklyDone / WEEKLY_GOAL) * 100, 100);

    return (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)', borderRadius: 16, padding: '20px 22px', boxShadow: '0 2px 12px rgba(20,154,160,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>Goal Tracker</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fef9ec', padding: '4px 10px', borderRadius: 20, border: '1px solid #fde68a' }}>
                    <span style={{ fontSize: 14 }}>🔥</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#d97706' }}>{streak} day streak</span>
                </div>
            </div>

            <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Today's applications</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: dailyPct >= 100 ? '#16a34a' : 'var(--color-brand)' }}>
                        {dailyDone}/{DAILY_GOAL}
                    </span>
                </div>
                <div style={{ height: 7, background: 'var(--color-sky)', borderRadius: 99 }}>
                    <div style={{
                        height: '100%', width: `${dailyPct}%`, borderRadius: 99,
                        background: dailyPct >= 100 ? '#16a34a' : 'linear-gradient(90deg, var(--color-brand-dark), var(--color-teal-light))',
                        transition: 'width 0.8s ease',
                    }} />
                </div>
            </div>

            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Weekly applications</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-brand-dark)' }}>{weeklyDone}/{WEEKLY_GOAL}</span>
                </div>
                <div style={{ height: 7, background: 'var(--color-sky)', borderRadius: 99 }}>
                    <div style={{
                        height: '100%', width: `${weeklyPct}%`, borderRadius: 99,
                        background: 'linear-gradient(90deg, var(--color-periwinkle), var(--color-brand))',
                        transition: 'width 0.8s ease',
                    }} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
                {DAYS.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{
                            width: '100%', aspectRatio: '1', borderRadius: 6,
                            background: activeDays[i] ? 'var(--color-brand)' : 'var(--color-sky)',
                            border: '1px solid var(--color-border-light)',
                            transition: 'background 0.3s',
                        }} />
                        <span style={{ fontSize: 9, color: 'var(--color-text-soft)' }}>{d}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
