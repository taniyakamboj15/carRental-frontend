import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { api } from '@/services/api';
import type { User, AuthResponse } from '@/types/types';
import { setAccessToken, setUser, logout as performLogout } from '@/store/slices/authSlice';

export const useInitializeAuth = () => {
    const [isInitializing, setIsInitializing] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const initialize = async () => {
            try {
                // Try to refresh token (uses HttpOnly cookie)
                const { data } = await api.post<AuthResponse>('/auth/refresh');
                dispatch(setAccessToken(data.access_token));

                // Fetch User
                const userResponse = await api.get<User>('/users/me');
                dispatch(setUser(userResponse.data));
            } catch (error) {
                // Silent fail is expected if no session
                dispatch(performLogout());
            } finally {
                setIsInitializing(false);
            }
        };

        initialize();
    }, [dispatch]);

    return { isInitializing };
};
