import { Bell, CheckCircle, AlertTriangle } from "lucide-react";

const notifications = [
    {
        id: 1,
        type: "success",
        message: "Your food donation was successfully accepted!",
        time: "2 hours ago",
    },
    {
        id: 2,
        type: "warning",
        message: "Reminder: You have a pending donation pickup tomorrow.",
        time: "6 hours ago",
    },
    {
        id: 3,
        type: "success",
        message: "You received 5 likes on your latest donation post.",
        time: "1 day ago",
    },
    {
        id: 4,
        type: "warning",
        message: "A donation you requested was rejected.",
        time: "3 days ago",
    },
];

const iconMap = {
    success: <CheckCircle className="w-6 h-6 text-green-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
};

const NotificationsPage = () => {
    return (
        <div className="p-5">
            <h2 className="text-2xl font-semibold text-emerald-600 mb-4 flex items-center">
                <Bell className="w-6 h-6 mr-2" /> Notifications
            </h2>
            <ul className="space-y-4">
                {notifications.map((notif) => (
                    <li
                        key={notif.id}
                        className="flex items-center justify-between bg-white rounded-2xl shadow p-4 hover:bg-gray-100"
                    >
                        <div className="flex items-center space-x-4">
                            {iconMap[notif.type]}
                            <div>
                                <p className="text-gray-800 font-medium">{notif.message}</p>
                                <span className="text-sm text-gray-400">{notif.time}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationsPage;
