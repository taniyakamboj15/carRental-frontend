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
