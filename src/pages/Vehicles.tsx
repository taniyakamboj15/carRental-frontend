import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/api/axios';
import type { Vehicle } from '@/types/vehicle';
import { VehicleCard } from '@/components/features/VehicleCard';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BookingModal } from '@/components/features/BookingModal';


export const Vehicles = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: vehicles, isLoading, error } = useQuery({
        queryKey: ['vehicles'],
        queryFn: async () => {
            const { data } = await api.get<Vehicle[]>('/vehicles/');
            return data;
        },
    });

    const handleBook = (vehicle: Vehicle) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setSelectedVehicle(vehicle);
        setIsModalOpen(true);
    };

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600">
                Failed to load vehicles. Please try again later.
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pt-24">
            <BookingModal
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                vehicle={selectedVehicle}
            />
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Available Vehicles</h1>
                    <p className="mt-2 text-gray-600">Choose from our wide range of premium vehicles.</p>
                </div>
                {/* Filter controls could go here */}
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
                {vehicles?.map((vehicle) => (
                    <motion.div key={vehicle.id} variants={item}>
                        <VehicleCard vehicle={vehicle} onBook={handleBook} />
                    </motion.div>
                ))}
            </motion.div>

            {vehicles?.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No vehicles found.
                </div>
            )}
        </div>
    );
};
