'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Landing from '@/views/Landing';

export default function HomePage() {
    const { isAuthenticated, getDashboardPath, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace(getDashboardPath());
        }
    }, [loading, isAuthenticated, router, getDashboardPath]);

    if (loading) return <Landing />;
    if (isAuthenticated) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
                <div style={{ width: 32, height: 32, border: '3px solid var(--color-sky)', borderTopColor: 'var(--color-brand)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Redirecting…</span>
            </div>
        );
    }
    return <Landing />;
}
