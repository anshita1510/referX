'use client';

import { RoleRoute } from '@/context/AuthContext';
import CompanyDashboard from '@/views/company/Dashboard';

export default function Page() {
    return (
        <RoleRoute roles={['company']}>
            <CompanyDashboard />
        </RoleRoute>
    );
}
