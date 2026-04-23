'use client';

import { RoleRoute } from '@/context/AuthContext';
import CandidateDashboard from '@/views/candidate/dashboard';

export default function Page() {
    return (
        <RoleRoute roles={['candidate']}>
            <CandidateDashboard />
        </RoleRoute>
    );
}
