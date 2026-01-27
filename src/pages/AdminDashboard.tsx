import { useCallback, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { api } from '@/services/api';
import type { Vehicle } from '@/types/vehicle';
import type { User } from '@/types/types';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';
import { VehicleCard } from '@/components/features/VehicleCard';
import { AddVehicleModal } from '@/components/features/AddVehicleModal';
import { PendingKYCSection } from '@/components/features/PendingKYCSection';
import { useAuth } from '@/hooks/useAuth';

// Helper for data-userid extraction could be placed here or inline in handlers

export const AdminDashboard = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data: vehicles, refetch } = useQuery({
        queryKey: ['admin-vehicles'],
        queryFn: async () => {
            const { data } = await api.get<Vehicle[]>('/vehicles/');
            return data;
        },
    });

    const [pendingKYC, setPendingKYC] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { logout } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get<User[]>('/users/');
                setPendingKYC(data.filter(u => u.kyc_status === 'submitted'));
            } catch (err: any) {
                console.error('Failed to fetch users:', err);
                if (err.response?.status === 403) {
                    setError('Access denied. Please logout and login again with admin credentials.');
                } else {
                    setError('Failed to load users');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleVehicleAdded = () => {
        refetch();
    };

    const handleKYCAction = async (userId: number, status: 'verified' | 'rejected') => {
        try {
            await api.put(`/users/${userId}/kyc`, { kyc_status: status });
            toast.success(`User KYC ${status}`);
            // Re-fetch pending KYC list after action
            const { data } = await api.get<User[]>('/users/');
            setPendingKYC(data.filter(u => u.kyc_status === 'submitted'));
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleVerifyKYC = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const userId = e.currentTarget.dataset.userid;
        if (userId) handleKYCAction(Number(userId), 'verified');
    }, [handleKYCAction]);

    const handleRejectKYC = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const userId = e.currentTarget.dataset.userid;
        if (userId) handleKYCAction(Number(userId), 'rejected');
    }, [handleKYCAction]);

    const handleOpenAddModal = useCallback(() => {
        setIsAddModalOpen(true);
    }, []);

    const handleCloseAddModal = useCallback(() => {
        setIsAddModalOpen(false);
    }, []);

    const handleSuccessVehicleAdd = useCallback(() => {
        handleVehicleAdded();
    }, [handleVehicleAdded]);

    // Empty handler for vehicle card onBook to avoid anonymous function
    const handleNoOpBook = useCallback(() => { }, []);

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-2xl font-bold text-red-700 mb-4">Access Error</h2>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button
                        onClick={logout}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Logout and Login Again
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pt-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="mt-2 text-gray-600">Manage fleet and view statistics.</p>
                </div>
                <Button onClick={handleOpenAddModal} className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Vehicle
                </Button>
            </div>

            <PendingKYCSection
                users={pendingKYC}
                onVerify={handleVerifyKYC}
                onReject={handleRejectKYC}
            />

            <h2 className="text-xl font-semibold mb-4 text-gray-900">Fleet Management</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles?.map((vehicle) => (
                    <div key={vehicle.id} className="relative group">
                        {/* We can reuse VehicleCard or make a specific AdminVehicleCard with Edit/Delete */}
                        {/* For speed, reusing VehicleCard but maybe disabling booking or adding overlay */}
                        <VehicleCard vehicle={vehicle} onBook={handleNoOpBook} />

                        {/* Admin Controls Overlay could go here */}
                    </div>
                ))}
            </div>

            <AddVehicleModal
                isOpen={isAddModalOpen}
                closeModal={handleCloseAddModal}
                onSuccess={handleSuccessVehicleAdd}
            />
        </div>
    );
};
