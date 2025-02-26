import { ChevronRight } from "lucide-react";

const foodItems = [
    { id: 1, name: "Pizza", image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?resize=768,574", status: "Delivered" },
    { id: 2, name: "Burger", image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?resize=768,574", status: "Preparing" },
    { id: 3, name: "Pasta", image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?resize=768,574", status: "Rejected" },
    { id: 4, name: "Sushi", image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?resize=768,574", status: "Out for Delivery" },
    { id: 5, name: "Salad", image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?resize=768,574", status: "Delivered" },
    { id: 6, name: "Tacos", image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?resize=768,574", status: "Preparing" },
];

const statusColors = {
    Delivered: "text-green-500",
    Preparing: "text-yellow-500",
    "Out for Delivery": "text-blue-500",
    Rejected: "text-red-500",
};

const FoodList = () => {
    return (
        <ul className="space-y-4 p-2">
            {foodItems.map((item) => (
                <li
                    key={item.id}
                    className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-md hover:bg-gray-100"
                >
                    <div className="flex items-center space-x-4">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                            <span className="text-lg font-medium block">{item.name}</span>
                            <span className={`text-sm font-semibold ${statusColors[item.status]}`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-500" />
                </li>
            ))}
        </ul>
    );
};

export default FoodList;