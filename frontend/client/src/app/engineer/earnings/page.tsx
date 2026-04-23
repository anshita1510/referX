'use client';

import { RoleRoute } from '@/context/AuthContext';
import Earnings from '@/views/engineer/Earnings';

export default function Page() {
    return (
        <RoleRoute roles={['engineer']}>
            <Earnings />
        </RoleRoute>
    );
}
