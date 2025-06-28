import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 shadow-sm">
      <div className="flex items-center space-x-6">
        <NavLink to="/" className="font-bold text-xl text-blue-600 hover:text-blue-800">
          SwapnLearn
        </NavLink>
        
        {user && (
          <div className="flex space-x-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/connections" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
                }`
              }
            >
              Connections
            </NavLink>
            <NavLink 
              to="/connection-requests" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
                }`
              }
            >
              Requests
            </NavLink>
            <NavLink 
              to="/edit-profile" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
                }`
              }
            >
              Edit Profile
            </NavLink>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600">Hello, {user.username}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink 
              to="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Login
            </NavLink>
            <NavLink 
              to="/signup"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
            >
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;