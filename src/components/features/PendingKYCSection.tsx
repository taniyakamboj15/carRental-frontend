import { ExternalLink, Check, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import type { User } from '@/types/auth';

interface PendingKYCSectionProps {
    users: User[];
    onVerify: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onReject: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const PendingKYCSection = ({ users, onVerify, onReject }: PendingKYCSectionProps) => {
    if (!users || users.length === 0) return null;

    return (
        <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-2">
                Pending KYC Approvals ({users.length})
            </h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {users.map((user) => (
                        <li key={user.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-indigo-600 truncate">{user.full_name}</p>
                                    <a
                                        href={user.kyc_document_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="ml-2 flex-shrink-0 flex items-center text-xs text-gray-500 hover:text-gray-700"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-1" /> View Document
                                    </a>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    <p>{user.email} • {user.phone_number}</p>
                                </div>
                            </div>
                            <div className="ml-4 flex items-center space-x-2">
                                <Button
                                    size="sm"
                                    data-userid={user.id}
                                    onClick={onVerify}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    data-userid={user.id}
                                    onClick={onReject}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
