'use client';

import { RoleRoute } from '@/context/AuthContext';
import MyReferrals from '@/views/candidate/MyReferrals';

export default function Page() {
    return (
        <RoleRoute roles={['candidate']}>
            <MyReferrals />
        </RoleRoute>
    );
}
