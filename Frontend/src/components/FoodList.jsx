import { ChevronRight } from "lucide-react";

const foodItems = [
    { id: 1, name: "Pizza", image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?resize=768,574", status: "Delivered", freshness: 4, emergency: "1-2 hours", location: "123 Street", distance: "2.5 km" },
    { id: 2, name: "Burger", image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?resize=768,574", status: "Preparing", freshness: 3, emergency: "4-6 hours", location: "456 Avenue", distance: "1.8 km" },
    { id: 3, name: "Pasta", image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?resize=768,574", status: "Rejected", freshness: 2, emergency: "4-6 hours", location: "789 Road", distance: "3.4 km" },
    { id: 4, name: "Sushi", image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?resize=768,574", status: "Out for Delivery", freshness: 5, emergency: "1-2 hours", location: "101 Avenue", distance: "1.2 km" },
];


const statusColors = {
    Delivered: "text-green-500",
    Preparing: "text-yellow-500",
    "Out for Delivery": "text-blue-500",
    Rejected: "text-red-500",
};

const FoodList = ({ onFoodClick }) => {
    return (
        <ul className="space-y-3 p-2">
            {foodItems.map((item) => (
                <li
                    key={item.id}
                    className="flex items-center justify-between bg-white p-3 rounded-xl shadow-md hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => onFoodClick(item)}
                >
                    <div className="flex items-center space-x-3">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                            <span className="text-md font-medium block">{item.name}</span>
                            <span className={`text-xs font-semibold ${statusColors[item.status]}`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                </li>
            ))}
        </ul>
    );
};

export default FoodList;