import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Check, X, ExternalLink } from 'lucide-react';
import api from '@/api/axios';
import type { Vehicle } from '@/types/vehicle';
import type { User } from '@/types/auth';
import { Button } from '@/components/common/Button';
import { toast } from 'react-hot-toast';
import { VehicleCard } from '@/components/features/VehicleCard';
import { AddVehicleModal } from '../components/features/AddVehicleModal';

export const AdminDashboard = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data: vehicles, refetch } = useQuery({
        queryKey: ['admin-vehicles'],
        queryFn: async () => {
            const { data } = await api.get<Vehicle[]>('/vehicles/');
            return data;
        },
    });

    const { data: users, refetch: refetchUsers } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
             const { data } = await api.get<User[]>('/users/');
             return data;
        }
    });

    const pendingKYC = users?.filter(u => u.kyc_status === 'submitted') || [];

    const handleVehicleAdded = () => {
        refetch();
    };

    const handleKYCAction = async (userId: number, status: 'verified' | 'rejected') => {
        try {
            await api.put(`/users/${userId}/kyc`, { kyc_status: status });
            toast.success(`User KYC ${status}`);
            refetchUsers();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pt-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="mt-2 text-gray-600">Manage fleet and view statistics.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Vehicle
                </Button>
            </div>

            {pendingKYC.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-2">Pending KYC Approvals ({pendingKYC.length})</h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {pendingKYC.map((user) => (
                                <li key={user.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-indigo-600 truncate">{user.full_name}</p>
                                            <a href={user.kyc_document_url} target="_blank" rel="noreferrer" className="ml-2 flex-shrink-0 flex items-center text-xs text-gray-500 hover:text-gray-700">
                                                <ExternalLink className="h-4 w-4 mr-1" /> View Document
                                            </a>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-500">
                                            <p>{user.email} • {user.phone_number}</p>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex items-center space-x-2">
                                        <Button size="sm" onClick={() => handleKYCAction(user.id, 'verified')} className="bg-green-600 hover:bg-green-700 text-white">
                                            <Check className="h-4 w-4" />
                                        </Button>
                                         <Button size="sm" onClick={() => handleKYCAction(user.id, 'rejected')} className="bg-red-600 hover:bg-red-700 text-white">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <h2 className="text-xl font-semibold mb-4 text-gray-900">Fleet Management</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles?.map((vehicle) => (
                    <div key={vehicle.id} className="relative group">
                         {/* We can reuse VehicleCard or make a specific AdminVehicleCard with Edit/Delete */}
                         {/* For speed, reusing VehicleCard but maybe disabling booking or adding overlay */}
                        <VehicleCard vehicle={vehicle} onBook={() => {}} /> 
                        
                        {/* Admin Controls Overlay could go here */}
                    </div>
                ))}
            </div>

            <AddVehicleModal 
                isOpen={isAddModalOpen} 
                closeModal={() => setIsAddModalOpen(false)} 
                onSuccess={handleVehicleAdded}
            />
        </div>
    );
};
