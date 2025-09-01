import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { privateAxios } from '../../utils/axios';

function UpdatePassword({ isOpen, onClose,admin }) {
    console.log(admin)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (password.length < 8) {
    setError('Password must be at least 8 characters long');
    return;
  }

  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  try {
    // API call to update password
    const response = await privateAxios.put(`/admin/${admin.id}/password`, {
      password,
    });

    if (response.data.success) {
      console.log('Password updated successfully');

      // Reset form and close popup
      setPassword('');
      setConfirmPassword('');
      setError('');
      onClose();
    } else {
      setError(response.data.message || 'Something went wrong');
    }
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || 'Failed to update password');
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Password</h2>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CA466] focus:border-transparent transition-all duration-200 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CA466] focus:border-transparent transition-all duration-200 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-[#4CA466] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#3d8751] focus:ring-2 focus:ring-[#4CA466] focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Update Password
          </button>
        </form>

        {/* Password requirements */}
        <div className="mt-6 text-xs text-gray-500 text-center">
          Password must be at least 8 characters long
        </div>
      </div>
    </div>
  );
}

export default UpdatePassword;