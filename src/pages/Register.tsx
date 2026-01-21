import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import type { RegisterData } from '@/types/auth';
import { useState } from 'react';

export const Register = () => {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>();

    const onSubmit = async (data: RegisterData) => {
        setIsLoading(true);
        setError(null);
        try {
            await registerUser(data);
            navigate('/vehicles');
        } catch (err: any) {
            console.error(err);
            // Try to extract backend error message
            const msg = err.response?.data?.detail || 'Registration failed. Please try again.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create account"
            subtitle={
                (<>
                    Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
                </>) as any
            }
        >
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm">
                        <div className="flex">
                            <div className="ml-2">
                                <h3 className="font-medium text-red-800">{error}</h3>
                            </div>
                        </div>
                    </div>
                )}
                <Input
                    label="Full Name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    className="bg-gray-50/50"
                    error={errors.full_name?.message}
                    {...register('full_name')}
                />

                <Input
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    placeholder="john@example.com"
                    className="bg-gray-50/50"
                    error={errors.email?.message}
                    {...register('email', { required: 'Email is required' })}
                />

                <Input
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="bg-gray-50/50"
                    error={errors.password?.message}
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                />

                {/* Optional Phone Number */}
                <Input
                    label="Phone Number"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+1 (555) 000-0000"
                    className="bg-gray-50/50"
                    error={errors.phone_number?.message}
                    {...register('phone_number')}
                />

                <div className="pt-2">
                    <Button type="submit" className="w-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-shadow" isLoading={isLoading}>
                        Create Account
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
};
