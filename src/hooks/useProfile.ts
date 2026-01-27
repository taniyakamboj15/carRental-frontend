import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/authSlice';

interface ProfileUpdateData {
    full_name: string;
    phone_number: string;
    city: string;
}

export const useProfile = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const updateProfileMutation = useMutation({
        mutationFn: async (formData: ProfileUpdateData) => {
            const { data } = await api.put('/users/me', formData);
            return data;
        },
        onSuccess: (data) => {
            toast.success("Profile updated successfully");
            dispatch(setUser(data)); // Update Redux store with new user data
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { detail?: string } } };
            toast.error(err.response?.data?.detail || "Update failed");
        }
    });

    const kycMutation = useMutation({
        mutationFn: async (kycUrl: string) => {
            const { data } = await api.post('/users/kyc', { document_url: kycUrl });
            return data;
        },
        onSuccess: () => {
            toast.success("KYC submitted for review");
            // Assuming the backend returns the updated user object with new KYC status
            // If not, we might need to manually update or refetch
            // For now, let's dispatch if data looks like user, or invalidate 'user' query
            queryClient.invalidateQueries({ queryKey: ['user'] });
            window.location.reload(); // Keeping original behavior for deep state reset if needed, though mostly redundant with proper state mgmt
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { detail?: string } } };
            toast.error(err.response?.data?.detail || "KYC submission failed");
        }
    });

    return {
        updateProfile: updateProfileMutation.mutateAsync,
        submitKYC: kycMutation.mutateAsync,
        isLoading: updateProfileMutation.isPending,
        kycLoading: kycMutation.isPending
    };
};
