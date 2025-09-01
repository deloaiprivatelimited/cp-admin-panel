import React from 'react';
import { LogOut, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';
function NoPermissions() {
      const { auth, logout, hasPermission } = useAuth();
    
 const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 leading-relaxed">
            You don't have any permissions to access this application. 
            Please contact your administrator to request access.
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-[#4CA466] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#3d8751] focus:ring-2 focus:ring-[#4CA466] focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

        {/* Contact Info */}
        <div className="mt-6 text-sm text-gray-500">
          Need help? Contact your system administrator
        </div>
      </div>
    </div>
  );
}

export default NoPermissions;