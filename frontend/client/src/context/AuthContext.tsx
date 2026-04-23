import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../api/axiosClient';

interface AuthUser {
    id: number;
    email: string;
    name: string;
    role: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    role: string | null;
    profile: any;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    isCandidate: boolean;
    isEngineer: boolean;
    isCompany: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, role: string, extra: { name: string }) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    getToken: () => string | null;
    getDashboardPath: () => string;
    clearError: () => void;
}

const ROLE_DASHBOARDS: Record<string, string> = {
    candidate: '/candidate/dashboard',
    engineer: '/engineer/dashboard',
    company: '/company/dashboard',
    admin: '/admin/dashboard',
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Restore session from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (stored && token) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            // Fetch full profile in background
            api.get('/api/auth/me')
                .then((r) => setProfile(r.data))
                .catch(() => {
                    setUser(null);
                    setProfile(null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        setError(null);
        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            try {
                const me = await api.get('/api/auth/me');
                setProfile(me.data);
            } catch {
                setProfile(data.user);
            }
            return { success: true };
        } catch (err: any) {
            const msg = err.response?.data?.error ?? 'Something went wrong.';
            setError(msg);
            return { success: false, error: msg };
        }
    };

    const register = async (email: string, password: string, role: string, extra: { name: string }) => {
        setError(null);
        try {
            await api.post('/api/auth/register', { email, password, role, name: extra.name });
            return { success: true };
        } catch (err: any) {
            const msg = err.response?.data?.error ?? 'Something went wrong.';
            setError(msg);
            return { success: false, error: msg };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setProfile(null);
    };

    const getToken = () => localStorage.getItem('token');
    const getDashboardPath = () => ROLE_DASHBOARDS[user?.role ?? ''] ?? '/';

    const value: AuthContextValue = {
        user,
        role: user?.role ?? null,
        profile,
        loading,
        error,
        isAuthenticated: !!user,
        isCandidate: user?.role === 'candidate',
        isEngineer: user?.role === 'engineer',
        isCompany: user?.role === 'company',
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        getToken,
        getDashboardPath,
        clearError: () => setError(null),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}

export function ProtectedRoute({ children, fallback = null }: { children: any; fallback?: any }) {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();
    if (loading) return fallback ?? <AuthSpinner />;
    if (!isAuthenticated) {
        router.replace('/login');
        return null;
    }
    return children;
}

export function RoleRoute({ children, roles, fallback = null }: { children: any; roles: string[]; fallback?: any }) {
    const router = useRouter();
    const { isAuthenticated, loading, role, getDashboardPath } = useAuth();
    if (loading) return fallback ?? <AuthSpinner />;
    if (!isAuthenticated) {
        router.replace('/login');
        return null;
    }
    if (!roles.includes(role!)) {
        router.replace(getDashboardPath());
        return null;
    }
    return children;
}

function AuthSpinner() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: 32, height: 32, border: '3px solid var(--color-sky)', borderTopColor: 'var(--color-brand)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Loading…</span>
        </div>
    );
}
