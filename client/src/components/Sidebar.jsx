import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { House, Users  } from 'lucide-react';

const navItems = [
  { to: '/ai/dashboard', label: 'Dashboard', Icon: House },
  { to: '/ai/community', label: 'Community', Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const initials =
    user?.firstName?.[0] || user?.fullName?.[0] || (user?.username?.[0] ?? 'U');
  const fullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center
        sm:static sm:translate-x-0 absolute top-14 left-0
        ${sidebar ? 'translate-x-0' : '-translate-x-full'} transform transition-transform duration-200`}
    >
      <div className="my-7 w-full px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg font-semibold">
            {initials}
          </div>
          <div>
            <h1 className="text-sm font-medium">{fullName || 'Sartaj'}</h1>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600 font-medium">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `block px-3.5 py-2 rounded mb-2 flex items-center gap-3 ${
                  isActive ? 'bg-gradient-to-r from-[#3C81f6] to-[#9234EA] text-white' : 'text-gray-700'
                }`
              }
            >
              
              {/* Use the Icon component */}
              {/* <Icon className='w-4 h-4' /> */}
              {label}
              
            </NavLink>
            
          ))}
        </div>
      </div>

      <div className="w-full px-4 py-4 border-t border-gray-100">
        <button onClick={() => signOut()} className="w-full text-left text-sm text-gray-600">
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
