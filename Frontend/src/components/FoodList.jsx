import { ChevronRight } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { getUserDonations } from "../services/donationService";
import { UserDataContext } from "../context/UserContext";

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

const FoodList = ({ 
    onFoodClick, 
    filter, 
    userDonations, 
    setUserDonations, // Add this prop
    availableDonations, 
    currentUserId 
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getStatusText = (item) => {
        return statusDisplayNames[item.status] || item.status || 'Pending';
    };

    useEffect(() => {
        const fetchUserDonations = async () => {
            try {
                setIsLoading(true);
                const data = await getUserDonations();
                if (setUserDonations) {  // Only call if prop exists
                    setUserDonations(data);
                }
            } catch (err) {
                setError('Failed to fetch donations');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUserId && filter === 'donations') {
            fetchUserDonations();
        } else {
            setIsLoading(false);
        }
    }, [currentUserId, filter, setUserDonations]);

    if (isLoading) {
        return <div className="flex justify-center p-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    // Choose which donations to display based on filter
    const displayDonations = filter === 'donations' ? userDonations : availableDonations;

    return (
        <ul className="space-y-3 p-2">
            {displayDonations.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    {filter === 'donations' 
                        ? 'No donations made yet' 
                        : 'No available donations found'}
                </div>
            ) : (
                displayDonations.map((item) => (
                    <li
                        key={item._id}
                        className="flex items-center justify-between bg-white p-3 rounded-xl shadow-md hover:bg-gray-100 transition cursor-pointer"
                        onClick={() => onFoodClick(item)}
                    >
                        <div className="flex items-center space-x-3">
                            <img
                                src={`${import.meta.env.VITE_BASE_URL}${item.imageUrl}`}
                                alt={item.foodName}
                                className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                                <span className="text-md font-medium block">
                                    {item.foodName}
                                </span>
                                <div className="flex items-center space-x-2">
                                    <span className={`text-xs font-semibold ${statusColors[item.status] || 'text-gray-500'}`}>
                                        {getStatusText(item)}
                                    </span>
                                    {item.user._id === currentUserId && (
                                        <span className="text-xs text-blue-500">
                                            (Your donation)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                    </li>
                ))
            )}
        </ul>
    );
};

export default FoodList;