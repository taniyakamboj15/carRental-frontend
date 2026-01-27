export interface User {
    id: number;
    email: string;
    full_name?: string;
    is_active: boolean;
    is_superuser: boolean;
    role: 'customer' | 'admin';
    kyc_verified: boolean;
    kyc_status: 'pending' | 'submitted' | 'verified' | 'rejected';
    kyc_document_url?: string;
    phone_number?: string;
    city?: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    // refresh_token handled via httpOnly cookie
}

export interface LoginCredentials {
    username: string; // OAuth2 form uses 'username' for email
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    full_name?: string;
    phone_number?: string;
    city?: string;
}

export interface ApiError {
    message: string;
    code?: string;
    details?: unknown;
}

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

export interface Vehicle {
    id: number;
    make: string;
    model: string;
    year: number;
    license_plate: string;
    daily_rate: number;
    is_available: boolean;
    image_url?: string;
    category: string;
    created_at?: string;
    updated_at?: string;
}

export interface VehicleCreate {
    make: string;
    model: string;
    year: number;
    license_plate: string;
    daily_rate: number;
    image_url?: string;
    category: string;
}
