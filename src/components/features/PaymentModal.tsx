import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, CreditCard, Lock } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import type { Booking } from '@/types/booking';
import api from '@/api/axios';
import { toast } from 'react-hot-toast';

interface PaymentModalProps {
    isOpen: boolean;
    closeModal: () => void;
    booking: Booking | null;
    onPaymentSuccess: () => void;
}

export const PaymentModal = ({ isOpen, closeModal, booking, onPaymentSuccess }: PaymentModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // const [success, setSuccess] = useState(false);

    // Dummy form state - we won't actually send these to backend as per plan, 
    // or just send amounts. The backend payments.py takes PaymentCreate schema.
    // Let's check backend schema if I can finding it... 
    // Actually in step 289: PaymentCreate needs `booking_id` and `amount`.
    // It doesn't seem to take card details (which is good for security/dummy nature).

    const displayAmount = booking ? booking.total_amount : 0;

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!booking) return;

        setIsLoading(true);
        setError(null);

        // Simulate network delay for "processing"
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            await api.post('/payments/process', {
                booking_id: booking.id,
                amount: booking.total_amount
            });
            toast.success("Payment Successful! Booking Confirmed.");
            setTimeout(() => {
                // setSuccess(false);
                closeModal();
                onPaymentSuccess();
            }, 1000);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'Payment processing failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (!booking) return null;

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
                                    Payment for Booking #{booking.id}
                                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                        <X className="h-5 w-5" />
                                    </button>
                                </Dialog.Title>

                                {false ? (
                                    <div className="mt-8 text-center p-6 bg-green-50 rounded-lg">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="mt-2 text-sm font-semibold text-green-900">Payment Successful!</h3>
                                        <p className="mt-1 text-sm text-green-500">Your booking is confirmed.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handlePayment} className="mt-4 space-y-4">
                                        <div className="bg-blue-50 p-4 rounded-md flex items-center justify-between">
                                            <span className="text-blue-900 font-medium">Total Amount</span>
                                            <span className="text-2xl font-bold text-blue-700">${displayAmount}</span>
                                        </div>

                                        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

                                        <div className="relative">
                                            <Input
                                                label="Card Number"
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                maxLength={19}
                                                required
                                            />
                                            <CreditCard className="absolute right-3 top-9 h-5 w-5 text-gray-400" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Expiry Date"
                                                type="text"
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                required
                                            />
                                            <div className="relative">
                                                <Input
                                                    label="CVC"
                                                    type="text"
                                                    placeholder="123"
                                                    maxLength={3}
                                                    required
                                                />
                                                <Lock className="absolute right-3 top-9 h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <Button className="w-full flex justify-center items-center gap-2" isLoading={isLoading} type="submit">
                                                <Lock className="h-4 w-4" />
                                                Pay ${displayAmount}
                                            </Button>
                                            <p className="mt-2 text-xs text-center text-gray-500">
                                                This is a dummy payment. No real charge will be made.
                                            </p>
                                        </div>
                                    </form>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
