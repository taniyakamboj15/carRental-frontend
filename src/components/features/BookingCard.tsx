import type { Booking } from '@/types/booking';
import { BookingStatus } from '@/types/booking';
import { Button } from '@/components/common/Button';
import { MapPin, User, Phone } from 'lucide-react';

interface BookingCardProps {
    booking: Booking;
    onCancel: (id: number) => void;
    onPay: (booking: Booking) => void;
}

export const BookingCard = ({ booking, onCancel, onPay }: BookingCardProps) => {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">
                        Booking #{booking.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                        Vehicle ID: {booking.vehicle_id}
                    </p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${booking.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-800' :
                        booking.status === BookingStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'}`}>
                    {booking.status.toUpperCase()}
                </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-500">Start Date</p>
                    <p className="font-medium">{booking.start_date}</p>
                </div>
                <div>
                    <p className="text-gray-500">End Date</p>
                    <p className="font-medium">{booking.end_date}</p>
                </div>
                <div>
                    <p className="text-gray-500">Total Amount</p>
                    <p className="font-medium">${booking.total_amount}</p>
                </div>
                {booking.pickup_location && (
                    <div className="col-span-2 flex items-start gap-2 mt-2 pt-2 border-t border-gray-100">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wide">Pickup Location</p>
                            <p className="font-medium text-gray-900">{booking.pickup_location}</p>
                        </div>
                    </div>
                )}
                {booking.driver_name && (
                    <div className="col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Driver Details</p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="font-medium text-gray-900">{booking.driver_name}</span>
                            </div>
                            {booking.driver_contact && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-green-600" />
                                    <span className="font-bold text-green-700">{booking.driver_contact}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 flex gap-3">
                {booking.status === BookingStatus.PENDING && (
                    <>
                        <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={() => onPay(booking)}
                        >
                            Pay Now
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                            onClick={() => onCancel(booking.id)}
                        >
                            Cancel
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};
