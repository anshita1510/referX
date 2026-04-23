import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
    timeout: 10000,
});

const PUBLIC_AUTH_PATHS = ['/login', '/register', '/forgot-password'];

function isPublicAuthPath(): boolean {
    const path = window.location.pathname;
    return PUBLIC_AUTH_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

function requestHadAuthHeader(err: { config?: { headers?: Record<string, unknown> } }): boolean {
    const h = err.config?.headers;
    if (!h) return false;
    const a = h.Authorization ?? h.authorization;
    return typeof a === 'string' && a.length > 0;
}

api.interceptors.request.use((config) => {
    if (typeof window === 'undefined') return config;
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (typeof window !== 'undefined' && err.response?.status === 401) {
            // Do not treat unauthenticated endpoints (e.g. wrong password on login) as a global logout.
            const hadAuth = requestHadAuthHeader(err);
            if (hadAuth) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                if (!isPublicAuthPath()) {
                    window.location.replace('/login');
                }
            }
        }
        return Promise.reject(err);
    },
);

export default api;
