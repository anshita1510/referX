'use client';

import { RoleRoute } from '@/context/AuthContext';
import EngineerOnboardingWizard from '@/views/engineer/EngineerOnboardingWizard';

export default function EngineerOnboardingPage() {
    return (
        <RoleRoute roles={['engineer']}>
            <EngineerOnboardingWizard />
        </RoleRoute>
    );
}
