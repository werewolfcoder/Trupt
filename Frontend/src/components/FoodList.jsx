import { ChevronRight, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserDonations, getUserVolunteering } from "../services/donationService";
import { getDistance } from "../services/mapService";
import { useNavigate } from "react-router-dom";
import { fetchImage } from '../utils/imageUtils';

const BACKEND_URL = import.meta.env.VITE_BASE_URL;

const statusColors = {
    Delivered: "text-green-500",
    Preparing: "text-yellow-500",
    "Out for Delivery": "text-blue-500",
    Rejected: "text-red-500",
    accepted: "text-emerald-500",
    pending: "text-gray-500"
};

const statusDisplayNames = {
    accepted: "Accepted",
    pending: "Pending"
};

const FoodList = ({ onFoodClick, filter, currentUserId }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [myDonations, setMyDonations] = useState([]);
    const [acceptedDonations, setAcceptedDonations] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [distances, setDistances] = useState({});
    const [imageUrls, setImageUrls] = useState({});

    useEffect(() => {
        const fetchAllDonations = async () => {
            try {
                setIsLoading(true);
                const [donationsRes, volunteeringRes] = await Promise.all([
                    getUserDonations(),
                    getUserVolunteering(currentUserId)
                ]);
                
                setMyDonations(donationsRes);
                setAcceptedDonations(volunteeringRes);
            } catch (err) {
                setError('Failed to fetch donations');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUserId) {
            fetchAllDonations();
        }
    }, [currentUserId]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => console.error('Error getting location:', error)
        );
    }, []);

    useEffect(() => {
        const calculateDistances = async () => {
            if (!userLocation || !acceptedDonations.length) return;

            const newDistances = {};
            for (const donation of acceptedDonations) {
                if (donation.locationELoc) {
                    const distance = await getDistance(
                        { eloc: donation.locationELoc },
                        { lat: userLocation.lat, lng: userLocation.lng }
                        
                    );
                    if (distance) {
                        newDistances[donation._id] = distance;
                    }
                }
            }
            setDistances(newDistances);
        };

        calculateDistances();
    }, [userLocation, acceptedDonations]);

    useEffect(() => {
        const loadImages = async () => {
            const donations = filter === 'donations' ? myDonations : acceptedDonations;
            const newImageUrls = {};
            
            for (const donation of donations) {
                if (donation.imageUrl) {
                    const url = await fetchImage(donation.imageUrl);
                    if (url) {
                        newImageUrls[donation._id] = url;
                    }
                }
            }
            
            setImageUrls(prev => ({...prev, ...newImageUrls}));
        };

        loadImages();

        // Cleanup function
        return () => {
            // Revoke all object URLs on unmount
            Object.values(imageUrls).forEach(url => URL.revokeObjectURL(url));
        };
    }, [myDonations, acceptedDonations, filter]);

    const handleTrackClick = (e, donationId) => {
        e.stopPropagation();
        navigate(`/tracking/${donationId}`);
    };

    const formatDistance = (distance) => {
        if (!distance) return '';
        if (distance < 1) return `${Math.round(distance * 1000)}m away`;
        return `${distance} away`;
    };

    const renderDonationItem = (item) => (
        <li
            key={item._id}
            className="flex items-center justify-between bg-white p-3 rounded-xl shadow-md hover:bg-gray-100 transition cursor-pointer"
            onClick={() => onFoodClick(item)}
        >
            <div className="flex items-center space-x-3">
                <img
                    src={item.imageUrl ? `${import.meta.env.VITE_BASE_URL}${item.imageUrl}` : '/default-food-image.png'}
                    alt={item.foodName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-food-image.png';
                    }}
                />
                <div>
                    <span className="text-md font-medium block">
                        {item.foodName}
                    </span>
                    <div className="flex items-center space-x-2">
                        <span className={`text-xs font-semibold ${statusColors[item.status] || 'text-gray-500'}`}>
                            {statusDisplayNames[item.status] || item.status || 'Pending'}
                        </span>
                        {filter === 'volunteering' && distances[item._id] && (
                            <span className="text-xs text-blue-500">
                                {formatDistance(distances[item._id])}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {item.status === 'accepted' && (
                    <button
                        onClick={(e) => handleTrackClick(e, item._id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1"
                    >
                        <MapPin className="w-4 h-4" />
                        Track
                    </button>
                )}
                <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
        </li>
    );

    if (isLoading) return <div className="flex justify-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="space-y-6">
            {filter === 'donations' && (
                <div>
                    <h2 className="text-lg font-semibold mb-3">My Donations</h2>
                    <ul className="space-y-3">
                        {myDonations.length > 0 ? (
                            myDonations.map(renderDonationItem)
                        ) : (
                            <p className="text-gray-500 text-center py-4">No donations made yet</p>
                        )}
                    </ul>
                </div>
            )}

            {filter === 'volunteering' && (
                <div>
                    <h2 className="text-lg font-semibold mb-3">Accepted Donations</h2>
                    <ul className="space-y-3">
                        {acceptedDonations.length > 0 ? (
                            acceptedDonations.map(renderDonationItem)
                        ) : (
                            <p className="text-gray-500 text-center py-4">No accepted donations yet</p>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FoodList;