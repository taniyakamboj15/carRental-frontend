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
