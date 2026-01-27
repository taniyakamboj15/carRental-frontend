import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // Updated import
import { AuthLayout } from '@/layouts/AuthLayout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import type { LoginCredentials } from '@/types/types'; // Updated import
import { useState, useCallback } from 'react';

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();

    const onSubmit = useCallback(async (data: LoginCredentials) => {
        setIsLoading(true);
        setError(null);
        try {
            await login(data);
            navigate('/vehicles');
        } catch (err: unknown) {
            console.error(err);
            setError('Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [login, navigate]);

    return (
        <AuthLayout
            title="Sign in to your account"
            subtitle={
                <>
                    Or <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">create a new account</Link>
                </>
            }
        >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                            </div>
                        </div>
                    </div>
                )}
                <Input
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    error={errors.username?.message}
                    {...register('username', { required: 'Email is required' })}
                />

                <Input
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    error={errors.password?.message}
                    {...register('password', { required: 'Password is required' })}
                />

                <div>
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Sign in
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
};
