import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { ErrorBoundary } from '@/error-boundary/ErrorBoundary';

// Lazy load pages
const Home = lazy(() => import('@/pages/Home').then(module => ({ default: module.Home })));
const Login = lazy(() => import('@/pages/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('@/pages/Register').then(module => ({ default: module.Register })));
const Vehicles = lazy(() => import('@/pages/Vehicles').then(module => ({ default: module.Vehicles })));
const BookingHistory = lazy(() => import('@/pages/BookingHistory').then(module => ({ default: module.BookingHistory })));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const UserProfile = lazy(() => import('@/pages/UserProfile').then(module => ({ default: module.UserProfile })));

// Loading component
const Loading = () => <div className="flex items-center justify-center h-screen">Loading...</div>;

export const router = createBrowserRouter([
    {
        path: '/login',
        element: (
            <Suspense fallback={<Loading />}>
                <Login />
            </Suspense>
        ),
        errorElement: <ErrorBoundary />,
    },
    {
        path: '/register',
        element: (
            <Suspense fallback={<Loading />}>
                <Register />
            </Suspense>
        ),
        errorElement: <ErrorBoundary />,
    },
    {
        path: '/',
        element: <MainLayout />, // Ensure MainLayout handles <Outlet />
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<Loading />}>
                        <Home />
                    </Suspense>
                ),
            },
            {
                path: 'vehicles',
                element: (
                    <Suspense fallback={<Loading />}>
                        <AuthGuard>
                            <Vehicles />
                        </AuthGuard>
                    </Suspense>
                ),
            },
            {
                path: 'bookings',
                element: (
                    <Suspense fallback={<Loading />}>
                        <AuthGuard>
                            <BookingHistory />
                        </AuthGuard>
                    </Suspense>
                ),
            },
            {
                path: 'profile',
                element: (
                    <Suspense fallback={<Loading />}>
                        <AuthGuard>
                            <UserProfile />
                        </AuthGuard>
                    </Suspense>
                ),
            },
            {
                path: 'admin',
                element: (
                    <Suspense fallback={<Loading />}>
                        <AuthGuard requireAdmin>
                            <AdminDashboard />
                        </AuthGuard>
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);
