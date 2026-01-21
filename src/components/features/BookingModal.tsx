import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import type { Vehicle } from '@/types/vehicle';
import api from '@/api/axios';
import { toast } from 'react-hot-toast';

interface BookingModalProps {
    isOpen: boolean;
    closeModal: () => void;
    vehicle: Vehicle | null;
}

export const BookingModal = ({ isOpen, closeModal, vehicle }: BookingModalProps) => {
    // const { user } = useAuth(); // User ID handles by backend session or context if needed, but here we just need token which axios handles.
    // Actually the modal doesn't use 'user', so just remove it.
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // const [success, setSuccess] = useState(false); // Removed internal success state for toast
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleBook = async () => {
        if (!startDate || !endDate || !vehicle) return;
        setIsLoading(true);
        setError(null);

        try {
            await api.post('/bookings/', {
                vehicle_id: vehicle.id,
                start_date: startDate, // Assumes backend accepts YYYY-MM-DD string or ISO
                end_date: endDate
            });
            // setSuccess(true);
            toast.success("Booking request sent successfully! Redirecting...");
            setTimeout(() => {
                // setSuccess(false);
                closeModal();
                setStartDate('');
                setEndDate('');
                navigate('/bookings');
            }, 1000);
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

                                {false ? (
                                    <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
                                        Booking request sent successfully! Redirecting...
                                    </div>
                                ) : (
                                    <div className="mt-4 space-y-4">
                                        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
                                        <p className="text-sm text-gray-500">
                                            Daily Rate: ${vehicle.daily_rate}
                                        </p>
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
                                        <div className="mt-4">
                                            <Button className="w-full" onClick={handleBook} isLoading={isLoading}>
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
