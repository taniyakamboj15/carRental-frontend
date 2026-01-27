import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Search, Map as MapIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { LocationPicker } from '@/components/common/LocationPicker';

export const HeroSearchWidget = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const [isMapOpen, setIsMapOpen] = useState(false);

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (location) params.append('location', location);
        if (dateFrom) params.append('start_date', dateFrom);
        if (dateTo) params.append('end_date', dateTo);

        navigate(`/vehicles?${params.toString()}`);
    }, [location, dateFrom, dateTo, navigate]);

    const handleLocationSelect = useCallback((loc: string) => {
        setLocation(loc);
    }, []);

    const handleLocationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value);
    }, []);

    const handleOpenMap = useCallback(() => {
        setIsMapOpen(true);
    }, []);

    const handleCloseMap = useCallback(() => {
        setIsMapOpen(false);
    }, []);

    const handleDateFromChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setDateFrom(e.target.value);
    }, []);

    const handleDateToChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setDateTo(e.target.value);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-full max-w-4xl mx-auto -mt-12 relative z-20 px-4"
        >
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100/50 backdrop-blur-sm bg-white/95">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    {/* Location Input */}
                    <div className="flex-1 relative group">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 ml-1">Pick-up Location</label>
                        <div className="relative flex items-center bg-gray-50 rounded-xl p-3 border border-gray-200 transition-colors group-hover:border-indigo-300 group-focus-within:border-indigo-500 group-focus-within:ring-2 group-focus-within:ring-indigo-200">
                            <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                            <input
                                type="text"
                                placeholder="City or Airport"
                                className="bg-transparent border-none p-0 text-gray-900 placeholder-gray-400 focus:ring-0 w-full font-medium"
                                value={location}
                                onChange={handleLocationChange}
                            />
                            <button
                                type="button"
                                onClick={handleOpenMap}
                                className="ml-2 p-1.5 hover:bg-gray-200 rounded-full transition-colors text-indigo-600"
                                title="Pick on Map"
                            >
                                <MapIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Date Inputs */}
                    <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="relative group">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 ml-1">Pick-up Date</label>
                            <div className="relative flex items-center bg-gray-50 rounded-xl p-3 border border-gray-200 transition-colors group-hover:border-indigo-300 group-focus-within:border-indigo-500">
                                <Calendar className="h-5 w-5 text-gray-400 mr-3 hidden sm:block" />
                                <input
                                    type="date"
                                    className="bg-transparent border-none p-0 text-gray-900 focus:ring-0 w-full font-medium"
                                    value={dateFrom}
                                    onChange={handleDateFromChange}
                                />
                            </div>
                        </div>
                        <div className="relative group">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 ml-1">Drop-off Date</label>
                            <div className="relative flex items-center bg-gray-50 rounded-xl p-3 border border-gray-200 transition-colors group-hover:border-indigo-300 group-focus-within:border-indigo-500">
                                <Calendar className="h-5 w-5 text-gray-400 mr-3 hidden sm:block" />
                                <input
                                    type="date"
                                    className="bg-transparent border-none p-0 text-gray-900 focus:ring-0 w-full font-medium"
                                    value={dateTo}
                                    onChange={handleDateToChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full md:w-auto h-[50px] px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <Search className="h-5 w-5" />
                            <span>Find Car</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Map Modal */}
            <AnimatePresence>
                {isMapOpen && (
                    <Dialog
                        static
                        as={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        open={isMapOpen}
                        onClose={handleCloseMap}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    >
                        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6">
                            <h3 className="text-lg font-bold mb-4">Select Location</h3>
                            <LocationPicker onLocationSelect={handleLocationSelect} />
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    onClick={handleCloseMap}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleCloseMap}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Confirm
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Dialog>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
