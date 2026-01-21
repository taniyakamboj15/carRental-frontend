import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useProfile } from '@/hooks/useProfile';

export const Profile = () => {
    const { user } = useAuth(); 
    const { updateProfile, submitKYC, isLoading, kycLoading } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        phone_number: user?.phone_number || '',
        city: user?.city || ''
    });

    const [kycUrl, setKycUrl] = useState(user?.kyc_document_url || '');

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await updateProfile(formData);
        if (success) setIsEditing(false);
    };

    const handleSubmitKYC = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!kycUrl) return toast.error("Please enter a document URL");
        await submitKYC(kycUrl);
    };

    const getKYCBadge = () => {
        switch (user?.kyc_status) {
            case 'verified':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"><CheckCircle className="w-4 h-4 mr-1"/> Verified</span>;
            case 'submitted':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"><Clock className="w-4 h-4 mr-1"/> Submitted</span>;
            case 'rejected':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"><XCircle className="w-4 h-4 mr-1"/> Rejected</span>;
            default:
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"><AlertCircle className="w-4 h-4 mr-1"/> Pending</span>;
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Personal Info Card */}
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Personal Details</h2>
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Cancel' : 'Edit'}
                        </Button>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <Input 
                                label="Full Name" 
                                value={formData.full_name} 
                                onChange={e => setFormData({...formData, full_name: e.target.value})} 
                            />
                            <Input 
                                label="Phone" 
                                value={formData.phone_number} 
                                onChange={e => setFormData({...formData, phone_number: e.target.value})} 
                            />
                             <Input 
                                label="City" 
                                value={formData.city} 
                                onChange={e => setFormData({...formData, city: e.target.value})} 
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
                        <form onSubmit={handleSubmitKYC} className="space-y-4 border-t pt-4">
                            <h3 className="font-medium text-gray-700">Submit Verification</h3>
                             <Input 
                                label="Document URL (ID Card / License)" 
                                placeholder="https://example.com/my-id.jpg"
                                value={kycUrl} 
                                onChange={e => setKycUrl(e.target.value)} 
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
