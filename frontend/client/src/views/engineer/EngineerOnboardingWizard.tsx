'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { Check, ChevronLeft, ChevronRight, Shield } from 'lucide-react';

const TECH_STACK = [
    'React', 'Node.js', 'Python', 'Java', 'TypeScript', 'Go', 'AWS', 'Docker', 'Kubernetes',
    'PostgreSQL', 'MongoDB', 'Redis', 'Kafka', 'System Design', 'Next.js', 'GraphQL', 'Tailwind',
];

const EXPERIENCE_BANDS = [
    { value: '0-1', label: '0–1 years' },
    { value: '1-3', label: '1–3 years' },
    { value: '3-5', label: '3–5 years' },
    { value: '5+', label: '5+ years' },
] as const;

const INTERVIEW_TYPES = ['MCQ', 'Coding', 'System Design', 'HR'] as const;

const STEPS = [
    'Basics & contact',
    'Professional',
    'Verification',
    'Referrals',
    'Interviews',
    'Availability',
    'Payments',
    'Agreements',
];

type ExperienceBand = (typeof EXPERIENCE_BANDS)[number]['value'];

export default function EngineerOnboardingWizard() {
    const router = useRouter();
    const { profile, logout } = useAuth();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [trustScore, setTrustScore] = useState(0);
    const [completion, setCompletion] = useState(0);

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [accountEmailOtp, setAccountEmailOtp] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');
    const [primaryEmailVerified, setPrimaryEmailVerified] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);

    const [company, setCompany] = useState('');
    const [designation, setDesignation] = useState('');
    const [experienceBand, setExperienceBand] = useState<ExperienceBand>('1-3');
    const [skills, setSkills] = useState<string[]>([]);
    const [location, setLocation] = useState('');

    const [linkedin, setLinkedin] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyEmailOtp, setCompanyEmailOtp] = useState('');
    const [companyEmailVerified, setCompanyEmailVerified] = useState(false);

    const [canRefer, setCanRefer] = useState(true);
    const [referralCompaniesText, setReferralCompaniesText] = useState('');
    const [maxReferrals, setMaxReferrals] = useState(5);

    const [canInterview, setCanInterview] = useState(true);
    const [interviewTypes, setInterviewTypes] = useState<string[]>(['Coding', 'System Design']);
    const [interviewNotes, setInterviewNotes] = useState('');

    const [hoursPerWeek, setHoursPerWeek] = useState(6);
    const [slotDay, setSlotDay] = useState('Saturday');
    const [slotStart, setSlotStart] = useState('10:00');
    const [slotEnd, setSlotEnd] = useState('14:00');

    const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'bank_transfer'>('UPI');
    const [upiId, setUpiId] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifsc, setIfsc] = useState('');

    const [terms, setTerms] = useState(false);
    const [policy, setPolicy] = useState(false);

    const refresh = useCallback(async () => {
        const { data } = await api.get('/api/engineers/onboarding');
        const u = data.user;
        const ep = data.engineer_profile;
        setFullName(u.name ?? '');
        setPhone(u.phone ?? '');
        setPhoneVerified(!!u.phone_verified);
        setPrimaryEmailVerified(!!ep.primary_email_otp_verified);
        setCompany(ep.company ?? '');
        setDesignation(ep.designation ?? '');
        if (ep.experience_band) setExperienceBand(ep.experience_band as ExperienceBand);
        setSkills(ep.skills ?? []);
        setLocation(ep.location ?? '');
        setLinkedin(ep.linkedin ?? '');
        setCompanyEmail(ep.company_email ?? '');
        setCompanyEmailVerified(!!ep.company_email_verified);
        setCanRefer(ep.can_refer_in_company ?? true);
        setReferralCompaniesText((ep.referral_companies ?? []).join(', '));
        setMaxReferrals(ep.max_referrals_per_month ?? 5);
        setCanInterview(ep.can_mock_interviews ?? true);
        setInterviewTypes(ep.interview_types?.length ? ep.interview_types : ['Coding']);
        setInterviewNotes(ep.interview_experience_notes ?? '');
        setHoursPerWeek(ep.hours_per_week ?? 6);
        const slots = (ep.preferred_time_slots as { day: string; start: string; end: string }[] | null) ?? [];
        if (slots[0]) {
            setSlotDay(slots[0].day);
            setSlotStart(slots[0].start);
            setSlotEnd(slots[0].end);
        }
        if (ep.payment_method === 'bank_transfer' || ep.payment_method === 'UPI') {
            setPaymentMethod(ep.payment_method);
        }
        setTrustScore(data.trust_score ?? ep.trust_score ?? 0);
        setCompletion(data.profile_completion_pct ?? 0);
        setStep(Math.min(7, Math.max(0, ep.onboarding_step ?? 0)));
    }, []);

    useEffect(() => {
        setLoading(true);
        refresh()
            .catch(() => setError('Could not load onboarding state.'))
            .finally(() => setLoading(false));
    }, [refresh]);

    const persistStep = async (nextStep: number, patch: Record<string, unknown>) => {
        setSaving(true);
        setError(null);
        try {
            const { data } = await api.patch('/api/engineers/onboarding', { step: nextStep, ...patch });
            setTrustScore(data.trust_score);
            setCompletion(data.profile_completion_pct);
        } catch (e: any) {
            const msg = e.response?.data?.error ?? e.message ?? 'Save failed';
            setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
            throw e;
        } finally {
            setSaving(false);
        }
    };

    const toggleSkill = (s: string) => {
        setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
    };

    const toggleInterviewType = (s: string) => {
        setInterviewTypes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
    };

    const progressPct = useMemo(() => Math.round(((step + 1) / STEPS.length) * 100), [step]);

    const goNext = async () => {
        setError(null);
        try {
            if (step === 0) {
                if (!fullName.trim() || !phone.trim()) {
                    setError('Name and phone are required.');
                    return;
                }
                await persistStep(1, { full_name: fullName.trim(), phone: phone.trim() });
            } else if (step === 1) {
                if (!company.trim() || !designation.trim() || !location.trim() || skills.length === 0) {
                    setError('Company, title, location, and at least one skill are required.');
                    return;
                }
                await persistStep(2, {
                    company: company.trim(),
                    designation: designation.trim(),
                    experience_band: experienceBand,
                    skills,
                    location: location.trim(),
                });
            } else if (step === 2) {
                if (!linkedin.trim() || !companyEmail.trim()) {
                    setError('LinkedIn and company email are required.');
                    return;
                }
                await persistStep(3, {
                    linkedin: linkedin.trim(),
                    company_email: companyEmail.trim(),
                });
            } else if (step === 3) {
                const companies = referralCompaniesText
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
                await persistStep(4, {
                    can_refer_in_company: canRefer,
                    referral_companies: companies,
                    max_referrals_per_month: maxReferrals,
                });
            } else if (step === 4) {
                await persistStep(5, {
                    can_mock_interviews: canInterview,
                    interview_types: interviewTypes,
                    interview_experience_notes: interviewNotes || null,
                });
            } else if (step === 5) {
                await persistStep(6, {
                    hours_per_week: hoursPerWeek,
                    preferred_time_slots: [{ day: slotDay, start: slotStart, end: slotEnd }],
                });
            } else if (step === 6) {
                if (paymentMethod === 'UPI' && !upiId.trim()) {
                    setError('UPI ID is required.');
                    return;
                }
                if (paymentMethod === 'bank_transfer' && (!bankName.trim() || !accountHolder.trim() || !accountNumber.trim() || !ifsc.trim())) {
                    setError('All bank fields are required for bank transfer.');
                    return;
                }
                const payment_details =
                    paymentMethod === 'UPI'
                        ? { upi_id: upiId.trim() }
                        : {
                              bank_name: bankName.trim(),
                              account_holder: accountHolder.trim(),
                              account_number: accountNumber.trim(),
                              ifsc: ifsc.trim().toUpperCase(),
                          };
                await persistStep(7, { payment_method: paymentMethod, payment_details });
            }
            setStep((s) => Math.min(7, s + 1));
        } catch {
            /* error set */
        }
    };

    const goBack = () => setStep((s) => Math.max(0, s - 1));

    const submitForReview = async () => {
        setSaving(true);
        setError(null);
        try {
            await api.post('/api/engineers/onboarding/submit');
            router.replace('/engineer/dashboard');
        } catch (e: any) {
            const msg = e.response?.data?.details ?? e.response?.data?.error ?? 'Submit failed';
            setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-sky)' }}>
                <p style={{ color: 'var(--color-text-muted)' }}>Loading onboarding…</p>
            </div>
        );
    }

    if (profile?.engineer_profile?.admin_verification_status === 'pending') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(160deg, var(--color-surface), var(--color-sky))' }}>
                <Shield className="mb-4" size={40} color="var(--color-brand)" />
                <h1 className="font-heading text-2xl font-extrabold mb-2" style={{ color: 'var(--color-text-primary)' }}>Verification in progress</h1>
                <p className="text-center max-w-md mb-6" style={{ color: 'var(--color-text-muted)' }}>
                    Thanks for submitting your profile. Our team is reviewing your documents and work email. You will unlock referrals once approved.
                </p>
                <button type="button" className="auth-btn" onClick={() => router.push('/engineer/dashboard')}>Go to dashboard</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-10" style={{ background: 'linear-gradient(165deg, var(--color-surface) 0%, var(--color-sky) 45%, var(--color-periwinkle) 100%)' }}>
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-brand-dark)' }}>Engineer onboarding</p>
                        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Build your trusted referrer profile</h1>
                        <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
                            Earn ₹10,000–₹50,000/month by referring candidates and conducting mock interviews.
                        </p>
                    </div>
                    <div className="rounded-2xl px-4 py-3 border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Trust score</div>
                        <div className="text-2xl font-extrabold" style={{ color: 'var(--color-brand-dark)', fontFamily: 'var(--font-heading)' }}>{trustScore}</div>
                        <div className="text-xs mt-1" style={{ color: 'var(--color-text-soft)' }}>{completion}% profile data</div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                        <span>Step {step + 1} of {STEPS.length}</span>
                        <span>{STEPS[step]}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-border-light)' }}>
                        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, var(--color-brand-dark), var(--color-brand))' }} />
                    </div>
                </div>

                <div className="auth-card p-6 sm:p-8 mb-6">
                    {error && <div className="auth-error mb-4">{error}</div>}

                    {step === 0 && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full name</label>
                                <input className="auth-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Account email</label>
                                <input className="auth-input opacity-70" readOnly value={profile?.email ?? ''} />
                                <p className="text-xs mt-1" style={{ color: 'var(--color-text-soft)' }}>Must be verified with OTP below.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Email OTP</label>
                                    <input className="auth-input" value={accountEmailOtp} onChange={(e) => setAccountEmailOtp(e.target.value)} placeholder="6-digit code" />
                                </div>
                                <button type="button" className="px-4 py-2 rounded-lg text-sm font-semibold h-[42px] bg-white" style={{ border: '1px solid var(--color-border)' }} onClick={async () => {
                                    setError(null);
                                    try {
                                        await api.post('/api/engineers/onboarding/otp/account-email/send');
                                        setError('OTP sent to your email.');
                                    } catch (e: any) { setError(e.response?.data?.error ?? 'Send failed'); }
                                }}>Send OTP</button>
                                <button type="button" className="auth-btn px-4 py-2 rounded-lg text-sm font-semibold h-[42px]" onClick={async () => {
                                    setError(null);
                                    try { await api.post('/api/engineers/onboarding/otp/account-email/verify', { code: accountEmailOtp }); setPrimaryEmailVerified(true); setError('Email OTP verified.'); } catch (e: any) { setError(e.response?.data?.error ?? 'Invalid OTP'); }
                                }}>Verify</button>
                            </div>
                            {primaryEmailVerified && <p className="text-xs font-semibold text-green-700 flex items-center gap-1"><Check size={14} /> Account email verified</p>}

                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input className="auth-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Phone OTP</label>
                                    <input className="auth-input" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} placeholder="6-digit code" />
                                </div>
                                <button type="button" className="px-4 py-2 rounded-lg text-sm font-semibold h-[42px] bg-white" style={{ border: '1px solid var(--color-border)' }} onClick={async () => {
                                    setError(null);
                                    try {
                                        await api.patch('/api/engineers/onboarding', { full_name: fullName.trim(), phone: phone.trim(), step: 0 });
                                        await api.post('/api/engineers/onboarding/otp/phone/send');
                                        setError('OTP sent (check server logs if SMS is not configured).');
                                    } catch (e: any) { setError(e.response?.data?.error ?? 'Send failed'); }
                                }}>Send OTP</button>
                                <button type="button" className="auth-btn px-4 py-2 rounded-lg text-sm font-semibold h-[42px]" onClick={async () => {
                                    setError(null);
                                    try { await api.post('/api/engineers/onboarding/otp/phone/verify', { code: phoneOtp }); setPhoneVerified(true); setError('Phone verified.'); } catch (e: any) { setError(e.response?.data?.error ?? 'Invalid OTP'); }
                                }}>Verify</button>
                            </div>
                            {phoneVerified && <p className="text-xs font-semibold text-green-700 flex items-center gap-1"><Check size={14} /> Phone verified</p>}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Current company</label>
                                <input className="auth-input" value={company} onChange={(e) => setCompany(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Job title</label>
                                <input className="auth-input" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Years of experience</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {EXPERIENCE_BANDS.map((b) => (
                                        <button key={b.value} type="button" onClick={() => setExperienceBand(b.value)} className="py-2 px-3 rounded-xl text-sm font-semibold border" style={{
                                            borderColor: experienceBand === b.value ? 'var(--color-brand)' : 'var(--color-border)',
                                            background: experienceBand === b.value ? 'var(--color-sky)' : 'var(--color-surface)',
                                        }}>{b.label}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Tech stack</label>
                                <div className="flex flex-wrap gap-2">
                                    {TECH_STACK.map((s) => (
                                        <button key={s} type="button" onClick={() => toggleSkill(s)} className="px-3 py-1.5 rounded-full text-xs font-semibold border" style={{
                                            borderColor: skills.includes(s) ? 'var(--color-brand)' : 'var(--color-border-light)',
                                            background: skills.includes(s) ? 'var(--color-brand)' : 'var(--color-surface)',
                                            color: skills.includes(s) ? '#fff' : 'var(--color-text-secondary)',
                                        }}>{s}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <input className="auth-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">LinkedIn profile URL</label>
                                <input className="auth-input" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://www.linkedin.com/in/..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Company email</label>
                                <input className="auth-input" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
                                <p className="text-xs mt-1" style={{ color: 'var(--color-text-soft)' }}>Use your work email; domain should align with your company name.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Company email OTP</label>
                                    <input className="auth-input" value={companyEmailOtp} onChange={(e) => setCompanyEmailOtp(e.target.value)} />
                                </div>
                                <button type="button" className="px-4 py-2 rounded-lg text-sm font-semibold h-[42px] bg-white" style={{ border: '1px solid var(--color-border)' }} onClick={async () => {
                                    setError(null);
                                    try {
                                        await api.patch('/api/engineers/onboarding', {
                                            linkedin: linkedin.trim(),
                                            company_email: companyEmail.trim(),
                                            step: 2,
                                        });
                                        await api.post('/api/engineers/onboarding/otp/company-email/send');
                                        setError('OTP sent to company email.');
                                    } catch (e: any) { setError(e.response?.data?.error ?? 'Send failed'); }
                                }}>Send OTP</button>
                                <button type="button" className="auth-btn px-4 py-2 rounded-lg text-sm font-semibold h-[42px]" onClick={async () => {
                                    setError(null);
                                    try { await api.post('/api/engineers/onboarding/otp/company-email/verify', { code: companyEmailOtp }); setCompanyEmailVerified(true); setError('Company email verified.'); } catch (e: any) { setError(e.response?.data?.error ?? 'Invalid OTP'); }
                                }}>Verify</button>
                            </div>
                            {companyEmailVerified && <p className="text-xs font-semibold text-green-700 flex items-center gap-1"><Check size={14} /> Company email verified</p>}

                            <div>
                                <label className="block text-sm font-medium mb-1">Proof (offer letter / ID) — optional</label>
                                <input type="file" className="text-sm" onChange={async (e) => {
                                    const f = e.target.files?.[0];
                                    if (!f) return;
                                    const fd = new FormData();
                                    fd.append('proof', f);
                                    try {
                                        await api.post('/api/engineers/onboarding/proof', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                                        setError('Proof uploaded.');
                                    } catch (err: any) {
                                        setError(err.response?.data?.error ?? 'Upload failed');
                                    }
                                }} />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium">Can you refer inside your company?</span>
                                <button type="button" className={`px-3 py-1 rounded-lg text-sm font-semibold ${canRefer ? 'bg-[var(--color-brand)] text-white' : 'border'}`} onClick={() => setCanRefer(true)}>Yes</button>
                                <button type="button" className={`px-3 py-1 rounded-lg text-sm font-semibold ${!canRefer ? 'bg-[var(--color-brand)] text-white' : 'border'}`} onClick={() => setCanRefer(false)}>No</button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Companies you can refer to (comma-separated)</label>
                                <textarea className="auth-input min-h-[90px]" value={referralCompaniesText} onChange={(e) => setReferralCompaniesText(e.target.value)} placeholder="Acme Corp, Contoso…" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Max referrals / month</label>
                                <input type="number" className="auth-input" min={0} max={100} value={maxReferrals} onChange={(e) => setMaxReferrals(Number(e.target.value))} />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-sm font-medium">Conduct mock interviews?</span>
                                <button type="button" className={`px-3 py-1 rounded-lg text-sm font-semibold ${canInterview ? 'bg-[var(--color-brand)] text-white' : 'border'}`} onClick={() => setCanInterview(true)}>Yes</button>
                                <button type="button" className={`px-3 py-1 rounded-lg text-sm font-semibold ${!canInterview ? 'bg-[var(--color-brand)] text-white' : 'border'}`} onClick={() => setCanInterview(false)}>No</button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Interview types</label>
                                <div className="flex flex-wrap gap-2">
                                    {INTERVIEW_TYPES.map((t) => (
                                        <button key={t} type="button" onClick={() => toggleInterviewType(t)} className="px-3 py-1.5 rounded-full text-xs font-semibold border" style={{
                                            borderColor: interviewTypes.includes(t) ? 'var(--color-brand)' : 'var(--color-border-light)',
                                            background: interviewTypes.includes(t) ? 'var(--color-brand)' : 'var(--color-surface)',
                                            color: interviewTypes.includes(t) ? '#fff' : 'var(--color-text-secondary)',
                                        }}>{t}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Interview experience</label>
                                <textarea className="auth-input min-h-[100px]" value={interviewNotes} onChange={(e) => setInterviewNotes(e.target.value)} />
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Available hours / week</label>
                                <input type="number" className="auth-input" min={0} max={80} value={hoursPerWeek} onChange={(e) => setHoursPerWeek(Number(e.target.value))} />
                            </div>
                            <div className="grid sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Preferred day</label>
                                    <input className="auth-input" value={slotDay} onChange={(e) => setSlotDay(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start</label>
                                    <input type="time" className="auth-input" value={slotStart} onChange={(e) => setSlotStart(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">End</label>
                                    <input type="time" className="auth-input" value={slotEnd} onChange={(e) => setSlotEnd(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 6 && (
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2">
                                {(['UPI', 'bank_transfer'] as const).map((m) => (
                                    <button key={m} type="button" onClick={() => setPaymentMethod(m)} className="flex-1 py-2 rounded-xl text-sm font-semibold border" style={{
                                        borderColor: paymentMethod === m ? 'var(--color-brand)' : 'var(--color-border)',
                                        background: paymentMethod === m ? 'var(--color-sky)' : 'var(--color-surface)',
                                    }}>{m === 'UPI' ? 'UPI' : 'Bank transfer'}</button>
                                ))}
                            </div>
                            {paymentMethod === 'UPI' ? (
                                <div>
                                    <label className="block text-sm font-medium mb-1">UPI ID</label>
                                    <input className="auth-input" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    <input className="auth-input" placeholder="Account holder" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} />
                                    <input className="auth-input" placeholder="Bank name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                                    <input className="auth-input" placeholder="Account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                                    <input className="auth-input" placeholder="IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
                                </div>
                            )}
                            <p className="text-xs" style={{ color: 'var(--color-text-soft)' }}>Payment details are encrypted at rest (AES-256-GCM).</p>
                        </div>
                    )}

                    {step === 7 && (
                        <div className="flex flex-col gap-4">
                            <label className="flex items-start gap-2 text-sm">
                                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1" />
                                <span>I accept the Terms &amp; Conditions.</span>
                            </label>
                            <label className="flex items-start gap-2 text-sm">
                                <input type="checkbox" checked={policy} onChange={(e) => setPolicy(e.target.checked)} className="mt-1" />
                                <span>I accept the Referral Policy.</span>
                            </label>
                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                Submitting sends your profile to the admin verification queue. Referrals unlock after approval.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                    <button type="button" className="text-sm font-semibold px-3 py-2" style={{ color: 'var(--color-text-muted)' }} onClick={() => logout()}>Sign out</button>
                    <div className="flex gap-2 justify-end">
                        {step > 0 && (
                            <button type="button" className="px-4 py-2 rounded-xl flex items-center gap-1 border bg-white" style={{ borderColor: 'var(--color-border)' }} onClick={goBack} disabled={saving}>
                                <ChevronLeft size={16} /> Back
                            </button>
                        )}
                        {step < 7 && (
                            <button type="button" className="auth-btn px-5 py-2 rounded-xl flex items-center gap-1 justify-center" onClick={goNext} disabled={saving}>
                                {saving ? 'Saving…' : <>Next <ChevronRight size={16} /></>}
                            </button>
                        )}
                        {step === 7 && (
                            <button type="button" className="auth-btn px-5 py-2 rounded-xl" onClick={submitForReview} disabled={saving}>
                                {saving ? 'Submitting…' : 'Submit for verification'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
