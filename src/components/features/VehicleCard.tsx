import type { Vehicle } from '@/types/vehicle';
import { Button } from '@/components/common/Button';
import { useCallback } from 'react';
import { Calendar, Users, Fuel } from 'lucide-react';

interface VehicleCardProps {
    vehicle: Vehicle;
    onBook: (vehicle: Vehicle) => void;
}

export const VehicleCard = ({ vehicle, onBook }: VehicleCardProps) => {
    const handleBook = useCallback(() => {
        onBook(vehicle);
    }, [onBook, vehicle]);

    const getValidImageUrl = (url?: string) => {
        if (!url) return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000';
        if (url.startsWith('http')) return url;
        return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000';
    };



    return (
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                    src={getValidImageUrl(vehicle.image_url)}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000';
                    }}
                />
                <div className="absolute top-2 right-2 rounded bg-white px-2 py-1 text-xs font-bold text-gray-900 shadow-sm">
                    {vehicle.category}
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900">
                    {vehicle.make} {vehicle.model} <span className="text-gray-500 text-sm font-normal">({vehicle.year})</span>
                </h3>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center"><Users className="mr-1 h-4 w-4" /> 4 Seats</div>
                    <div className="flex items-center"><Fuel className="mr-1 h-4 w-4" /> Petrol</div>
                    <div className="flex items-center"><Calendar className="mr-1 h-4 w-4" /> Available</div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold text-indigo-600">${vehicle.daily_rate}</span>
                        <span className="text-gray-500">/day</span>
                    </div>
                    <Button onClick={handleBook}>
                        Book Now
                    </Button>
                </div>
            </div>
        </div>
    );
};
