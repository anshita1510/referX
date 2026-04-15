import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Mic2, DollarSign, Building2, Menu, X, ChevronDown, UserCheck, Zap, Award, Briefcase, ArrowRight, TrendingUp, Users, CheckCircle } from 'lucide-react';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay, ease: 'easeOut' as const },
});
const stagger = (i: number) => fadeUp(i * 0.1);

const FEATURES = [
    { icon: Target, color: 'var(--color-brand-dark)', bg: 'var(--color-sky)', title: 'Real Referrals', desc: 'Get referred by actual engineers at top companies — not just algorithms or cold applications.' },
    { icon: Mic2, color: 'var(--color-brand)', bg: 'var(--color-periwinkle)', title: 'Mock Interviews', desc: 'Practice with engineers who know exactly what their company looks for in a candidate.' },
    { icon: DollarSign, color: 'var(--color-brand-dark)', bg: 'var(--color-sky)', title: 'Engineers Earn', desc: 'Refer candidates, conduct interviews, and get paid for every successful hire you enable.' },
    { icon: Building2, color: 'var(--color-brand)', bg: 'var(--color-periwinkle)', title: 'Quality Hires', desc: 'Companies get pre-screened, engineer-vouched candidates — not a flood of cold applications.' },
];

const STEPS = [
    { icon: UserCheck, title: 'Sign Up', desc: 'Create your profile as a Candidate, Engineer, or Company in under 2 minutes.' },
    { icon: Zap, title: 'Get Matched', desc: 'Browse jobs or candidates. Engineers connect with freshers who fit their company.' },
    { icon: Award, title: 'Get Referred', desc: 'Engineer reviews your profile, conducts a mock interview, and submits a referral.' },
    { icon: Briefcase, title: 'Land the Job', desc: 'Company interviews the referred candidate. Platform tracks the hire and pays rewards.' },
];

const TESTIMONIALS = [
    { initials: 'AK', name: 'Ananya K.', role: 'Software Engineer — Hired via ReferX', bg: 'var(--color-brand)', text: '"I had been applying for 6 months with zero callbacks. Within 3 weeks of joining ReferX, I had 2 interviews and landed my first job. The mock interview was a game changer."' },
    { initials: 'RS', name: 'Rahul S.', role: 'Senior Engineer — Referrer', bg: 'var(--color-teal-mid)', text: '"I referred 4 candidates last quarter and earned ₹14,000. The platform makes it super easy to find quality candidates who are actually serious about getting hired."' },
    { initials: 'PM', name: 'Priya M.', role: 'HR Lead — TechStartup', bg: 'var(--color-periwinkle)', text: '"The candidates from ReferX come pre-screened by engineers who actually work in the field. Our time-to-hire dropped by 40% compared to traditional job portals."' },
];

const FAQS = [
    { q: 'Is ReferX free for candidates?', a: 'Yes — signing up and browsing jobs is completely free for candidates. You only pay for optional services like mock interviews (₹499) or premium plans.' },
    { q: 'How do engineers earn money?', a: 'Engineers earn by conducting paid mock interviews (₹350 per session) and by referring candidates who get hired. Referral rewards are processed after the candidate joins.' },
    { q: 'What companies are available?', a: 'We are onboarding startups and mid-sized tech companies first. As we grow, we will expand to larger enterprises. Companies post jobs directly on the platform.' },
    { q: 'How is ReferX different from LinkedIn?', a: 'LinkedIn is a networking platform. ReferX is a structured referral marketplace — engineers are incentivized to refer quality candidates, and every referral is tracked with accountability.' },
    { q: 'Is my data safe on ReferX?', a: 'Yes. Contact details are hidden until a referral is accepted. All communication happens in-app. We use Database Auth and encrypted storage for all sensitive data.' },
    { q: 'Can I refer candidates outside my company?', a: "Currently, referrals are for the engineer's own company. We are building cross-company referral support for a future release." },
];

const NAV_LINKS = [
    { label: 'Why ReferX', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Browse Roles', href: '#roles' },
    { label: 'Testimonials', href: '#testimonials' },
];

const ROLES = [
    { title: 'Full Stack Developer', count: '22.3K+ Jobs' },
    { title: 'Mobile / App Developer', count: '2.7K+ Jobs' },
    { title: 'Front End Developer', count: '5.1K+ Jobs' },
    { title: 'DevOps Engineer', count: '2.8K+ Jobs' },
    { title: 'Engineering Manager', count: '1.6K+ Jobs' },
    { title: 'Technical Lead', count: '9.7K+ Jobs' },
    { title: 'Backend Developer', count: '18.4K+ Jobs' },
    { title: 'Data Engineer', count: '4.2K+ Jobs' },
];

const STATS = [
    { icon: Users, value: '12,000+', label: 'Candidates Registered' },
    { icon: CheckCircle, value: '3,400+', label: 'Successful Referrals' },
    { icon: Briefcase, value: '850+', label: 'Jobs Posted' },
    { icon: TrendingUp, value: '₹42L+', label: 'Paid to Engineers' },
];

const COMPANIES = ['Google', 'Microsoft', 'Flipkart', 'Swiggy', 'Razorpay', 'Zepto', 'PhonePe', 'Meesho'];

const ENGINEER_PERKS = [
    { icon: DollarSign, title: 'Earn per Referral', desc: 'Get paid when your referred candidate gets hired. No cap on earnings.' },
    { icon: Mic2, title: 'Paid Mock Interviews', desc: '₹350 per session. Conduct interviews on your schedule, from anywhere.' },
    { icon: Award, title: 'Build Your Brand', desc: 'Climb the leaderboard. Top referrers get featured and earn bonus rewards.' },
];

// ── Navbar ────────────────────────────────────────────────
function Navbar() {
    const [open, setOpen] = useState(false);
    return (
        <header style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--color-border-light)' }}
            className="fixed top-0 inset-x-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="ReferX" className="h-8 w-8 rounded-full object-cover" style={{ objectPosition: '50% 35%' }} />
                    <span className="font-heading text-xl font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                        Refer<span style={{ color: 'var(--color-brand)' }}>X</span>
                    </span>
                </Link>
                <nav className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(l => (
                        <a key={l.label} href={l.href}
                            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                            style={{ color: 'var(--color-text-muted)' }}
                            onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--color-brand)'; (e.target as HTMLElement).style.background = 'var(--color-sky)'; }}
                            onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--color-text-muted)'; (e.target as HTMLElement).style.background = 'transparent'; }}>
                            {l.label}
                        </a>
                    ))}
                </nav>
                <div className="hidden md:flex items-center gap-3">
                    <Link to="/login" className="px-4 py-2 text-sm font-semibold transition-colors" style={{ color: 'var(--color-brand-dark)' }}>Sign In</Link>
                    <Link to="/register" className="btn-hero !py-2 !px-5 !text-sm">Get Started</Link>
                </div>
                <button onClick={() => setOpen(o => !o)} className="md:hidden p-2 rounded-lg" style={{ color: 'var(--color-brand)' }}>
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-light)' }}
                        className="md:hidden px-6 pb-4">
                        {NAV_LINKS.map(l => (
                            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                                className="block py-3 text-sm font-medium border-b last:border-0" style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border-light)' }}>
                                {l.label}
                            </a>
                        ))}
                        <div className="flex flex-col gap-2 mt-4">
                            <Link to="/login" className="btn-hero-outline !py-2.5 text-center" onClick={() => setOpen(false)}>Sign In</Link>
                            <Link to="/register" className="btn-hero !py-2.5 text-center" onClick={() => setOpen(false)}>Get Started Free</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

// ── Hero ──────────────────────────────────────────────────
function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
            style={{ background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-sky) 40%, var(--color-periwinkle) 70%, var(--color-lavender) 100%)' }}>
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(197,186,255,0.3)' }} />
            <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(164,208,210,0.3)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(207,229,230,0.4)' }} />
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <motion.div {...fadeUp(0)}
                    className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-8"
                    style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid var(--color-periwinkle)', color: 'var(--color-brand-dark)', backdropFilter: 'blur(8px)' }}>
                    Pre-MVP · Now Onboarding Engineers
                </motion.div>
                <motion.h1 {...fadeUp(0.1)} className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6" style={{ color: 'var(--color-text-primary)' }}>
                    Not just a job portal —{' '}
                    <span style={{ color: 'var(--color-brand)' }}>real referrals, real guidance.</span>
                </motion.h1>
                <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                    ReferX connects freshers with engineers who refer them, screen them, and guide them into their first job.
                    Engineers earn. Companies hire better.
                </motion.p>
                <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                    <Link to="/register" className="btn-hero text-base">Get Started Free</Link>
                    <Link to="/login" className="btn-hero-outline text-base">Sign In</Link>
                </motion.div>
                <motion.p {...fadeUp(0.4)} className="text-sm" style={{ color: 'var(--color-text-soft)' }}>
                    Join as a Candidate, Engineer, or Company
                </motion.p>
            </div>
        </section>
    );
}

// ── Stats Bar ─────────────────────────────────────────────
function StatsBar() {
    return (
        <section style={{ background: 'var(--color-brand-dark)' }}>
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATS.map((s, i) => (
                        <motion.div key={s.label} {...stagger(i)} className="flex flex-col items-center text-center gap-1">
                            <s.icon style={{ color: 'var(--color-periwinkle)', width: 28, height: 28 }} />
                            <span className="font-heading text-2xl font-extrabold text-white mt-1">{s.value}</span>
                            <span className="text-sm" style={{ color: 'var(--color-sky)' }}>{s.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Features ──────────────────────────────────────────────
function Features() {
    return (
        <section id="features" className="py-24" style={{ background: 'var(--color-surface)' }}>
            <div className="max-w-7xl mx-auto px-6">
                <motion.h2 {...fadeUp()} className="section-title">Why ReferX?</motion.h2>
                <motion.p {...fadeUp(0.1)} className="section-sub">
                    A 3-sided marketplace built around real human referrals — not just job listings.
                </motion.p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
                    {FEATURES.map((f, i) => (
                        <motion.div key={f.title} {...stagger(i)}
                            className="rounded-2xl p-6 transition-all duration-300 group cursor-default"
                            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(20,154,160,0.15)' }}>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                                style={{ background: f.bg }}>
                                <f.icon style={{ color: f.color, width: 24, height: 24 }} />
                            </div>
                            <h3 className="font-heading font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>{f.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── How It Works ──────────────────────────────────────────
function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24" style={{ background: 'var(--color-sky)' }}>
            <div className="max-w-7xl mx-auto px-6">
                <motion.h2 {...fadeUp()} className="section-title">How It Works</motion.h2>
                <motion.p {...fadeUp(0.1)} className="section-sub">From sign-up to hired — four simple steps.</motion.p>
                <div className="relative mt-16">
                    <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5"
                        style={{ background: 'linear-gradient(90deg, var(--color-periwinkle), var(--color-brand), var(--color-periwinkle))' }} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {STEPS.map((s, i) => (
                            <motion.div key={s.title} {...stagger(i)} className="flex flex-col items-center text-center">
                                <div className="relative mb-5">
                                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, var(--color-brand), var(--color-teal-light))', boxShadow: '0 8px 24px rgba(20,154,160,0.3)' }}>
                                        <s.icon style={{ color: '#fff', width: 32, height: 32 }} />
                                    </div>
                                    <span className="absolute -top-2 -right-2 w-6 h-6 text-xs font-bold rounded-full flex items-center justify-center"
                                        style={{ background: 'var(--color-surface)', border: '2px solid var(--color-brand)', color: 'var(--color-brand-dark)' }}>
                                        {i + 1}
                                    </span>
                                </div>
                                <h3 className="font-heading font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>{s.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ── Discover Roles ────────────────────────────────────────
function DiscoverRoles() {
    return (
        <section id="roles" className="py-24" style={{ background: 'var(--color-surface)' }}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-10 items-stretch">
                    <motion.div {...fadeUp(0)}
                        className="lg:w-72 flex-shrink-0 rounded-2xl p-8 flex flex-col justify-center"
                        style={{ background: 'linear-gradient(145deg, var(--color-sky) 0%, var(--color-periwinkle) 100%)' }}>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                            style={{ background: 'var(--color-surface)' }}>
                            <Briefcase style={{ color: 'var(--color-brand)', width: 32, height: 32 }} />
                        </div>
                        <h2 className="font-heading text-2xl font-extrabold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                            Discover jobs across popular roles
                        </h2>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                            Select a role and we'll show you relevant jobs for it.
                        </p>
                        <Link to="/register"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
                            style={{ color: 'var(--color-brand-dark)' }}>
                            Browse all roles <ArrowRight size={16} />
                        </Link>
                    </motion.div>
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {ROLES.map((r, i) => (
                                <motion.div key={r.title} {...stagger(i)}>
                                    <Link to="/register"
                                        className="flex items-center justify-between px-5 py-4 rounded-xl group transition-all duration-200"
                                        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-brand)'; (e.currentTarget as HTMLElement).style.background = 'var(--color-sky)'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-light)'; (e.currentTarget as HTMLElement).style.background = 'var(--color-surface)'; }}>
                                        <div>
                                            <div className="font-heading font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{r.title}</div>
                                            <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--color-brand)' }}>
                                                {r.count} <ArrowRight size={12} />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ── Trusted Companies ─────────────────────────────────────
function TrustedCompanies() {
    return (
        <section style={{ background: 'var(--color-sky)' }} className="py-14">
            <div className="max-w-7xl mx-auto px-6">
                <motion.p {...fadeUp()} className="text-center text-sm font-semibold uppercase tracking-widest mb-8" style={{ color: 'var(--color-brand-dark)' }}>
                    Engineers from these companies are already on ReferX
                </motion.p>
                <div className="flex flex-wrap justify-center gap-4">
                    {COMPANIES.map((c, i) => (
                        <motion.div key={c} {...stagger(i)}
                            className="px-6 py-3 rounded-xl font-heading font-bold text-sm"
                            style={{ background: 'var(--color-surface)', color: 'var(--color-brand)', border: '1px solid var(--color-border)' }}>
                            {c}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── For Engineers Spotlight ───────────────────────────────
function EngineerSpotlight() {
    return (
        <section className="py-24" style={{ background: 'var(--color-surface)' }}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <motion.div {...fadeUp(0)} className="flex-1">
                        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                            style={{ background: 'var(--color-sky)', color: 'var(--color-brand-dark)' }}>
                            For Engineers
                        </span>
                        <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                            Turn your network into income
                        </h2>
                        <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--color-text-muted)' }}>
                            You already know great candidates. ReferX gives you a structured way to refer them, conduct mock interviews, and get rewarded — all without leaving the platform.
                        </p>
                        <Link to="/register?role=engineer" className="btn-hero inline-flex">Start Earning →</Link>
                    </motion.div>
                    <div className="flex-1 grid grid-cols-1 gap-4">
                        {ENGINEER_PERKS.map((p, i) => (
                            <motion.div key={p.title} {...stagger(i)}
                                className="flex gap-4 items-start p-5 rounded-2xl"
                                style={{ background: 'var(--color-sky)', border: '1px solid var(--color-border)' }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'var(--color-periwinkle)' }}>
                                    <p.icon style={{ color: 'var(--color-brand-dark)', width: 20, height: 20 }} />
                                </div>
                                <div>
                                    <h4 className="font-heading font-bold text-sm mb-1" style={{ color: 'var(--color-text-primary)' }}>{p.title}</h4>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{p.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ── Testimonials ──────────────────────────────────────────
function Testimonials() {
    return (
        <section id="testimonials" className="py-24" style={{ background: 'var(--color-sky)' }}>
            <div className="max-w-7xl mx-auto px-6">
                <motion.h2 {...fadeUp()} className="section-title">What People Are Saying</motion.h2>
                <motion.p {...fadeUp(0.1)} className="section-sub">Real stories from candidates, engineers, and companies.</motion.p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div key={t.name} {...stagger(i)}
                            className="rounded-2xl p-7 flex flex-col gap-4 transition-all duration-300"
                            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(20,154,160,0.2)' }}>
                            <div className="flex gap-1">
                                {Array(5).fill(0).map((_, j) => <span key={j} className="text-amber-400 text-lg">★</span>)}
                            </div>
                            <p className="text-sm leading-relaxed flex-1 italic" style={{ color: 'var(--color-text-muted)' }}>{t.text}</p>
                            <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid var(--color-border-light)' }}>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                    style={{ background: t.bg }}>
                                    {t.initials}
                                </div>
                                <div>
                                    <div className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{t.name}</div>
                                    <div className="text-xs" style={{ color: 'var(--color-text-soft)' }}>{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── FAQ ───────────────────────────────────────────────────
function FAQ() {
    const [open, setOpen] = useState<number | null>(null);
    return (
        <section id="faq" className="py-24" style={{ background: 'var(--color-surface)' }}>
            <div className="max-w-3xl mx-auto px-6">
                <motion.h2 {...fadeUp()} className="section-title">Frequently Asked Questions</motion.h2>
                <motion.p {...fadeUp(0.1)} className="section-sub mb-12">Everything you need to know about ReferX.</motion.p>
                <div className="flex flex-col gap-3">
                    {FAQS.map((faq, i) => (
                        <motion.div key={i} {...stagger(i)} className="rounded-2xl overflow-hidden"
                            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                            <button onClick={() => setOpen(open === i ? null : i)}
                                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                                <span className="font-heading font-semibold text-base" style={{ color: 'var(--color-text-primary)' }}>{faq.q}</span>
                                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDown style={{ color: 'var(--color-brand)', width: 20, height: 20, flexShrink: 0 }} />
                                </motion.div>
                            </button>
                            <AnimatePresence initial={false}>
                                {open === i && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
                                        <p className="px-6 pb-5 text-sm leading-relaxed pt-4" style={{ color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-light)' }}>
                                            {faq.a}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── CTA Banner ────────────────────────────────────────────
function CTABanner() {
    return (
        <section className="py-28 px-6" style={{ background: 'var(--color-sky)' }}>
            <motion.div {...fadeUp()} className="max-w-2xl mx-auto rounded-3xl p-14 text-center"
                style={{ background: 'linear-gradient(135deg, var(--color-brand-dark) 0%, var(--color-brand) 55%, var(--color-teal-mid) 100%)', boxShadow: '0 20px 50px rgba(20,154,160,0.2)' }}>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white mb-4">
                    Ready to get your first referral?
                </h2>
                <p className="text-base mb-10 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    Join thousands of candidates, engineers, and companies already on the platform. It's free to get started.
                </p>
                <Link to="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 font-bold text-base rounded-xl transition-all duration-200 active:scale-95"
                    style={{ background: 'var(--color-surface)', color: 'var(--color-brand-dark)', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                    Get Started Free →
                </Link>
            </motion.div>
        </section>
    );
}

// ── Footer ────────────────────────────────────────────────
function Footer() {
    const FOOTER_COLS = [
        {
            title: 'For Candidates',
            links: [
                { label: 'Browse Jobs', to: '/register' },
                { label: 'Request a Referral', to: '/register' },
                { label: 'Book Mock Interview', to: '/register' },
                { label: 'Track Applications', to: '/register' },
                { label: 'Upload Resume', to: '/register' },
                { label: 'Career Resources', to: '/register' },
            ],
        },
        {
            title: 'For Engineers',
            links: [
                { label: 'Refer Candidates', to: '/register' },
                { label: 'Conduct Interviews', to: '/register' },
                { label: 'View Earnings', to: '/register' },
                { label: 'Leaderboard', to: '/register' },
                { label: 'Referral History', to: '/register' },
                { label: 'Payout Settings', to: '/register' },
            ],
        },
        {
            title: 'For Companies',
            links: [
                { label: 'Post a Job', to: '/register' },
                { label: 'Browse Candidates', to: '/register' },
                { label: 'Hiring Dashboard', to: '/register' },
                { label: 'Pricing Plans', to: '/register' },
                { label: 'Bulk Hiring', to: '/register' },
                { label: 'Partner with Us', to: '/register' },
            ],
        },
        {
            title: 'Company',
            links: [
                { label: 'About Us', to: '/register' },
                { label: 'Blog', to: '/register' },
                { label: 'Careers', to: '/register' },
                { label: 'Press Kit', to: '/register' },
                { label: 'Contact Us', to: '/register' },
                { label: 'Sitemap', to: '/register' },
            ],
        },
        {
            title: 'Legal',
            links: [
                { label: 'Privacy Policy', to: '/register' },
                { label: 'Terms of Service', to: '/register' },
                { label: 'Cookie Policy', to: '/register' },
                { label: 'Refund Policy', to: '/register' },
                { label: 'Security', to: '/register' },
            ],
        },
    ];

    return (
        <footer style={{ background: '#FFFFFF' }}>
            {/* Top band */}
            <div style={{ background: 'var(--color-sky)', borderBottom: '1px solid var(--color-border)' }}>
                <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="font-heading font-bold text-lg mb-1" style={{ color: 'var(--color-text-primary)' }}>Stay in the loop</p>
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Get updates on new jobs, engineer spotlights, and platform news.</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 md:w-64 px-4 py-2.5 rounded-xl text-sm outline-none"
                            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                        />
                        <button className="btn-hero !py-2.5 !px-5 !text-sm whitespace-nowrap">Subscribe</button>
                    </div>
                </div>
            </div>

            {/* Main grid */}
            <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 mb-14">
                    {/* Brand col */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-3">
                            <img src="/logo.png" alt="ReferX" className="h-9 w-9 rounded-full object-cover" style={{ objectPosition: '50% 35%' }} />
                            <span className="font-heading text-2xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
                                Refer<span style={{ color: 'var(--color-brand)' }}>X</span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-text-muted)' }}>
                            Not just a job portal — real referrals, real guidance. Connecting freshers with engineers who care.
                        </p>
                        <div className="flex gap-3">
                            {['in', 'tw', 'gh', 'yt'].map(s => (
                                <a key={s} href="#"
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors"
                                    style={{ background: 'var(--color-sky)', color: 'var(--color-brand-dark)', border: '1px solid var(--color-border)' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-brand)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-sky)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-brand-dark)'; }}>
                                    {s}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link cols */}
                    {FOOTER_COLS.map(col => (
                        <div key={col.title}>
                            <h4 className="font-heading font-semibold text-xs mb-5 uppercase tracking-widest" style={{ color: 'var(--color-brand-dark)' }}>
                                {col.title}
                            </h4>
                            <ul className="space-y-3">
                                {col.links.map(l => (
                                    <li key={l.label}>
                                        <Link to={l.to}
                                            className="text-sm transition-colors"
                                            style={{ color: 'var(--color-text-muted)' }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-brand)'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)'; }}>
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Stats strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 mb-8"
                    style={{ borderTop: '1px solid var(--color-border-light)', borderBottom: '1px solid var(--color-border-light)' }}>
                    {[
                        { value: '12,000+', label: 'Candidates' },
                        { value: '3,400+', label: 'Referrals Made' },
                        { value: '850+', label: 'Jobs Posted' },
                        { value: '₹42L+', label: 'Paid to Engineers' },
                    ].map(s => (
                        <div key={s.label} className="text-center">
                            <div className="font-heading text-xl font-extrabold" style={{ color: 'var(--color-brand)' }}>{s.value}</div>
                            <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs"
                    style={{ color: 'var(--color-text-soft)', borderTop: '1px solid var(--color-border-light)', paddingTop: '1.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>© {new Date().getFullYear()} ReferX Technologies Pvt. Ltd. All rights reserved.</span>
                    <div className="flex gap-4">
                        {['Privacy', 'Terms', 'Cookies'].map(l => (
                            <Link key={l} to="/register"
                                className="transition-colors"
                                style={{ color: 'var(--color-text-muted)' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-brand)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)'; }}>
                                {l}
                            </Link>
                        ))}
                    </div>
                    <span style={{ color: 'var(--color-text-muted)' }}>Made with ♥ in India</span>
                </div>
            </div>
        </footer>
    );
}

// ── Page ──────────────────────────────────────────────────
export default function Landing() {
    return (
        <div className="min-h-screen font-body">
            <Navbar />
            <Hero />
            <StatsBar />
            <Features />
            <HowItWorks />
            <DiscoverRoles />
            <TrustedCompanies />
            <EngineerSpotlight />
            <Testimonials />
            <FAQ />
            <CTABanner />
            <Footer />
        </div>
    );
}
