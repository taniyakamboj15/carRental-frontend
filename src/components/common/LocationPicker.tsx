import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Locate, Search, User } from 'lucide-react';
import { useLocationPicker } from '@/hooks/useLocationPicker';
import L from 'leaflet';

interface LocationPickerProps {
    onLocationSelect: (location: string) => void;
}

// Helper to update map view when center changes
function ChangeView({ center, zoom }: { center: L.LatLngExpression, zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

// Helper to handle map clicks
function LocationMarker({ onClick, position }: { onClick: (latlng: L.LatLng) => void, position: L.LatLng | null }) {
    useMapEvents({
        click(e) {
            onClick(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export const LocationPicker = ({ onLocationSelect }: LocationPickerProps) => {
    const {
        mapState,
        searchQuery,
        setSearchQuery,
        searchResults,
        handleMapClick,
        handleSearch,
        selectSearchResult,
        handleLocateMe,
        confirmLocation
    } = useLocationPicker(onLocationSelect);

    const { center, zoom, position, selectedAddress } = mapState;

    return (
        <div className="flex flex-col h-[400px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-inner z-0 bg-white"> 
            <div className="relative flex-1">
                <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <ChangeView center={center} zoom={zoom} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker onClick={handleMapClick} position={position} />
                </MapContainer>
                
                <button 
                    onClick={handleLocateMe}
                    className="absolute top-4 left-4 z-[400] bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 text-indigo-600 transition-colors"
                    title="Use My Location"
                >
                    <Locate className="h-5 w-5" />
                </button>

                {/* Search Bar */}
                <div className="absolute top-4 right-4 z-[400] w-64">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search city..."
                            className="w-full pl-3 pr-10 py-2 text-sm border border-gray-200 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/90 backdrop-blur"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600">
                            <Search className="h-4 w-4" />
                        </button>
                    </form>

                    {/* Search Results Dropdown */}
                    {searchResults.length > 0 && (
                        <ul className="mt-2 bg-white rounded-lg shadow-lg max-h-48 overflow-y-auto border border-gray-100 divide-y divide-gray-100">
                            {searchResults.map((result) => (
                                <li 
                                    key={result.place_id}
                                    onClick={() => selectSearchResult(result)}
                                    className="px-3 py-2 text-xs hover:bg-indigo-50 cursor-pointer text-gray-700 truncate"
                                    title={result.display_name}
                                >
                                    {result.display_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Confirmation Footer */}
            <div className="p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 flex-1 truncate">
                    {selectedAddress ? (
                        <>Selected: <span className="font-semibold text-gray-900">{selectedAddress}</span></>
                    ) : (
                        "Use map or search to select a location"
                    )}
                </div>
                <button
                    onClick={confirmLocation}
                    disabled={!selectedAddress}
                    className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Confirm Location
                </button>
            </div>
        </div>
    );
};

