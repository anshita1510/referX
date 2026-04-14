import { Link } from 'react-router-dom';

function calcCompletion(profile: any): { pct: number; missing: string[] } {
    const checks = [
        { key: 'name', label: 'Full name', nested: false, isArr: false },
        { key: 'bio', label: 'Bio', nested: true, isArr: false },
        { key: 'location', label: 'Location', nested: true, isArr: false },
        { key: 'skills', label: 'Skills', nested: true, isArr: true },
        { key: 'github', label: 'GitHub', nested: true, isArr: false },
        { key: 'resume_url', label: 'Resume', nested: true, isArr: false },
        { key: 'experience_level', label: 'Experience level', nested: true, isArr: false },
    ];
    const cp = profile?.candidate_profile ?? {};
    const missing: string[] = [];
    let done = 0;
    for (const c of checks) {
        const val = c.nested ? cp[c.key] : profile?.[c.key];
        const filled = c.isArr ? Array.isArray(val) && val.length > 0 : !!val;
        if (filled) done++; else missing.push(c.label);
    }
    return { pct: Math.round((done / checks.length) * 100), missing };
}

export default function ProfileBanner({ profile }: { profile: any }) {
    const { pct, missing } = calcCompletion(profile);
    if (pct >= 100) return null;

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
            padding: '14px 20px', borderRadius: 14, flexWrap: 'wrap',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
            borderLeft: '4px solid var(--color-brand)',
            boxShadow: '0 2px 12px rgba(20,154,160,0.07)',
        }}>
            <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 16 }}>⚡</span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-brand-dark)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        Complete your profile — {pct}% done
                    </span>
                </div>
                <div style={{ height: 6, background: 'var(--color-sky)', borderRadius: 99, maxWidth: 400, overflow: 'hidden' }}>
                    <div style={{
                        height: '100%', width: `${pct}%`, borderRadius: 99,
                        background: 'linear-gradient(90deg, var(--color-brand-dark), var(--color-teal-light))',
                        transition: 'width 0.6s ease',
                    }} />
                </div>
                {missing.length > 0 && (
                    <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
                        Missing: {missing.slice(0, 3).join(', ')}
                    </p>
                )}
            </div>
            <Link to="/candidate/profile-setup" style={{
                padding: '9px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: 'linear-gradient(to right, var(--color-brand-dark), var(--color-teal-light))',
                color: '#fff', textDecoration: 'none', flexShrink: 0,
                boxShadow: '0 0 16px rgba(20,154,160,0.25)',
            }}>Complete now</Link>
        </div>
    );
}
