import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import api from '@/api/axios';
import { toast } from 'react-hot-toast';

interface AddVehicleModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSuccess: () => void;
}

export const AddVehicleModal = ({ isOpen, closeModal, onSuccess }: AddVehicleModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: 2024,
        license_plate: '',
        daily_rate: '',
        location: '',
        driver_name: '',
        driver_contact: '',
        image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2672&auto=format&fit=crop' // Default placeholder
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post('/vehicles/', {
                ...formData,
                year: Number(formData.year),
                daily_rate: Number(formData.daily_rate)
            });
            toast.success("Vehicle added successfully!");
            onSuccess();
            closeModal();
            // Reset form
            setFormData({
                make: '',
                model: '',
                year: 2024,
                license_plate: '',
                daily_rate: '',
                location: '',
                driver_name: '',
                driver_contact: '',
                image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2672&auto=format&fit=crop'
            });
        } catch (err: any) {
             console.error(err);
             toast.error(err.response?.data?.detail || "Failed to add vehicle");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                         <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center mb-6"
                                >
                                    Add New Vehicle
                                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                        <X className="h-5 w-5" />
                                    </button>
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input label="Make" name="make" value={formData.make} onChange={handleChange} required placeholder="e.g. BMW" />
                                        <Input label="Model" name="model" value={formData.model} onChange={handleChange} required placeholder="e.g. X5" />
                                        <Input label="Year" name="year" type="number" value={formData.year} onChange={handleChange} required />
                                        <Input label="License Plate" name="license_plate" value={formData.license_plate} onChange={handleChange} required />
                                        <Input label="Daily Rate ($)" name="daily_rate" type="number" step="0.01" value={formData.daily_rate} onChange={handleChange} required />
                                        <Input label="Location" name="location" value={formData.location} onChange={handleChange} required placeholder="City or Base Address" />
                                    </div>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-100">
                                        <h4 className="font-medium text-gray-700">Driver Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input label="Driver Name" name="driver_name" value={formData.driver_name} onChange={handleChange} placeholder="Optional" />
                                            <Input label="Driver Contact" name="driver_contact" value={formData.driver_contact} onChange={handleChange} placeholder="Optional (Hidden until booked)" />
                                        </div>
                                    </div>

                                    <Input label="Image URL" name="image_url" value={formData.image_url} onChange={handleChange} />

                                    <div className="mt-8 flex justify-end gap-3">
                                        <Button variant="outline" type="button" onClick={closeModal}>Cancel</Button>
                                        <Button type="submit" isLoading={isLoading}>Add Vehicle</Button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
