import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100">
      <div className="font-bold text-lg">LearnnSwap</div>
      <div>
        {user ? (
          <>
            <span className="mr-4">Hello, {user.username}</span>
            <button className="btn btn-sm btn-outline" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <a href="/login" className="btn btn-sm btn-link">Login</a>
            <a href="/signup" className="btn btn-sm btn-link">Sign Up</a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;