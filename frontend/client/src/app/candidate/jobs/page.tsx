'use client';

import { RoleRoute } from '@/context/AuthContext';
import BrowseJobs from '@/views/candidate/BrowseJobs';

export default function Page() {
    return (
        <RoleRoute roles={['candidate']}>
            <BrowseJobs />
        </RoleRoute>
    );
}
