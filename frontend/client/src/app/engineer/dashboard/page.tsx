'use client';

import { RoleRoute } from '@/context/AuthContext';
import EngineerDashboard from '@/views/engineer/Dashboard';

export default function Page() {
    return (
        <RoleRoute roles={['engineer']}>
            <EngineerDashboard />
        </RoleRoute>
    );
}
