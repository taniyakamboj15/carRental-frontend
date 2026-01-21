import { useState } from 'react';
import api from '@/api/axios';
import { toast } from 'react-hot-toast';

interface ProfileUpdateData {
    full_name: string;
    phone_number: string;
    city: string;
}

export const useProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [kycLoading, setKycLoading] = useState(false);

    const updateProfile = async (formData: ProfileUpdateData) => {
        setIsLoading(true);
        try {
            await api.put('/users/me', formData);
            toast.success("Profile updated successfully");
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Update failed");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const submitKYC = async (kycUrl: string) => {
        setKycLoading(true);
        try {
            await api.post('/users/kyc', { document_url: kycUrl });
            toast.success("KYC submitted for review");
            // Reload to refresh user context with new KYC status
            window.location.reload();
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "KYC submission failed");
            return false;
        } finally {
            setKycLoading(false);
        }
    };

    return {
        updateProfile,
        submitKYC,
        isLoading,
        kycLoading
    };
};
