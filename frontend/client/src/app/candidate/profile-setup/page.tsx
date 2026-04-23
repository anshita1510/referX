'use client';

import { RoleRoute } from '@/context/AuthContext';
import ProfileSetup from '@/views/candidate/ProfileSetup';

export default function Page() {
    return (
        <RoleRoute roles={['candidate']}>
            <ProfileSetup />
        </RoleRoute>
    );
}
