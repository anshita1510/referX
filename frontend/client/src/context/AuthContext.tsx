import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let firebaseAuth: ReturnType<typeof getAuth> | null = null;
let googleProvider: GoogleAuthProvider | null = null;

try {
    const app = initializeApp(firebaseConfig);
    firebaseAuth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
} catch (e) {
    console.error('Firebase init failed:', e);
}

const ROLE_DASHBOARDS: Record<string, string> = {
    candidate: '/candidate/dashboard',
    engineer: '/engineer/dashboard',
    company: '/company/dashboard',
    admin: '/admin/dashboard',
};

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async (firebaseUser: any) => {
        try {
            const token = await firebaseUser.getIdToken();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch profile');
            const data = await res.json();
            setRole(data.role);
            setProfile(data);
        } catch {
            setRole(null);
            setProfile(null);
        }
    }, []);

    useEffect(() => {
        if (!firebaseAuth) { setLoading(false); return; }
        const unsub = onAuthStateChanged(firebaseAuth, async (fbUser) => {
            if (fbUser) {
                setUser(fbUser);
                await fetchProfile(fbUser);
            } else {
                setUser(null);
                setRole(null);
                setProfile(null);
            }
            setLoading(false);
        });
        return unsub;
    }, [fetchProfile]);

    const login = async (email: string, password: string) => {
        setError(null);
        try {
            const { user: fbUser } = await signInWithEmailAndPassword(firebaseAuth!, email, password);
            await fetchProfile(fbUser);
            return { success: true };
        } catch (err: any) {
            const msg = friendlyError(err.code);
            setError(msg);
            return { success: false, error: msg };
        }
    };

    const loginWithGoogle = async (intendedRole: string | null) => {
        setError(null);
        try {
            const { user: fbUser } = await signInWithPopup(firebaseAuth!, googleProvider!);
            const token = await fbUser.getIdToken();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ role: intendedRole }),
            });
            if (!res.ok) throw new Error('Google sign-in failed on server');
            const data = await res.json();
            setRole(data.role);
            setProfile(data);
            return { success: true };
        } catch (err: any) {
            const msg = friendlyError(err.code) || err.message;
            setError(msg);
            return { success: false, error: msg };
        }
    };

    const register = async (email: string, password: string, role: string, extraData: any = {}) => {
        setError(null);
        try {
            const { user: fbUser } = await createUserWithEmailAndPassword(firebaseAuth!, email, password);
            const token = await fbUser.getIdToken();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ role, ...extraData }),
            });
            if (!res.ok) {
                await fbUser.delete();
                throw new Error('Registration failed on server');
            }
            const data = await res.json();
            setRole(data.role);
            setProfile(data);
            return { success: true };
        } catch (err: any) {
            const msg = friendlyError(err.code) || err.message;
            setError(msg);
            return { success: false, error: msg };
        }
    };

    const logout = async () => {
        if (firebaseAuth) await signOut(firebaseAuth);
        setUser(null); setRole(null); setProfile(null);
    };

    const resetPassword = async (email: string) => {
        setError(null);
        try {
            await sendPasswordResetEmail(firebaseAuth!, email);
            return { success: true };
        } catch (err: any) {
            const msg = friendlyError(err.code);
            setError(msg);
            return { success: false, error: msg };
        }
    };

    const getToken = async () => user ? user.getIdToken() : null;
    const getDashboardPath = () => ROLE_DASHBOARDS[role ?? ''] ?? '/';

    const value = {
        user, role, profile, loading, error,
        isAuthenticated: !!user,
        isCandidate: role === 'candidate',
        isEngineer: role === 'engineer',
        isCompany: role === 'company',
        isAdmin: role === 'admin',
        login, loginWithGoogle, register, logout,
        resetPassword, getToken, getDashboardPath,
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
    const { isAuthenticated, loading } = useAuth();
    if (loading) return fallback ?? <AuthSpinner />;
    if (!isAuthenticated) { window.location.replace('/login'); return null; }
    return children;
}

export function RoleRoute({ children, roles, fallback = null }: { children: any; roles: string[]; fallback?: any }) {
    const { isAuthenticated, loading, role, getDashboardPath } = useAuth();
    if (loading) return fallback ?? <AuthSpinner />;
    if (!isAuthenticated) { window.location.replace('/login'); return null; }
    if (!roles.includes(role)) { window.location.replace(getDashboardPath()); return null; }
    return children;
}

function friendlyError(code: string) {
    const map: Record<string, string> = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-credential': 'Incorrect email or password.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
        'auth/network-request-failed': 'Network error. Check your connection.',
    };
    return map[code] ?? 'Something went wrong. Please try again.';
}

function AuthSpinner() {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100vh', flexDirection: 'column', gap: 16, fontFamily: 'sans-serif', color: '#6b7280'
        }}>
            <div style={{
                width: 32, height: 32, border: '2px solid #e5e7eb',
                borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.7s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <span style={{ fontSize: 14 }}>Loading...</span>
        </div>
    );
}
