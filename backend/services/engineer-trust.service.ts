import type { EngineerProfile, User } from '@prisma/client';

type ProfileInput = Pick<
    EngineerProfile,
    | 'experience_band'
    | 'experience_years'
    | 'skills'
    | 'company'
    | 'linkedin'
    | 'company_email_verified'
    | 'proof_document_url'
    | 'primary_email_otp_verified'
    | 'verified'
    | 'admin_verification_status'
>;

function experienceScore(profile: ProfileInput): number {
    const band = profile.experience_band;
    if (band === '5+') return 30;
    if (band === '3-5') return 24;
    if (band === '1-3') return 18;
    if (band === '0-1') return 10;
    const y = profile.experience_years ?? 0;
    if (y >= 5) return 28;
    if (y >= 3) return 22;
    if (y >= 1) return 16;
    return 8;
}

function companyCredibilityScore(company: string | null | undefined): number {
    if (!company || company.trim().length < 2) return 4;
    const c = company.toLowerCase();
    const tier1 = ['google', 'amazon', 'microsoft', 'meta', 'apple', 'netflix', 'uber', 'stripe', 'razorpay', 'phonepe', 'swiggy', 'zepto', 'groww'];
    if (tier1.some((t) => c.includes(t))) return 20;
    if (c.length >= 3) return 14;
    return 8;
}

function skillsCompletenessScore(skills: string[]): number {
    const n = skills?.length ?? 0;
    if (n >= 6) return 20;
    if (n >= 3) return 14;
    if (n >= 1) return 8;
    return 3;
}

function verificationScore(profile: ProfileInput, phoneVerified: boolean): number {
    let s = 0;
    if (profile.linkedin && /^https?:\/\//i.test(profile.linkedin)) s += 8;
    if (profile.primary_email_otp_verified) s += 6;
    if (phoneVerified) s += 6;
    if (profile.company_email_verified) s += 6;
    if (profile.proof_document_url) s += 2;
    if (profile.verified && profile.admin_verification_status === 'approved') s += 2;
    return Math.min(30, s);
}

/** Engineer Profile Score 0–100 (experience 30%, company 20%, skills 20%, verification 30%). */
export function computeTrustScore(user: Pick<User, 'phone_verified'>, profile: ProfileInput): number {
    const score =
        experienceScore(profile) +
        companyCredibilityScore(profile.company) +
        skillsCompletenessScore(profile.skills ?? []) +
        verificationScore(profile, user.phone_verified);
    return Math.min(100, Math.round(score));
}
