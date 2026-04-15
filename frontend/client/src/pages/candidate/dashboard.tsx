import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashNavbar from '../../components/dashboard/DashNavbar';
import StatsRow from '../../components/dashboard/StatsRow';
import ProfileBanner from '../../components/dashboard/ProfileBanner';
import QuickActions from '../../components/dashboard/QuickActions';
import RecentApplications from '../../components/dashboard/RecentApplications';
import AnalyticsPanel from '../../components/dashboard/AnalyticsPanel';
import JobMatchFeed from '../../components/dashboard/JobMatchFeed';
import ResumeScoreCard from '../../components/dashboard/ResumeScoreCard';
import GoalTracker from '../../components/dashboard/GoalTracker';
import ReferralNetwork from '../../components/dashboard/ReferralNetwork';
import HiringJourney from '../../components/dashboard/HiringJourney';
import { useAuth } from '../../context/AuthContext';
import { RefreshProvider } from '../../context/RefreshContext';
import api from '../../api/axiosClient';

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

export default function CandidateDashboard() {
    const { profile } = useAuth();
    const [nudge, setNudge] = useState<'apply' | 'referral' | null>(null);

    const cp = profile?.candidate_profile ?? {};
    const profileIncomplete = !cp.skills?.length || !cp.resume_url;

    useEffect(() => {
        if (profileIncomplete) { setNudge(null); return; }
        Promise.allSettled([
            api.get('/api/jobs/my-applications'),
            api.get('/api/referrals'),
        ]).then(([apps, refs]) => {
            if (apps.status === 'fulfilled' && apps.value.data.length === 0) setNudge('apply');
            else if (refs.status === 'fulfilled' && refs.value.data.length === 0) setNudge('referral');
            else setNudge(null);
        });
    }, [profile]);

    const firstName = profile?.name?.split(' ')[0] ?? '';

    return (
        <RefreshProvider>
            <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-sky) 60%, var(--color-periwinkle) 100%)' }}>
                <DashNavbar />
                <main style={{ width: '100%', padding: '28px 32px 48px', display: 'flex', flexDirection: 'column', gap: 20, boxSizing: 'border-box' }}>

                    {/* Greeting */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                            <p className="text-meta">
                                {getGreeting()} · <span style={{ color: 'var(--color-brand-dark)', fontWeight: 500 }}>
                                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </span>
                            </p>
                            <h1 style={{ margin: '4px 0 0', fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                                {firstName ? `${firstName}'s Job Search Hub` : 'Your Job Search Hub'}
                            </h1>
                        </div>
                        <Link to="/candidate/jobs" className="btn-hero" style={{ padding: '10px 22px', fontSize: 13 }}>
                            Browse Jobs ↗
                        </Link>
                    </div>

                    {/* Smart banner — profile OR nudge, never both */}
                    {profileIncomplete
                        ? <ProfileBanner profile={profile} />
                        : nudge && <NudgeBanner type={nudge} />
                    }

                    <StatsRow />
                    <QuickActions />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
                            <RecentApplications />
                            <AnalyticsPanel />
                            <JobMatchFeed />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <HiringJourney />
                            <ResumeScoreCard />
                            <GoalTracker />
                            <ReferralNetwork />
                        </div>
                    </div>
                </main>
            </div>
        </RefreshProvider>
    );
}

const NUDGES = {
    apply: {
        icon: '🚀', color: '#d97706',
        title: "You haven't applied to any jobs yet",
        desc: 'Start applying to get noticed by engineers and increase your chances of a referral.',
        cta: 'Browse Jobs', href: '/candidate/jobs',
    },
    referral: {
        icon: '🤝', color: '#7c3aed',
        title: 'Request your first referral',
        desc: 'A referral increases your interview chances by 5x. Ask an engineer now.',
        cta: 'Request Referral', href: '/candidate/referrals',
    },
};

function NudgeBanner({ type }: { type: 'apply' | 'referral' }) {
    const n = NUDGES[type];
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            padding: '14px 20px', borderRadius: 14, flexWrap: 'wrap',
            background: 'var(--color-surface)', border: '1px solid var(--color-border-light)',
            borderLeft: `4px solid ${n.color}`, boxShadow: '0 2px 12px rgba(20,154,160,0.07)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>{n.icon}</span>
                <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>{n.title}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{n.desc}</p>
                </div>
            </div>
            <Link to={n.href} style={{
                padding: '8px 18px', borderRadius: 9, fontSize: 'var(--text-sm)', fontWeight: 600,
                background: n.color, color: '#fff', textDecoration: 'none', flexShrink: 0,
            }}>{n.cta} →</Link>
        </div>
    );
}
