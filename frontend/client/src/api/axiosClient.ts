import axios from 'axios';
import { getAuth } from 'firebase/auth';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    const user = getAuth().currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            getAuth().signOut();
            window.location.replace('/login');
        }
        return Promise.reject(err);
    }
);

export default api;
