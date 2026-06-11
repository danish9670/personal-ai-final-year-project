import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { Menu, X } from 'lucide-react';
import { SignIn, useUser } from '@clerk/clerk-react';
import Sidebar from '../components/Sidebar';



const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const { isSignedIn } = useUser();

  return (
    <div className="flex flex-col items-start justify-start h-screen">
      {/* NAV */}
      <nav className="w-full px-8 min-h-[64px] flex items-center justify-between p-4 border-b border-gray-200">
        <img
          className="cursor-pointer w-32 sm:w-44"
          src={assets.logo}
          alt="Logo"
          onClick={() => navigate('/')}
        />

        {sidebar ? (
          <X
            onClick={() => setSidebar(false)}
            className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer"
          />
        ) : (
          <Menu
            onClick={() => setSidebar(true)}
            className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer"
          />
        )}
      </nav>

      {/* MAIN AREA */}
      <div className="flex-1 w-full h-[calc(100vh-64px)] flex">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

        <div className="flex-1 bg-[#F4F7FB]">
          <Outlet />
        </div>
      </div>
      {/* Floating sign-in button (only if NOT signed in) */}
      {!isSignedIn && (
        <>
          <button
            onClick={() => setShowSignIn((s) => !s)}
            className="fixed bottom-6 right-6 z-40 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-md hover:shadow-lg flex items-center gap-2"
            aria-label="Open sign in"
          >
            Sign in
          </button>

          {showSignIn && (
            <div className="fixed bottom-20 right-6 z-50 w-96">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="p-2 flex justify-end">
                  <button
                    onClick={() => setShowSignIn(false)}
                    className="text-gray-500 px-2 py-1"
                    aria-label="Close sign in"
                  >
                  </button>
                </div>

                <div className="p-4">
                  <SignIn />
                </div>

              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default Layout;
