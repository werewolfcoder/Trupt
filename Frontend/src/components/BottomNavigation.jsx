// import REact from 'react';
// import { Home, Users, Bell, PlusCircle, User } from 'lucide-react';
// const BottomNavigation = () => {
//     return (
//         <nav className="fixed bottom-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 z-50">
//             <ul className="flex justify-around items-center">
//                 <li className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
//                     <Home className="w-6 h-6" />

//                 </li>
//                 <li className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
//                     <Users className="w-6 h-6" />

//                 </li>
//                 <li className="flex justify-center items-center">
//                     <button className="flex items-center justify-center bg-green-500 text-white rounded-full w-16 h-16 shadow-2xl hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300">
//                         <PlusCircle className="w-8 h-8" />
//                     </button>
//                 </li>
//                 <li className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
//                     <Bell className="w-6 h-6" />
//                 </li>
//                 <li className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500">
//                     <User className="w-6 h-6" />

//                 </li>
//             </ul>
//         </nav>
//     );
// };
// export default BottomNavigation
import { Home, Users, Bell, PlusCircle, User } from "lucide-react";
import { Link } from "react-router-dom";

const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 py-2 z-50">
      <ul className="flex justify-around items-center">
        <li>
          <Link to="/" className="flex flex-col items-center text-gray-500 hover:text-blue-600">
            <Home className="w-6 h-6" />
          </Link>
        </li>
        <li>
          <Link to="/community" className="flex flex-col items-center text-gray-500 hover:text-blue-600">
            <Users className="w-6 h-6" />
          </Link>
        </li>
        <li>
          <Link to="/add">
            <button className="bg-green-500 text-white rounded-full w-16 h-16 shadow-2xl hover:bg-green-600">
              <PlusCircle className="w-8 h-8" />
            </button>
          </Link>
        </li>
        <li>
          <Link to="/notifications" className="flex flex-col items-center text-gray-500 hover:text-blue-600">
            <Bell className="w-6 h-6" />
          </Link>
        </li>
        <li>
          <Link to="/profile" className="flex flex-col items-center text-gray-500 hover:text-blue-600">
            <User className="w-6 h-6" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNavigation;
