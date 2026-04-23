import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../api/axiosClient';

const STEPS = [
    { id: 1, label: 'Account created', sub: 'You\'re in!', href: null },
    { id: 2, label: 'Profile set up', sub: 'Resume + skills added', href: '/candidate/profile-setup' },
    { id: 3, label: 'First application', sub: 'Apply to a job', href: '/candidate/jobs' },
    { id: 4, label: 'Get a referral', sub: 'Request from an engineer', href: '/candidate/referrals' },
    { id: 5, label: 'Land the interview', sub: 'Company calls you', href: null },
];

export default function HiringJourney() {
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        Promise.allSettled([
            api.get('/api/auth/me'),
            api.get('/api/jobs/my-applications'),
            api.get('/api/referrals'),
            api.get('/api/interviews'),
        ]).then(([me, apps, refs, ivs]) => {
            let step = 1;
            const profile = me.status === 'fulfilled' ? me.value.data : null;
            if (profile?.candidate_profile?.skills?.length > 0 && profile?.candidate_profile?.resume_url) step = 2;
            if (apps.status === 'fulfilled' && apps.value.data.length > 0) step = 3;
            if (refs.status === 'fulfilled' && refs.value.data.length > 0) step = 4;
            if (ivs.status === 'fulfilled' && ivs.value.data.some((i: any) => i.status === 'completed')) step = 5;
            setCurrentStep(step);
        });
    }, []);

    const pct = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100);

    return (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)', borderRadius: 16, padding: '20px 22px', boxShadow: '0 2px 12px rgba(20,154,160,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Your Hiring Journey
                </h3>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-brand-dark)', background: 'var(--color-sky)', padding: '2px 10px', borderRadius: 20, border: '1px solid var(--color-border)' }}>
                    {pct}% done
                </span>
            </div>
            <p style={{ margin: '0 0 14px', fontSize: 11, color: 'var(--color-text-muted)' }}>
                Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1]?.label}
            </p>

            {/* Progress bar */}
            <div style={{ height: 5, background: 'var(--color-sky)', borderRadius: 99, marginBottom: 18, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: 'linear-gradient(90deg, var(--color-brand-dark), var(--color-teal-light))', transition: 'width 0.8s ease' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {STEPS.map((step, i) => {
                    const done = step.id < currentStep;
                    const active = step.id === currentStep;
                    return (
                        <div key={step.id} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                            {i < STEPS.length - 1 && (
                                <div style={{
                                    position: 'absolute', left: 13, top: 26, width: 2, height: 26,
                                    background: done ? 'var(--color-brand)' : 'var(--color-sky)',
                                    transition: 'background 0.4s',
                                }} />
                            )}
                            <div style={{
                                width: 28, height: 28, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, fontWeight: 700,
                                background: done ? 'var(--color-brand)' : active ? 'var(--color-sky)' : 'var(--color-sky)',
                                border: active ? '2px solid var(--color-brand)' : done ? 'none' : '2px solid var(--color-border)',
                                color: done ? '#fff' : active ? 'var(--color-brand-dark)' : 'var(--color-text-soft)',
                                transition: 'all 0.3s',
                            }}>
                                {done ? '✓' : step.id}
                            </div>
                            <div style={{ paddingBottom: i < STEPS.length - 1 ? 18 : 0, flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: done ? 'var(--color-brand-dark)' : active ? 'var(--color-text-primary)' : 'var(--color-text-soft)' }}>
                                        {step.label}
                                    </div>
                                    <div style={{ fontSize: 10, color: 'var(--color-text-soft)', marginTop: 1 }}>{step.sub}</div>
                                </div>
                                {active && step.href && (
                                    <Link href={step.href} style={{ fontSize: 10, color: 'var(--color-brand)', fontWeight: 700, textDecoration: 'none', flexShrink: 0, marginTop: 2 }}>
                                        Do it →
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
