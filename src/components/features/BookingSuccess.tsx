import { User as UserIcon, Phone } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface BookingSuccessProps {
    driverName?: string;
    driverContact?: string;
    onNavigateToBookings: () => void;
}

export const BookingSuccess = ({ driverName, driverContact, onNavigateToBookings }: BookingSuccessProps) => {
    return (
        <div className="mt-4 p-4 bg-green-50 text-green-900 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-lg font-bold text-green-700">
                <span>Booking Confirmed!</span>
            </div>
            <p>Your ride is scheduled.</p>

            {driverName && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Driver Details
                    </h4>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gray-100 rounded-full">
                            <UserIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900">{driverName}</span>
                    </div>
                    {driverContact && (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-full">
                                <Phone className="h-5 w-5 text-green-600" />
                            </div>
                            <span className="font-bold text-green-700">{driverContact}</span>
                        </div>
                    )}
                </div>
            )}

            <Button className="w-full mt-4" onClick={onNavigateToBookings}>
                Go to My Bookings
            </Button>
        </div>
    );
};
