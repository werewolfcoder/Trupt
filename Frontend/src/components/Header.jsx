// import React from 'react';

// const Header = () => {
//     return(
//         <div>
//             <header className='bg-emerald-500 text-white p-4'>
//                 <h1 className='text-2xl font-bold'>Trupt</h1>


//             </header>
//         </div>
//     );
// };
// export default Header;
import React from 'react';
import { Home, Users, Bell, PlusCircle, User } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-emerald-500 text-white p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Trupt</h1>
            {/* Desktop Navigation */}
            <nav className="hidden sm:flex space-x-6 items-center">
                <Home className="w-6 h-6 hover:text-blue-200" />
                <Users className="w-6 h-6 hover:text-blue-200" />
                <PlusCircle className="w-6 h-6 hover:text-blue-200" />
                <Bell className="w-6 h-6 hover:text-blue-200" />
                <User className="w-6 h-6 hover:text-blue-200" />
            </nav>
        </header>
    );
};

export default Header;
