import { useState, useEffect } from 'react';
import L from 'leaflet';
import { toast } from 'react-hot-toast';

// Fix Leaflet's default icon path issues with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationState {
    position: L.LatLng | null;
    center: L.LatLngExpression;
    zoom: number;
    selectedAddress: string;
}

export const useLocationPicker = (onLocationSelect: (location: string) => void) => {
    const [mapState, setMapState] = useState<LocationState>({
        position: null,
        center: [20.5937, 78.9629], // Default India center
        zoom: 5,
        selectedAddress: ''
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Helpers
    const fetchAddress = async (lat: number, lng: number): Promise<string> => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            const address = data.address;
            
            // Prioritize city-level names
            return address.city || address.town || address.village || address.municipality || address.county || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
    };

    const updatePosition = async (lat: number, lng: number, newZoom: number) => {
        const latLng = new L.LatLng(lat, lng);
        const address = await fetchAddress(lat, lng);
        
        setMapState(prev => ({
            ...prev,
            center: [lat, lng],
            position: latLng,
            zoom: newZoom,
            selectedAddress: address
        }));
    };

    // Actions
    const handleMapClick = async (latlng: L.LatLng) => {
        await updatePosition(latlng.lat, latlng.lng, mapState.zoom);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=5`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Search failed:", error);
            toast.error("Location search failed");
        } finally {
            setIsSearching(false);
        }
    };

    const selectSearchResult = (result: any) => {
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        const name = result.display_name.split(',')[0];

        setMapState({
            center: [lat, lon],
            position: new L.LatLng(lat, lon),
            zoom: 14,
            selectedAddress: name
        });
        
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                await updatePosition(pos.coords.latitude, pos.coords.longitude, 16);
            },
            () => {
                toast.error("Could not get your location. Please check permissions.");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    // Initialize user location on mount (without setting selected address/marker aggressively if unwanted? 
    // Original logic: "Just center, don't select" but setPosition WAS called. 
    // We will mimic original logic: it DID set position and address.)
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                   await updatePosition(pos.coords.latitude, pos.coords.longitude, 13);
                },
                (err) => console.error("Initial geolocation error:", err),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    }, []);

    const confirmLocation = () => {
        if (mapState.selectedAddress) {
            onLocationSelect(mapState.selectedAddress);
        } else {
            toast.error("Please select a location on the map first.");
        }
    };

    return {
        mapState,
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        handleMapClick,
        handleSearch,
        selectSearchResult,
        handleLocateMe,
        confirmLocation,
        setMapState // exposed for ChangeView or direct manipulation if needed
    };
};
