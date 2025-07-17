import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Music, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                Music Manager
              </span>
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 p-2 rounded-full">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:block">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
