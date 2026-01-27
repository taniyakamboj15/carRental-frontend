import { motion } from 'framer-motion';
import { useVehicles } from '@/hooks/useVehicles';
import type { Vehicle } from '@/types/vehicle';
import { VehicleCard } from '@/components/features/VehicleCard';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { BookingModal } from '@/components/features/BookingModal';


export const Vehicles = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const locationStr = searchParams.get('location') || '';
    const startDateStr = searchParams.get('start_date') || '';
    const endDateStr = searchParams.get('end_date') || '';

    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: vehicles, isLoading, error } = useVehicles({
        location: locationStr,
        startDate: startDateStr,
        endDate: endDateStr
    });

    const handleBook = useCallback((vehicle: Vehicle) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setSelectedVehicle(vehicle);
        setIsModalOpen(true);
    }, [isAuthenticated, navigate]);

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

    if (!isAuthenticated) {
        return (
             <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <div className="bg-indigo-50 p-8 rounded-2xl max-w-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Exclusive Access</h2>
                    <p className="text-gray-600 mb-6">Our premium fleet is reserved for registered members. Please verify your identity to view available vehicles.</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        Login to View Fleet
                    </button>
                </div>
            </div>
        );
    }
    
    let heading = "Available Fleets";
    if (user?.is_superuser) {
        heading = "Available Fleets";
    } else if (locationStr) {
        heading = `Available Fleet in ${locationStr}`;
    } else if (user?.city) {
        heading = `Available Fleet in ${user.city}`;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pt-24">
            <BookingModal
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                vehicle={selectedVehicle}
                initialLocation={locationStr || user?.city || ''}
                initialStartDate={startDateStr}
                initialEndDate={endDateStr}
            />
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{heading}</h1>
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
