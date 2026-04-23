'use client';

import { RoleRoute } from '@/context/AuthContext';
import EngineerReferrals from '@/views/engineer/Referrals';

export default function Page() {
    return (
        <RoleRoute roles={['engineer']}>
            <EngineerReferrals />
        </RoleRoute>
    );
}
