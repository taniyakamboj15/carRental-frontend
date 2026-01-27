
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { Booking } from '../types/booking';

// We might need a BookingCreate type if it's not exported or if we need to derive it
export interface BookingCreate {
    vehicle_id: number;
    start_date: string;
    end_date: string;
}

export const bookingKeys = {
    all: ['bookings'] as const,
    lists: () => [...bookingKeys.all, 'list'] as const,
    list: (filters: string) => [...bookingKeys.lists(), { filters }] as const,
    details: () => [...bookingKeys.all, 'detail'] as const,
    detail: (id: number) => [...bookingKeys.details(), id] as const,
};

export const useBookings = () => {
    return useQuery({
        queryKey: bookingKeys.lists(),
        queryFn: async () => {
            const response = await api.get<Booking[]>('/bookings/');
            return response.data;
        },
    });
};

export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newBooking: BookingCreate) => {
            const response = await api.post<Booking>('/bookings/', newBooking);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
        },
    });
};

export const useCancelBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await api.patch<Booking>(`/bookings/${id}/cancel`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
        },
    });
};
