'use client';

import { RoleRoute } from '@/context/AuthContext';
import Interviews from '@/views/candidate/Interviews';

export default function Page() {
    return (
        <RoleRoute roles={['candidate']}>
            <Interviews />
        </RoleRoute>
    );
}
