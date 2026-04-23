'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function EngineerLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading, isEngineer, profile } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading || !isAuthenticated || !isEngineer) return;
        const ep = profile?.engineer_profile;
        const onboardingPath = '/engineer/onboarding';
        if (pathname?.startsWith(onboardingPath)) return;
        if (!profile?.engineer_profile) return;
        if (!profile.engineer_profile.onboarding_wizard_completed) {
            router.replace(onboardingPath);
        }
    }, [loading, isAuthenticated, isEngineer, profile, pathname, router]);

    return <>{children}</>;
}
