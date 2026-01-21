import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import type { Vehicle } from '@/types/vehicle';

interface UseVehiclesParams {
    location?: string;
    startDate?: string;
    endDate?: string;
}

export const useVehicles = ({ location, startDate, endDate }: UseVehiclesParams) => {
    return useQuery({
        queryKey: ['vehicles', location, startDate, endDate],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (location) params.append('location', location);
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);
            
            const { data } = await api.get<Vehicle[]>(`/vehicles/?${params.toString()}`);
            return data;
        },
    });
};
