import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { store } from '@/store';
import { setAccessToken, logout } from '@/store/slices/authSlice';
import type { AuthResponse } from '@/types/types';

// Queue for failed requests during token refresh
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies
});

// Request Interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = store.getState().auth.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Skip refresh logic for /auth/refresh endpoint itself to prevent infinite loop
        if (originalRequest.url?.includes('/auth/refresh')) {
            return Promise.reject(error);
        }

        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh token
                // Assuming the refresh endpoint is /auth/refresh and it uses HttpOnly cookie
                const { data } = await api.post<AuthResponse>('/auth/refresh');

                store.dispatch(setAccessToken(data.access_token));

                processQueue(null, data.access_token);

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError as Error, null);
                store.dispatch(logout());
                // Don't reject here - let the app continue
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
