import type { EngineerProfile } from '@prisma/client';

export function computeBadges(profile: Pick<EngineerProfile, 'verified' | 'successful_hires_count' | 'interviews_completed_count'>): string[] {
    const badges: string[] = [];
    if (profile.verified) badges.push('verified_engineer');
    if ((profile.successful_hires_count ?? 0) >= 3) badges.push('top_referrer');
    if ((profile.interviews_completed_count ?? 0) >= 5) badges.push('active_mentor');
    return badges;
}
