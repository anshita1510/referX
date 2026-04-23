'use client';

import { RoleRoute } from '@/context/AuthContext';
import Documents from '@/views/candidate/Documents';

export default function Page() {
    return (
        <RoleRoute roles={['candidate']}>
            <Documents />
        </RoleRoute>
    );
}
