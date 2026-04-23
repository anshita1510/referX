import type { EngineerProfile, User } from '@prisma/client';

export type EngineerProfileWithFlags = Pick<
    EngineerProfile,
    'verified' | 'onboarding_wizard_completed' | 'admin_verification_status' | 'can_mock_interviews'
>;

export function engineerCanRefer(profile: EngineerProfileWithFlags | null | undefined): boolean {
    return !!profile?.verified && profile.admin_verification_status === 'approved';
}

export function engineerLimitedCandidateView(profile: EngineerProfileWithFlags | null | undefined): boolean {
    return !engineerCanRefer(profile);
}

export function engineerCanConductInterviews(profile: EngineerProfileWithFlags | null | undefined): boolean {
    return !!profile?.verified && profile.admin_verification_status === 'approved' && profile.can_mock_interviews;
}

export function needsOnboardingWizard(profile: EngineerProfileWithFlags | null | undefined): boolean {
    return !profile?.onboarding_wizard_completed;
}
