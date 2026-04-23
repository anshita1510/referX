'use client';

import { RoleRoute } from '@/context/AuthContext';
import PostJob from '@/views/company/PostJob';

export default function Page() {
    return (
        <RoleRoute roles={['company']}>
            <PostJob />
        </RoleRoute>
    );
}
