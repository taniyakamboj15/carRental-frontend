import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { BookingCard } from '@/components/features/BookingCard';
import type { Booking } from '@/types/booking';
import { useState } from 'react';
import { PaymentModal } from '@/components/features/PaymentModal';


export const BookingHistory = () => {

    const { data: bookings, isLoading, error, refetch } = useQuery({
        queryKey: ['bookings'],
        queryFn: async () => {
            const { data } = await api.get<Booking[]>('/bookings/');

            return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
    });

    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const handleCancel = async (id: number) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await api.patch(`/bookings/${id}/cancel`);
            alert("Booking cancelled successfully!");
            refetch();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.detail || "Failed to cancel booking");
        }
    };

    const handlePay = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsPaymentOpen(true);
    };

    const onPaymentSuccess = () => {
        refetch(); // Refresh list to show confirmed status
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
            <div className="text-center text-red-600 py-12">
                Failed to load specific bookings history.
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pt-24">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {bookings?.map((booking) => (
                    <BookingCard
                        key={booking.id}
                        booking={booking}
                        onCancel={handleCancel}
                        onPay={handlePay}
                    />
                ))}
            </div>

            {bookings?.length === 0 && (
                <div className="text-center py-12 rounded-lg border-2 border-dashed border-gray-300">
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No bookings</h3>
                    <p className="mt-1 text-sm text-gray-500">You haven't booked any vehicles yet.</p>
                </div>
            )}

            <PaymentModal
                isOpen={isPaymentOpen}
                closeModal={() => setIsPaymentOpen(false)}
                booking={selectedBooking}
                onPaymentSuccess={onPaymentSuccess}
            />
        </div>
    );
};
