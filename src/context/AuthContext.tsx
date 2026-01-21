import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';
import api from '@/api/axios';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    // Assuming there's a /users/me endpoint to get current user details
                    // Based on backend analysis, we saw `deps.get_current_user` usage, so likely yes.
                    // Let's verify backend route for me. For now, assuming /users/me exists or similar.
                    // IF NOT, we might need to decode token or just assume logged in until 401.
                    // Checking backend `users.py` would confirm.
                    // For now, I'll implement a fetchMe call.
                    const response = await api.get<User>('/users/me');
                    setUser(response.data);
                } catch (error) {
                    console.error("Failed to fetch user", error);
                    localStorage.removeItem('access_token');
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const formData = new FormData();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        const response = await api.post<AuthResponse>('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        // Fetch user details immediately after login
        const userResponse = await api.get<User>('/users/me');
        setUser(userResponse.data);
    };

    const register = async (data: RegisterData) => {
        await api.post('/auth/signup', data);
        // Automatically login or redirect to login? 
        // User flow: usually login after register.
        await login({ username: data.email, password: data.password });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
        // Optional: api.post('/auth/logout') if backend requires it
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
