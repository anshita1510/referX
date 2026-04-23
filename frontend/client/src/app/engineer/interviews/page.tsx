'use client';

import { RoleRoute } from '@/context/AuthContext';
import EngineerInterviews from '@/views/engineer/Interviews';

export default function Page() {
    return (
        <RoleRoute roles={['engineer']}>
            <EngineerInterviews />
        </RoleRoute>
    );
}
