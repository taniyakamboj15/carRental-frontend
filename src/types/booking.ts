export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export const BookingStatus = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
    COMPLETED: "completed"
} as const;

export interface Booking {
    id: number;
    user_id: number;
    vehicle_id: number;
    start_date: string;
    end_date: string;
    total_amount: number;
    status: BookingStatus;
    created_at: string;
    pickup_location?: string;
    driver_name?: string;
    driver_contact?: string;
}
