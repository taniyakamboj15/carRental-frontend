import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { api } from '@/services/api';
import type { LoginCredentials, RegisterData } from '@/types/types';
import { setAccessToken, setUser, logout as performLogout } from '@/store/slices/authSlice';
import type { RootState } from '@/store';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const login = useCallback(async (credentials: LoginCredentials) => {
        const params = new URLSearchParams();
        params.append('username', credentials.username);
        params.append('password', credentials.password);

        const { data } = await api.post<{ access_token: string }>('/auth/login', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        dispatch(setAccessToken(data.access_token));

        const userRes = await api.get('/users/me');
        dispatch(setUser(userRes.data));
    }, [dispatch]);

    const register = useCallback(async (data: RegisterData) => {
        await api.post('/auth/signup', data);
        await login({ username: data.email, password: data.password });
    }, [login]);

    const logout = useCallback(async () => {
        try {
            // Verify if backend has logout endpoint
            await api.post('/auth/logout');
        } catch (e) {
            console.error('Logout failed', e);
        } finally {
            dispatch(performLogout());
        }
    }, [dispatch]);

    return {
        user,
        isAuthenticated,
        login,
        register,
        logout
    };
};
