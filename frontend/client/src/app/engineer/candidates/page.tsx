'use client';

import { RoleRoute } from '@/context/AuthContext';
import CandidateList from '@/views/engineer/CandidateList';

export default function Page() {
    return (
        <RoleRoute roles={['engineer']}>
            <CandidateList />
        </RoleRoute>
    );
}
