import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Map as MapIcon, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LocationPicker } from '@/components/common/LocationPicker';
import type { Vehicle } from '@/types/vehicle';

interface BookingFormProps {
    vehicle: Vehicle;
    startDate: string;
    endDate: string;
    pickupLocation: string;
    error: string | null;
    isLoading: boolean;
    kycVerified: boolean;
    onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPickupChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBook: () => void;
    onClose: () => void;
}

export const BookingForm = ({
    vehicle,
    startDate,
    endDate,
    pickupLocation,
    error,
    isLoading,
    kycVerified,
    onStartDateChange,
    onEndDateChange,
    onPickupChange,
    onBook,
    onClose
}: BookingFormProps) => {
    const [isMapOpen, setIsMapOpen] = useState(false);

    const handleOpenMap = useCallback(() => {
        setIsMapOpen(true);
    }, []);

    const handleCloseMap = useCallback(() => {
        setIsMapOpen(false);
    }, []);

    const handleLocationSelect = useCallback((loc: string) => {
        onPickupChange({ target: { value: loc } } as React.ChangeEvent<HTMLInputElement>);
        setIsMapOpen(false);
    }, [onPickupChange]);

    return (
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
                        onChange={onPickupChange}
                        required
                        placeholder="Enter address or select on map"
                    />
                    <button
                        type="button"
                        onClick={handleOpenMap}
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
                        onClick={handleCloseMap}
                        className="absolute top-2 right-2 z-[400] bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <LocationPicker onLocationSelect={handleLocationSelect} />
                </div>
            )}

            <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={onStartDateChange}
                required
            />
            <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={onEndDateChange}
                required
            />
            <div className="mt-4 space-y-3">
                {!kycVerified && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <p className="text-sm text-yellow-700">
                                Authentication Required. Check <Link to="/profile" onClick={onClose} className="font-medium underline text-yellow-800 hover:text-yellow-900">Profile</Link> to complete KYC.
                            </p>
                        </div>
                    </div>
                )}
                <Button
                    className="w-full"
                    onClick={onBook}
                    isLoading={isLoading}
                    disabled={!kycVerified}
                    title={!kycVerified ? "Complete KYC validation to book" : ""}
                >
                    {!kycVerified ? "Complete KYC to Book" : "Confirm Booking"}
                </Button>
            </div>
        </div>
    );
};
