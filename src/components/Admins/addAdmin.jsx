import React, { useState } from 'react';
import { privateAxios } from '../../utils/axios';
import { showSuccess, showError } from '../../utils/toast';
function AddAdminModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    permissions: {
      admins: false,
      colleges: false,
      courses: false,
      questions: {
        coding: false,
        mcq: false,
        rearrange: false
      }
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (path, value) => {
    setFormData(prev => {
      const newPermissions = { ...prev.permissions };
      if (path.includes('.')) {
        const [parent, child] = path.split('.');
        newPermissions[parent] = {
          ...newPermissions[parent],
          [child]: value
        };
      } else {
        newPermissions[path] = value;
      }
      return {
        ...prev,
        permissions: newPermissions
      };
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Send the formData directly, not wrapped in an extra object
    const response = await privateAxios.post(`/admin/`, formData);

    if (response.data.success) {
      showSuccess(response.data.success);

      // Optionally, reset the form
      setFormData({
        name: '',
        email: '',
        password: '',
        permissions: {
          admins: false,
          colleges: false,
          courses: false,
          questions: {
            coding: false,
            mcq: false,
            rearrange: false,
          },
        },
      });

      onClose();
    } else {
      // Handle API returning success: false
      showError(response.data.message || "Failed to add admin");
    }
  } catch (error) {
    // Handle network or server errors
    if (error.response && error.response.data && error.response.data.message) {
      showError(error.response.data.message);
    } else {
      showError("Something went wrong. Please try again.");
    }
  }

  console.log("Admin data submitted:", formData);
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Add New Admin</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter email address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Enter password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Permissions
              </label>
              <div className="space-y-3">
                {['admins', 'colleges', 'courses'].map((permission) => (
                  <div key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      id={permission}
                      checked={formData.permissions[permission]}
                      onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                      className="w-4 h-4 rounded focus:ring-green-500 border-gray-300"
                      style={{ accentColor: '#4CA466' }}
                    />
                    <label htmlFor={permission} className="ml-3 text-sm text-gray-700 capitalize">
                      {permission}
                    </label>
                  </div>
                ))}

                <div className="border-l-2 border-gray-200 pl-4 ml-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">Questions</div>
                  <div className="space-y-2">
                    {Object.keys(formData.permissions.questions).map((questionType) => (
                      <div key={questionType} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`questions.${questionType}`}
                          checked={formData.permissions.questions[questionType]}
                          onChange={(e) => handlePermissionChange(`questions.${questionType}`, e.target.checked)}
                          className="w-4 h-4 rounded focus:ring-green-500 border-gray-300"
                          style={{ accentColor: '#4CA466' }}
                        />
                        <label htmlFor={`questions.${questionType}`} className="ml-3 text-sm text-gray-700 capitalize">
                          {questionType === 'mcq' ? 'MCQ' : questionType}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium shadow-sm"
                style={{ backgroundColor: '#4CA466' }}
              >
                Add Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAdminModal;