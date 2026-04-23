'use client';

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Plus, Upload, CheckCircle, Globe, FileText, User, Briefcase, ChevronRight } from 'lucide-react';
import api from '../../api/axiosClient';

const STEPS = [
    { id: 1, label: 'Skills & Background', icon: Briefcase },
    { id: 2, label: 'Portfolio Proof', icon: Globe },
    { id: 3, label: 'Documents', icon: FileText },
];

const SKILL_SUGGESTIONS = [
    'React', 'Node.js', 'Python', 'TypeScript', 'JavaScript', 'SQL',
    'Java', 'Go', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL', 'Next.js',
    'Vue.js', 'GraphQL', 'Redis', 'Kubernetes', 'Flutter', 'Swift', 'Kotlin',
];

export default function ProfileSetup() {
    const { profile, getToken } = useAuth();
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);

    const [step, setStep] = useState(1);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    // Step 1
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState('');
    const [experience, setExperience] = useState('fresher');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');

    // Step 2
    const [github, setGithub] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [projects, setProjects] = useState([{ title: '', description: '' }]);

    // Step 3
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const addSkill = (s: string) => {
        const trimmed = s.trim();
        if (trimmed && !skills.includes(trimmed)) setSkills(prev => [...prev, trimmed]);
        setSkillInput('');
    };

    const removeSkill = (s: string) => setSkills(prev => prev.filter(x => x !== s));

    const updateProject = (i: number, field: 'title' | 'description', val: string) => {
        setProjects(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
    };

    const addProject = () => setProjects(prev => [...prev, { title: '', description: '' }]);
    const removeProject = (i: number) => setProjects(prev => prev.filter((_, idx) => idx !== i));

    const handleNext = () => {
        setError('');
        if (step === 1) {
            if (skills.length === 0) { setError('Add at least one skill.'); return; }
            if (!location.trim()) { setError('Location is required.'); return; }
        }
        if (step === 2) {
            if (!github.trim()) { setError('GitHub URL is required.'); return; }
        }
        setStep(s => s + 1);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!resumeFile) { setError('Please upload your resume.'); return; }
        setBusy(true);
        setError('');
        try {
            const token = await getToken();

            // Upload resume
            setUploading(true);
            const formData = new FormData();
            formData.append('resume', resumeFile);
            const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/documents/upload-resume`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            setUploading(false);
            const uploadData = uploadRes.ok ? await uploadRes.json() : {};

            // Save profile
            await api.put('/api/auth/profile', {
                skills,
                experience_level: experience,
                location,
                bio,
                github,
                portfolio,
                projects,
                resume_url: uploadData.url ?? null,
            });

            router.push('/candidate/dashboard');
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="auth-page items-start justify-center px-4 py-12 min-h-screen">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <img src="/logo.png" alt="ReferX" className="h-9 w-9 rounded-full object-cover" style={{ objectPosition: '50% 35%' }} />
                    <span className="font-heading text-xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
                        Refer<span style={{ color: 'var(--color-brand)' }}>X</span>
                    </span>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2 mb-8">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-2 flex-1">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all"
                                    style={{
                                        background: step > s.id ? 'var(--color-brand)' : step === s.id ? 'var(--color-brand)' : 'var(--color-sky)',
                                        color: step >= s.id ? '#fff' : 'var(--color-text-muted)',
                                    }}>
                                    {step > s.id ? <CheckCircle size={16} /> : s.id}
                                </div>
                                <span className="text-xs font-medium hidden sm:block"
                                    style={{ color: step >= s.id ? 'var(--color-brand)' : 'var(--color-text-soft)' }}>
                                    {s.label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className="flex-1 h-0.5 mx-2"
                                    style={{ background: step > s.id ? 'var(--color-brand)' : 'var(--color-border-light)' }} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="auth-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        {(() => { const S = STEPS[step - 1]; return <S.icon size={20} style={{ color: 'var(--color-brand)' }} />; })()}
                        <div>
                            <h2 className="font-heading text-xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
                                {STEPS[step - 1].label}
                            </h2>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                                Step {step} of {STEPS.length} — Profile setup
                            </p>
                        </div>
                    </div>

                    {error && <div className="auth-error mb-4">{error}</div>}

                    {/* ── Step 1: Skills & Background ── */}
                    {step === 1 && (
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                                    Skills <span style={{ color: 'var(--color-brand)' }}>*</span>
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {skills.map(s => (
                                        <span key={s} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium"
                                            style={{ background: 'var(--color-sky)', color: 'var(--color-brand-dark)', border: '1px solid var(--color-border)' }}>
                                            <span>{s}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(s)}
                                                className="text-xs font-semibold"
                                                style={{ color: 'var(--color-brand)' }}
                                            >
                                                Remove
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input className="auth-input flex-1" placeholder="Type a skill and press Enter"
                                        value={skillInput}
                                        onChange={e => setSkillInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }} />
                                    <button type="button" onClick={() => addSkill(skillInput)}
                                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                                        style={{ background: 'var(--color-brand)' }}>
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 10).map(s => (
                                        <button key={s} type="button" onClick={() => addSkill(s)}
                                            className="px-2.5 py-1 rounded-full text-xs transition-colors"
                                            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)', color: 'var(--color-text-muted)' }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-brand)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-brand)'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-light)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)'; }}>
                                            + {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Experience Level</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { value: 'fresher', label: 'Fresher', sub: '0 years' },
                                        { value: '1-2', label: '1–2 yrs', sub: 'Junior' },
                                        { value: '3+', label: '3+ yrs', sub: 'Mid/Senior' },
                                    ].map(opt => (
                                        <button key={opt.value} type="button" onClick={() => setExperience(opt.value)}
                                            className="py-3 px-2 rounded-xl text-center transition-all"
                                            style={{
                                                border: `1.5px solid ${experience === opt.value ? 'var(--color-brand)' : 'var(--color-border-light)'}`,
                                                background: experience === opt.value ? 'var(--color-sky)' : 'var(--color-surface)',
                                            }}>
                                            <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{opt.label}</div>
                                            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{opt.sub}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                                    Current Location <span style={{ color: 'var(--color-brand)' }}>*</span>
                                </label>
                                <input className="auth-input" placeholder="e.g. Bangalore, India"
                                    value={location} onChange={e => setLocation(e.target.value)} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                                    Bio / About Yourself
                                </label>
                                <textarea className="auth-input resize-none" rows={3}
                                    placeholder="Tell engineers a bit about yourself, your goals, and what you're looking for..."
                                    value={bio} onChange={e => setBio(e.target.value)}
                                    style={{ lineHeight: '1.6' }} />
                            </div>
                        </div>
                    )}

                    {/* ── Step 2: Portfolio Proof ── */}
                    {step === 2 && (
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                                    <span className="flex items-center gap-1.5">GitHub Profile URL <span style={{ color: 'var(--color-brand)' }}>*</span></span>
                                </label>
                                <input className="auth-input" placeholder="https://github.com/yourusername"
                                    value={github} onChange={e => setGithub(e.target.value)} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                                    <span className="flex items-center gap-1.5"><Globe size={15} /> Portfolio Website <span className="text-xs font-normal" style={{ color: 'var(--color-text-soft)' }}>(optional)</span></span>
                                </label>
                                <input className="auth-input" placeholder="https://yourportfolio.com"
                                    value={portfolio} onChange={e => setPortfolio(e.target.value)} />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Project Descriptions</label>
                                    <button type="button" onClick={addProject}
                                        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg"
                                        style={{ background: 'var(--color-sky)', color: 'var(--color-brand-dark)' }}>
                                        <Plus size={12} /> Add Project
                                    </button>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {projects.map((p, i) => (
                                        <div key={i} className="p-4 rounded-xl"
                                            style={{ background: 'var(--color-sky)', border: '1px solid var(--color-border-light)' }}>
                                            <div className="flex items-center justify-between gap-3 mb-3">
                                                <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                                    Project {i + 1}
                                                </div>
                                                {projects.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProject(i)}
                                                        className="text-xs font-semibold px-3 py-1 rounded-lg"
                                                        style={{ background: 'var(--color-surface)', color: '#b42318', border: '1px solid #f0c7c2' }}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                            <input className="auth-input mb-2" placeholder="Project title"
                                                value={p.title} onChange={e => updateProject(i, 'title', e.target.value)} />
                                            <textarea className="auth-input resize-none" rows={2}
                                                placeholder="Brief description — what it does, tech used, your role..."
                                                value={p.description} onChange={e => updateProject(i, 'description', e.target.value)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Step 3: Documents ── */}
                    {step === 3 && (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                                    Resume (PDF) <span style={{ color: 'var(--color-brand)' }}>*</span>
                                </label>
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className="flex flex-col items-center justify-center gap-3 py-10 rounded-2xl cursor-pointer transition-all"
                                    style={{
                                        border: `2px dashed ${resumeFile ? 'var(--color-brand)' : 'var(--color-border)'}`,
                                        background: resumeFile ? 'var(--color-sky)' : 'var(--color-surface)',
                                    }}>
                                    {resumeFile ? (
                                        <>
                                            <CheckCircle size={32} style={{ color: 'var(--color-brand)' }} />
                                            <div className="text-sm font-semibold" style={{ color: 'var(--color-brand)' }}>{resumeFile.name}</div>
                                            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                                {(resumeFile.size / 1024).toFixed(0)} KB · Click to replace
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={32} style={{ color: 'var(--color-text-soft)' }} />
                                            <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Click to upload your resume</div>
                                            <div className="text-xs" style={{ color: 'var(--color-text-soft)' }}>PDF only · Max 5MB</div>
                                        </>
                                    )}
                                </div>
                                <input ref={fileRef} type="file" accept=".pdf" className="hidden"
                                    onChange={e => { if (e.target.files?.[0]) setResumeFile(e.target.files[0]); }} />
                            </div>

                            {/* Summary */}
                            <div className="rounded-xl p-4" style={{ background: 'var(--color-sky)', border: '1px solid var(--color-border-light)' }}>
                                <div className="flex items-center gap-2 mb-3">
                                    <User size={15} style={{ color: 'var(--color-brand)' }} />
                                    <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Profile Summary</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                    <div><span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Skills:</span> {skills.join(', ') || '—'}</div>
                                    <div><span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Experience:</span> {experience}</div>
                                    <div><span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Location:</span> {location || '—'}</div>
                                    <div><span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>GitHub:</span> {github ? '✓ Added' : '—'}</div>
                                    <div><span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Projects:</span> {projects.filter(p => p.title).length} added</div>
                                    <div><span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Portfolio:</span> {portfolio ? '✓ Added' : 'Skipped'}</div>
                                </div>
                            </div>

                            <button type="submit" disabled={busy} className="auth-btn">
                                {uploading ? 'Uploading resume…' : busy ? 'Saving profile…' : 'Complete Profile →'}
                            </button>
                        </form>
                    )}

                    {/* Navigation */}
                    {step < 3 && (
                        <div className="flex justify-between mt-8">
                            {step > 1 ? (
                                <button type="button" onClick={() => setStep(s => s - 1)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                                    style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                    ← Back
                                </button>
                            ) : <div />}
                            <button type="button" onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                                style={{ background: 'var(--color-brand)' }}>
                                Continue <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-center mt-4 text-xs" style={{ color: 'var(--color-text-soft)' }}>
                    You can update your profile anytime from your dashboard.
                </p>
            </div>
        </div>
    );
}
