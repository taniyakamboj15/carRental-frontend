import type { Vehicle } from '@/types/vehicle';
import { Button } from '@/components/common/Button';
import { Calendar, Users, Fuel } from 'lucide-react';
import { motion } from 'framer-motion';

interface VehicleCardProps {
    vehicle: Vehicle;
    onBook: (vehicle: Vehicle) => void;
}

export const VehicleCard = ({ vehicle, onBook }: VehicleCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-100"
        >
            <div className="aspect-w-16 aspect-h-9 relative bg-gray-200 h-48">
                <img
                    src={vehicle.image_url || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000'}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="h-full w-full object-cover"
                />
                <div className="absolute top-2 right-2 rounded bg-white px-2 py-1 text-xs font-bold text-gray-900 shadow-sm">
                    {vehicle.category}
                </div>
            </div>
            <div className="p-4">
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
                    <Button onClick={() => onBook(vehicle)}>
                        Book Now
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
