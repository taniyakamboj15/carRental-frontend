import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { Vehicle } from '@/types/vehicle';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';
import { BookingSuccess } from '@/components/features/BookingSuccess';
import { BookingForm } from '@/components/features/BookingForm';

interface BookingModalProps {
    isOpen: boolean;
    closeModal: () => void;
    vehicle: Vehicle | null;
    initialLocation?: string;
    initialStartDate?: string;
    initialEndDate?: string;
}

export const BookingModal = ({ isOpen, closeModal, vehicle, initialLocation = '', initialStartDate = '', initialEndDate = '' }: BookingModalProps) => {
    const { user } = useAuth();
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [pickupLocation, setPickupLocation] = useState(initialLocation);
    const [bookingResult, setBookingResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    // Handlers
    const handleClose = useCallback(() => {
        closeModal();
    }, [closeModal]);

    const handleStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
    }, []);

    const handleEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    }, []);

    const handlePickupChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPickupLocation(e.target.value);
    }, []);

    const handleNavigateToBookings = useCallback(() => {
        closeModal();
        navigate('/bookings');
    }, [closeModal, navigate]);

    useEffect(() => {
        if (isOpen) {
            setPickupLocation(initialLocation);
            setStartDate(initialStartDate);
            setEndDate(initialEndDate);
            setBookingResult(null);
            setError(null);
        }
    }, [isOpen, initialLocation, initialStartDate, initialEndDate, vehicle]);

    const handleBook = async () => {
        if (!startDate || !endDate || !vehicle) return;
        setIsLoading(true);
        setError(null);

        try {
            const { data } = await api.post('/bookings/', {
                vehicle_id: vehicle.id,
                start_date: startDate,
                end_date: endDate,
                pickup_location: pickupLocation
            });

            setBookingResult(data);
            toast.success("Booking confirmed!");

        } catch (err: any) {
            console.error(err);
            const detail = err.response?.data?.detail;

            const getErrorMessage = (errorDetail: any) => {
                if (Array.isArray(errorDetail)) return errorDetail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
                if (typeof errorDetail === 'object' && errorDetail !== null) return JSON.stringify(errorDetail);
                return errorDetail || 'Booking failed';
            };

            const msg = getErrorMessage(detail);
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };


    if (!vehicle) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                                >
                                    Book {vehicle.make} {vehicle.model}
                                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
                                        <X className="h-5 w-5" />
                                    </button>
                                </Dialog.Title>

                                {bookingResult ? (
                                    <BookingSuccess
                                        driverName={bookingResult.driver_name}
                                        driverContact={bookingResult.driver_contact}
                                        onNavigateToBookings={handleNavigateToBookings}
                                    />
                                ) : (
                                    <BookingForm
                                        vehicle={vehicle}
                                        startDate={startDate}
                                        endDate={endDate}
                                        pickupLocation={pickupLocation}
                                        error={error}
                                        isLoading={isLoading}
                                        kycVerified={user?.kyc_verified || false}
                                        onStartDateChange={handleStartDateChange}
                                        onEndDateChange={handleEndDateChange}
                                        onPickupChange={handlePickupChange}
                                        onBook={handleBook}
                                        onClose={handleClose}
                                    />
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
