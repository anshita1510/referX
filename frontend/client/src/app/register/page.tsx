import { Suspense } from 'react';
import Register from '@/views/auth/Register';

export default function RegisterPage() {
    return (
        <Suspense
            fallback={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                    <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Loading…</span>
                </div>
            }
        >
            <Register />
        </Suspense>
    );
}
