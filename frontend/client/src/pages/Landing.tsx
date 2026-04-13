import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Mic2, DollarSign, Building2, Menu, X, ChevronDown, UserCheck, Zap, Award, Briefcase } from 'lucide-react';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay, ease: 'easeOut' as const },
});
const stagger = (i: number) => fadeUp(i * 0.1);

const FEATURES = [
    { icon: Target, color: '#C5BAFF', bg: '#F3F0FF', title: 'Real Referrals', desc: 'Get referred by actual engineers at top companies — not just algorithms or cold applications.' },
    { icon: Mic2, color: '#8B7FD4', bg: '#EDE9FF', title: 'Mock Interviews', desc: 'Practice with engineers who know exactly what their company looks for in a candidate.' },
    { icon: DollarSign, color: '#6C5FBF', bg: '#E8F9FF', title: 'Engineers Earn', desc: 'Refer candidates, conduct interviews, and get paid for every successful hire you enable.' },
    { icon: Building2, color: '#8B7FD4', bg: '#C4D9FF33', title: 'Quality Hires', desc: 'Companies get pre-screened, engineer-vouched candidates — not a flood of cold applications.' },
];

const STEPS = [
    { icon: UserCheck, title: 'Sign Up', desc: 'Create your profile as a Candidate, Engineer, or Company in under 2 minutes.' },
    { icon: Zap, title: 'Get Matched', desc: 'Browse jobs or candidates. Engineers connect with freshers who fit their company.' },
    { icon: Award, title: 'Get Referred', desc: 'Engineer reviews your profile, conducts a mock interview, and submits a referral.' },
    { icon: Briefcase, title: 'Land the Job', desc: 'Company interviews the referred candidate. Platform tracks the hire and pays rewards.' },
];

const TESTIMONIALS = [
    { initials: 'AK', name: 'Ananya K.', role: 'Software Engineer — Hired via ReferX', bg: '#8B7FD4', text: '"I had been applying for 6 months with zero callbacks. Within 3 weeks of joining ReferX, I had 2 interviews and landed my first job. The mock interview was a game changer."' },
    { initials: 'RS', name: 'Rahul S.', role: 'Senior Engineer — Referrer', bg: '#C5BAFF', text: '"I referred 4 candidates last quarter and earned ₹14,000. The platform makes it super easy to find quality candidates who are actually serious about getting hired."' },
    { initials: 'PM', name: 'Priya M.', role: 'HR Lead — TechStartup', bg: '#C4D9FF', text: '"The candidates from ReferX come pre-screened by engineers who actually work in the field. Our time-to-hire dropped by 40% compared to traditional job portals."' },
];

const FAQS = [
    { q: 'Is ReferX free for candidates?', a: 'Yes — signing up and browsing jobs is completely free for candidates. You only pay for optional services like mock interviews (₹499) or premium plans.' },
    { q: 'How do engineers earn money?', a: 'Engineers earn by conducting paid mock interviews (₹350 per session) and by referring candidates who get hired. Referral rewards are processed after the candidate joins.' },
    { q: 'What companies are available?', a: 'We are onboarding startups and mid-sized tech companies first. As we grow, we will expand to larger enterprises. Companies post jobs directly on the platform.' },
    { q: 'How is ReferX different from LinkedIn?', a: 'LinkedIn is a networking platform. ReferX is a structured referral marketplace — engineers are incentivized to refer quality candidates, and every referral is tracked with accountability.' },
    { q: 'Is my data safe on ReferX?', a: 'Yes. Contact details are hidden until a referral is accepted. All communication happens in-app. We use Firebase Auth and encrypted storage for all sensitive data.' },
    { q: 'Can I refer candidates outside my company?', a: "Currently, referrals are for the engineer's own company. We are building cross-company referral support for a future release." },
];

const NAV_LINKS = [
    { label: 'Why ReferX', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
];

// ── Navbar ────────────────────────────────────────────────
function Navbar() {
    const [open, setOpen] = useState(false);
    return (
        <header style={{ background: 'rgba(251,251,251,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E8F9FF' }}
            className="fixed top-0 inset-x-0 z-50">
            <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
                <Link to="/" className="font-heading text-xl font-extrabold tracking-tight" style={{ color: '#1a1a2e' }}>
                    Refer<span style={{ color: '#8B7FD4' }}>X</span>
                </Link>
                <nav className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(l => (
                        <a key={l.label} href={l.href}
                            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                            style={{ color: '#4b5563' }}
                            onMouseEnter={e => { (e.target as HTMLElement).style.color = '#8B7FD4'; (e.target as HTMLElement).style.background = '#E8F9FF'; }}
                            onMouseLeave={e => { (e.target as HTMLElement).style.color = '#4b5563'; (e.target as HTMLElement).style.background = 'transparent'; }}>
                            {l.label}
                        </a>
                    ))}
                </nav>
                <div className="hidden md:flex items-center gap-3">
                    <Link to="/login" className="px-4 py-2 text-sm font-semibold transition-colors" style={{ color: '#6C5FBF' }}>Sign In</Link>
                    <Link to="/register" className="btn-hero !py-2 !px-5 !text-sm">Get Started</Link>
                </div>
                <button onClick={() => setOpen(o => !o)} className="md:hidden p-2 rounded-lg" style={{ color: '#8B7FD4' }}>
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} style={{ background: '#FBFBFB', borderTop: '1px solid #E8F9FF' }}
                        className="md:hidden px-5 pb-4">
                        {NAV_LINKS.map(l => (
                            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                                className="block py-3 text-sm font-medium border-b last:border-0" style={{ color: '#4b5563', borderColor: '#E8F9FF' }}>
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
            style={{ background: 'linear-gradient(135deg, #FBFBFB 0%, #E8F9FF 40%, #C4D9FF 70%, #C5BAFF 100%)' }}>
            {/* Blurred circles */}
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(197,186,255,0.3)' }} />
            <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(196,217,255,0.3)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(232,249,255,0.4)' }} />

            <div className="relative z-10 max-w-4xl mx-auto px-5 text-center">
                <motion.div {...fadeUp(0)}
                    className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-8"
                    style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid #C4D9FF', color: '#6C5FBF', backdropFilter: 'blur(8px)' }}>
                    🚀 Pre-MVP · Now Onboarding Engineers
                </motion.div>

                <motion.h1 {...fadeUp(0.1)} className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6" style={{ color: '#1a1a2e' }}>
                    Not just a job portal —{' '}
                    <span className="gradient-text block sm:inline">real referrals, real guidance.</span>
                </motion.h1>

                <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: '#4b5563' }}>
                    ReferX connects freshers with engineers who refer them, screen them, and guide them into their first job.
                    Engineers earn. Companies hire better.
                </motion.p>

                <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                    <Link to="/register" className="btn-hero text-base">Get Started Free</Link>
                    <Link to="/login" className="btn-hero-outline text-base">Sign In</Link>
                </motion.div>

                <motion.p {...fadeUp(0.4)} className="text-sm" style={{ color: '#9ca3af' }}>
                    Join as a Candidate, Engineer, or Company
                </motion.p>
            </div>
        </section>
    );
}

// ── Features ──────────────────────────────────────────────
function Features() {
    return (
        <section id="features" className="py-24" style={{ background: '#FBFBFB' }}>
            <div className="max-w-6xl mx-auto px-5">
                <motion.h2 {...fadeUp()} className="section-title">Why ReferX?</motion.h2>
                <motion.p {...fadeUp(0.1)} className="section-sub">
                    A 3-sided marketplace built around real human referrals — not just job listings.
                </motion.p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
                    {FEATURES.map((f, i) => (
                        <motion.div key={f.title} {...stagger(i)}
                            className="rounded-2xl p-6 transition-all duration-300 group cursor-default"
                            style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid #C4D9FF', backdropFilter: 'blur(8px)' }}
                            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(139,127,212,0.15)' }}>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                                style={{ background: f.bg }}>
                                <f.icon style={{ color: f.color, width: 24, height: 24 }} />
                            </div>
                            <h3 className="font-heading font-bold text-lg mb-2" style={{ color: '#1a1a2e' }}>{f.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{f.desc}</p>
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
        <section id="how-it-works" className="py-24" style={{ background: '#E8F9FF' }}>
            <div className="max-w-6xl mx-auto px-5">
                <motion.h2 {...fadeUp()} className="section-title">How It Works</motion.h2>
                <motion.p {...fadeUp(0.1)} className="section-sub">From sign-up to hired — four simple steps.</motion.p>
                <div className="relative mt-16">
                    <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5"
                        style={{ background: 'linear-gradient(90deg, #C4D9FF, #C5BAFF, #C4D9FF)' }} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {STEPS.map((s, i) => (
                            <motion.div key={s.title} {...stagger(i)} className="flex flex-col items-center text-center">
                                <div className="relative mb-5">
                                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #8B7FD4, #C5BAFF)', boxShadow: '0 8px 24px rgba(139,127,212,0.3)' }}>
                                        <s.icon style={{ color: '#fff', width: 32, height: 32 }} />
                                    </div>
                                    <span className="absolute -top-2 -right-2 w-6 h-6 text-xs font-bold rounded-full flex items-center justify-center"
                                        style={{ background: '#fff', border: '2px solid #8B7FD4', color: '#6C5FBF' }}>
                                        {i + 1}
                                    </span>
                                </div>
                                <h3 className="font-heading font-bold text-lg mb-2" style={{ color: '#1a1a2e' }}>{s.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{s.desc}</p>
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
        <section id="testimonials" className="py-24" style={{ background: '#FBFBFB' }}>
            <div className="max-w-6xl mx-auto px-5">
                <motion.h2 {...fadeUp()} className="section-title">What People Are Saying</motion.h2>
                <motion.p {...fadeUp(0.1)} className="section-sub">Real stories from candidates, engineers, and companies.</motion.p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div key={t.name} {...stagger(i)}
                            className="rounded-2xl p-7 flex flex-col gap-4 transition-all duration-300"
                            style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid #C4D9FF', backdropFilter: 'blur(8px)' }}
                            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(196,217,255,0.4)' }}>
                            <div className="flex gap-1">
                                {Array(5).fill(0).map((_, j) => <span key={j} className="text-amber-400 text-lg">★</span>)}
                            </div>
                            <p className="text-sm leading-relaxed flex-1 italic" style={{ color: '#4b5563' }}>{t.text}</p>
                            <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid #E8F9FF' }}>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                    style={{ background: t.bg }}>
                                    {t.initials}
                                </div>
                                <div>
                                    <div className="font-semibold text-sm" style={{ color: '#1a1a2e' }}>{t.name}</div>
                                    <div className="text-xs" style={{ color: '#9ca3af' }}>{t.role}</div>
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
        <section id="faq" className="py-24" style={{ background: '#C4D9FF22' }}>
            <div className="max-w-3xl mx-auto px-5">
                <motion.h2 {...fadeUp()} className="section-title">Frequently Asked Questions</motion.h2>
                <motion.p {...fadeUp(0.1)} className="section-sub mb-12">Everything you need to know about ReferX.</motion.p>
                <div className="flex flex-col gap-3">
                    {FAQS.map((faq, i) => (
                        <motion.div key={i} {...stagger(i)} className="rounded-2xl overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid #C4D9FF', backdropFilter: 'blur(8px)' }}>
                            <button onClick={() => setOpen(open === i ? null : i)}
                                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                                <span className="font-heading font-semibold text-base" style={{ color: '#1a1a2e' }}>{faq.q}</span>
                                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDown style={{ color: '#8B7FD4', width: 20, height: 20, flexShrink: 0 }} />
                                </motion.div>
                            </button>
                            <AnimatePresence initial={false}>
                                {open === i && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
                                        <p className="px-6 pb-5 text-sm leading-relaxed pt-4" style={{ color: '#6b7280', borderTop: '1px solid #E8F9FF' }}>
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
        <section className="py-20 px-5">
            <div className="max-w-4xl mx-auto">
                <motion.div {...fadeUp()} className="rounded-3xl p-12 text-center"
                    style={{ background: 'linear-gradient(135deg, #8B7FD4 0%, #C5BAFF 60%, #C4D9FF 100%)', boxShadow: '0 24px 60px rgba(139,127,212,0.25)' }}>
                    <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white mb-4">
                        Ready to get your first referral?
                    </h2>
                    <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        Join thousands of candidates, engineers, and companies already on the platform. It's free to get started.
                    </p>
                    <Link to="/register"
                        className="inline-flex items-center gap-2 px-8 py-4 font-bold text-base rounded-xl transition-all duration-200 active:scale-95"
                        style={{ background: '#FBFBFB', color: '#6C5FBF', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                        Get Started Free →
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

// ── Footer ────────────────────────────────────────────────
function Footer() {
    return (
        <footer className="pt-16 pb-8" style={{ background: '#1a1a2e', color: '#9ca3af' }}>
            <div className="max-w-6xl mx-auto px-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    <div>
                        <div className="font-heading text-xl font-extrabold text-white mb-3">
                            Refer<span style={{ color: '#C5BAFF' }}>X</span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
                            Not just a job portal — real referrals, real guidance. Connecting freshers with engineers who care.
                        </p>
                    </div>
                    {[
                        { title: 'For Candidates', links: ['Browse Jobs', 'Request Referral', 'Book Mock Interview', 'Track Applications'] },
                        { title: 'For Engineers', links: ['Refer Candidates', 'Conduct Interviews', 'View Earnings', 'Leaderboard'] },
                        { title: 'Company', links: ['About Us', 'Post a Job', 'Pricing', 'Contact'] },
                    ].map(col => (
                        <div key={col.title}>
                            <h4 className="font-heading font-semibold text-white text-sm mb-4 uppercase tracking-wider">{col.title}</h4>
                            <ul className="space-y-2 text-sm">
                                {col.links.map(l => (
                                    <li key={l}>
                                        <Link to="/register" className="transition-colors hover:text-white">{l}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs"
                    style={{ borderTop: '1px solid #2d2d4e', color: '#4b5563' }}>
                    <span>© {new Date().getFullYear()} ReferX. All rights reserved.</span>
                    <span>Not just a job portal.</span>
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
            <Features />
            <HowItWorks />
            <Testimonials />
            <FAQ />
            <CTABanner />
            <Footer />
        </div>
    );
}
