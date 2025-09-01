import React, { useState ,useEffect} from 'react';
import { X } from 'lucide-react';
import { showSuccess } from '../../utils/toast';
import { showError } from '../../utils/toast';


// import { privateAxios } from '../../utils/axios';
import { privateAxios } from '../../utils/axios';
function UpdatePermissions({ isOpen, onClose ,admin }) {
    const [error, setError] = useState('');

  const [permissions, setPermissions] = useState({
    admins: false,
    colleges: false,
    questions: {
      mcq: false,
      rearrange: false,
      coding: false
    },
    courses: false
  });

   useEffect(() => {
    if (admin?.permissions) {
      setPermissions(admin.permissions);
    }
  }, [admin]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await privateAxios.put(`/admin/${admin.id}/permissions`, {
        permissions
      });

      if (response.data.success) {
        showSuccess(response.data.message)
        console.log('Permissions updated successfully');
        onClose();
      } else {
        showError(response.data.message )
        // setError(response.data.message || 'Failed to update permissions');
      }
    } catch (err) {
      console.error(err);
      showError(err)
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handlePermissionChange = (key, value) => {
    if (key.includes('.')) {
      // Handle nested permissions (questions.mcq, questions.rearrange, questions.coding)
      const [parent, child] = key.split('.');
      setPermissions(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      // Handle top-level permissions
      setPermissions(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };


  if (!isOpen) return null;

  return (
    
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
        {error && (
  <p className="text-red-500 text-sm mb-2">{error}</p>
)}

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Permissions</h2>
          <p className="text-gray-600">Configure user access permissions</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Main Permissions
            </h3>
            
            {/* Admins */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="admins"
                checked={permissions.admins}
                onChange={(e) => handlePermissionChange('admins', e.target.checked)}
                className="w-5 h-5 text-[#4CA466] bg-gray-100 border-gray-300 rounded focus:ring-[#4CA466] focus:ring-2"
              />
              <label htmlFor="admins" className="ml-3 text-sm font-medium text-gray-700">
                Admins
              </label>
            </div>

            {/* Colleges */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="colleges"
                checked={permissions.colleges}
                onChange={(e) => handlePermissionChange('colleges', e.target.checked)}
                className="w-5 h-5 text-[#4CA466] bg-gray-100 border-gray-300 rounded focus:ring-[#4CA466] focus:ring-2"
              />
              <label htmlFor="colleges" className="ml-3 text-sm font-medium text-gray-700">
                Colleges
              </label>
            </div>

            {/* Courses */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="courses"
                checked={permissions.courses}
                onChange={(e) => handlePermissionChange('courses', e.target.checked)}
                className="w-5 h-5 text-[#4CA466] bg-gray-100 border-gray-300 rounded focus:ring-[#4CA466] focus:ring-2"
              />
              <label htmlFor="courses" className="ml-3 text-sm font-medium text-gray-700">
                Courses
              </label>
            </div>
          </div>

          {/* Questions Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Questions Permissions
            </h3>
            
            {/* MCQ */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mcq"
                checked={permissions.questions.mcq}
                onChange={(e) => handlePermissionChange('questions.mcq', e.target.checked)}
                className="w-5 h-5 text-[#4CA466] bg-gray-100 border-gray-300 rounded focus:ring-[#4CA466] focus:ring-2"
              />
              <label htmlFor="mcq" className="ml-3 text-sm font-medium text-gray-700">
                MCQ Questions
              </label>
            </div>

            {/* Rearrange */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rearrange"
                checked={permissions.questions.rearrange}
                onChange={(e) => handlePermissionChange('questions.rearrange', e.target.checked)}
                className="w-5 h-5 text-[#4CA466] bg-gray-100 border-gray-300 rounded focus:ring-[#4CA466] focus:ring-2"
              />
              <label htmlFor="rearrange" className="ml-3 text-sm font-medium text-gray-700">
                Rearrange Questions
              </label>
            </div>

            {/* Coding */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="coding"
                checked={permissions.questions.coding}
                onChange={(e) => handlePermissionChange('questions.coding', e.target.checked)}
                className="w-5 h-5 text-[#4CA466] bg-gray-100 border-gray-300 rounded focus:ring-[#4CA466] focus:ring-2"
              />
              <label htmlFor="coding" className="ml-3 text-sm font-medium text-gray-700">
                Coding Questions
              </label>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-[#4CA466] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#3d8751] focus:ring-2 focus:ring-[#4CA466] focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg mt-8"
          >
            Update Permissions
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePermissions;