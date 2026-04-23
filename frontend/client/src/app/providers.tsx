'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ErrorBoundary } from '@/ErrorBoundary';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary>
            <AuthProvider>{children}</AuthProvider>
        </ErrorBoundary>
    );
}
