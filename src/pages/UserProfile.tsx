import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCallback } from 'react';
import { useProfile } from '@/hooks/useProfile';

const KYC_BADGES = {
    verified: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Verified' },
    submitted: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Submitted' },
    rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' },
    pending: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: 'Pending' }
} as const;

export const UserProfile = () => {
    const { user } = useAuth();
    const { updateProfile, submitKYC, isLoading, kycLoading } = useProfile();
    const [isEditing, setIsEditing] = useState(false);

    // Profile Form
    const { register: registerProfile, handleSubmit: handleProfileSubmit } = useForm<{
        full_name: string;
        phone_number: string;
        city: string;
    }>({
        defaultValues: {
            full_name: user?.full_name || '',
            phone_number: user?.phone_number || '',
            city: user?.city || ''
        },
        values: { // Update form when user data loads
            full_name: user?.full_name || '',
            phone_number: user?.phone_number || '',
            city: user?.city || ''
        }
    });

    // KYC Form
    const { register: registerKyc, handleSubmit: handleKycSubmit, formState: { errors: kycErrors } } = useForm<{ kycUrl: string }>({
        defaultValues: {
            kycUrl: user?.kyc_document_url || ''
        },
        values: {
            kycUrl: user?.kyc_document_url || ''
        }
    });

    const onProfileSubmit = async (data: { full_name: string; phone_number: string; city: string }) => {
        try {
            await updateProfile(data);
            setIsEditing(false);
        } catch (error) {
            // Error handled by hook toast
        }
    };

    const onKycSubmit = async (data: { kycUrl: string }) => {
        if (!data.kycUrl) return toast.error("Please enter a document URL");
        try {
            await submitKYC(data.kycUrl);
        } catch (error) {
            // Error handled by hook toast
        }
    };

    const handleToggleEdit = useCallback(() => {
        setIsEditing(prev => !prev);
    }, []);

    const getKYCBadge = useCallback(() => {
        const status = user?.kyc_status as keyof typeof KYC_BADGES || 'pending';
        const config = KYC_BADGES[status] || KYC_BADGES.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                <Icon className="w-4 h-4 mr-1" /> {config.label}
            </span>
        );
    }, [user?.kyc_status]);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Personal Info Card */}
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Personal Details</h2>
                        <Button variant="outline" size="sm" onClick={handleToggleEdit}>
                            {isEditing ? 'Cancel' : 'Edit'}
                        </Button>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                            <Input
                                label="Full Name"
                                {...registerProfile('full_name')}
                            />
                            <Input
                                label="Phone"
                                {...registerProfile('phone_number')}
                            />
                            <Input
                                label="City"
                                {...registerProfile('city')}
                            />
                            <Button type="submit" isLoading={isLoading} className="w-full">Save Changes</Button>
                        </form>
                    ) : (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                                <div className="mt-1 text-lg text-gray-900">{user.full_name || 'Not set'}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Email</label>
                                <div className="mt-1 text-lg text-gray-900">{user.email}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Phone</label>
                                <div className="mt-1 text-lg text-gray-900">{user.phone_number || 'Not set'}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">City</label>
                                <div className="mt-1 text-lg text-gray-900">{user.city || 'Not set'}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* KYC Card */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">KYC Verification</h2>

                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Current Status:</span>
                            {getKYCBadge()}
                        </div>
                        {!user.kyc_verified && (
                            <p className="mt-2 text-sm text-yellow-600">
                                You must be verified to book vehicles.
                            </p>
                        )}
                    </div>

                    {(user.kyc_status === 'pending' || user.kyc_status === 'rejected') && (
                        <form onSubmit={handleKycSubmit(onKycSubmit)} className="space-y-4 border-t pt-4">
                            <h3 className="font-medium text-gray-700">Submit Verification</h3>
                            <Input
                                label="Document URL (ID Card / License)"
                                placeholder="https://example.com/my-id.jpg"
                                error={kycErrors.kycUrl?.message}
                                {...registerKyc('kycUrl', { required: 'Document URL is required' })}
                            />
                            <Button type="submit" isLoading={kycLoading} className="w-full">
                                {user.kyc_status === 'rejected' ? 'Resubmit KYC' : 'Submit KYC'}
                            </Button>
                            <p className="text-xs text-gray-500">
                                * In a real app, this would be a file upload. For this demo, please provide a valid image URL.
                            </p>
                        </form>
                    )}

                    {user.kyc_status === 'submitted' && (
                        <div className="bg-blue-50 p-4 rounded-md text-blue-700 text-sm">
                            Your documents are under review. This usually takes 24 hours.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
