import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Map as MapIcon, Phone, User as UserIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/common/Input';
import { LocationPicker } from '@/components/common/LocationPicker';
import type { Vehicle } from '@/types/vehicle';
import api from '@/api/axios';
import { toast } from 'react-hot-toast';

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
    const [isMapOpen, setIsMapOpen] = useState(false);
    
    // Booking result state
    const [bookingResult, setBookingResult] = useState<any>(null); // To store driver info response
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            setPickupLocation(initialLocation);
            setStartDate(initialStartDate);
            setEndDate(initialEndDate);
            setBookingResult(null);
            setError(null);
            setIsMapOpen(false);
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
            
            // Wait a bit before closing/navigating to let user see driver info?
            // User requested to Show driver info.
            
        } catch (err: any) {
            console.error(err);
            const detail = err.response?.data?.detail;
            let msg = 'Booking failed';

            if (Array.isArray(detail)) {
                // Handle Pydantic validation errors list
                msg = detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
            } else if (typeof detail === 'object' && detail !== null) {
                // Handle other object errors
                msg = JSON.stringify(detail);
            } else {
                // Handle string errors
                msg = detail || 'Booking failed';
            }
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
                                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                        <X className="h-5 w-5" />
                                    </button>
                                </Dialog.Title>

                                {bookingResult ? (
                                    <div className="mt-4 p-4 bg-green-50 text-green-900 rounded-lg space-y-4">
                                        <div className="flex items-center gap-2 text-lg font-bold text-green-700">
                                            <span>Booking Confirmed!</span>
                                        </div>
                                        <p>Your ride is scheduled.</p>
                                        
                                        {bookingResult.driver_name && (
                                            <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Driver Details</h4>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-gray-100 rounded-full">
                                                        <UserIcon className="h-5 w-5 text-gray-600" />
                                                    </div>
                                                    <span className="font-medium text-gray-900">{bookingResult.driver_name}</span>
                                                </div>
                                                {bookingResult.driver_contact && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-green-100 rounded-full">
                                                            <Phone className="h-5 w-5 text-green-600" />
                                                        </div>
                                                        <span className="font-bold text-green-700">{bookingResult.driver_contact}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        <Button className="w-full mt-4" onClick={() => {
                                            closeModal();
                                            navigate('/bookings');
                                        }}>
                                            Go to My Bookings
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="mt-4 space-y-4">
                                        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
                                        <p className="text-sm text-gray-500">
                                            Daily Rate: ${vehicle.daily_rate}
                                        </p>
                                        
                                        {/* Location Input with Map Toggle */}
                                         <div className="relative group">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    value={pickupLocation}
                                                    onChange={(e) => setPickupLocation(e.target.value)}
                                                    required
                                                    placeholder="Enter address or select on map"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setIsMapOpen(true)}
                                                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                                                    title="Select on Map"
                                                >
                                                    <MapIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {isMapOpen && (
                                            <div className="relative border rounded-lg overflow-hidden h-64 mt-2">
                                                 <button 
                                                    onClick={() => setIsMapOpen(false)}
                                                    className="absolute top-2 right-2 z-[400] bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                                <LocationPicker onLocationSelect={(loc) => {
                                                    setPickupLocation(loc);
                                                    setIsMapOpen(false);
                                                }} />
                                            </div>
                                        )}

                                        <Input
                                            label="Start Date"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            required
                                        />
                                        <Input
                                            label="End Date"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            required
                                        />
                                        <div className="mt-4 space-y-3">
                                            {!user?.kyc_verified && (
                                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                                    <div className="flex">
                                                        <div className="ml-3">
                                                            <p className="text-sm text-yellow-700">
                                                                Authentication Required. Check <Link to="/profile" onClick={closeModal} className="font-medium underline text-yellow-800 hover:text-yellow-900">Profile</Link> to complete KYC.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <Button 
                                                className="w-full" 
                                                onClick={handleBook} 
                                                isLoading={isLoading}
                                                disabled={!user?.kyc_verified}
                                                title={!user?.kyc_verified ? "Complete KYC validation to book" : ""}
                                            >
                                                Confirm Booking
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
