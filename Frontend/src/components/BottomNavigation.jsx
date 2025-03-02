import { Home, Users, Bell, PlusCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { DonationContext } from "../context/DonationContext";

const BottomNavigation = () => {
  const location = useLocation();
  const { unreadCount } = useContext(DonationContext);

  if (location.pathname === "/add") {
    return null;
  }

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 py-2 z-50">
      <ul className="flex justify-around items-center">
        <li>
          <Link 
            to="/" 
            className={`flex flex-col items-center ${
              location.pathname === "/" ? "text-emerald-600" : "text-gray-500 hover:text-emerald-600"
            }`}
          >
            <Home className="w-6 h-6" />
          </Link>
        </li>
        <li>
          <Link 
            to="/community" 
            className={`flex flex-col items-center ${
              location.pathname === "/community" ? "text-emerald-600" : "text-gray-500 hover:text-emerald-600"
            }`}
          >
            <Users className="w-6 h-6" />
          </Link>
        </li>
        <li>
          <Link to="/add">
            <button className="bg-green-500 text-white rounded-full w-16 h-16 shadow-2xl hover:bg-green-600 flex items-center justify-center">
              <PlusCircle className="w-8 h-8" />
            </button>
          </Link>
        </li>
        <li className="relative">
          <Link 
            to="/notifications" 
            className={`flex flex-col items-center ${
              location.pathname === "/notifications" ? "text-emerald-600" : "text-gray-500 hover:text-emerald-600"
            }`}
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        </li>
        <li>
          <Link 
            to="/profile" 
            className={`flex flex-col items-center ${
              location.pathname === "/profile" ? "text-emerald-600" : "text-gray-500 hover:text-emerald-600"
            }`}
          >
            <User className="w-6 h-6" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNavigation;