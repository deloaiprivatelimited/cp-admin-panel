import React, { useState } from 'react';
import { X } from 'lucide-react';

function AddCollegeModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    college_id: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: '',
      zip_code: ''
    },
    notes: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: 'Lead', label: 'Lead' },
    { value: 'Fallowup', label: 'Follow Up' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'active', label: 'Active' },
    { value: 'fallowup_2', label: 'Follow Up 2' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'College name is required';
    }
    
    if (!formData.college_id.trim()) {
      newErrors.college_id = 'College ID is required';
    }
    
    if (!formData.address.line1.trim()) {
      newErrors['address.line1'] = 'Address line 1 is required';
    }
    
    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }
    
    if (!formData.address.state.trim()) {
      newErrors['address.state'] = 'State is required';
    }
    
    if (!formData.address.country.trim()) {
      newErrors['address.country'] = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        name: '',
        college_id: '',
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          country: '',
          zip_code: ''
        },
        notes: '',
        status: 'active'
      });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      college_id: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        country: '',
        zip_code: ''
      },
      notes: '',
      status: 'active'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add New College</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  College Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  style={{ focusRingColor: errors.name ? '#ef4444' : '#4CA466' }}
                  placeholder="Enter college name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="college_id" className="block text-sm font-medium text-gray-700 mb-2">
                  College ID *
                </label>
                <input
                  type="text"
                  id="college_id"
                  name="college_id"
                  value={formData.college_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 ${
                    errors.college_id ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  style={{ focusRingColor: errors.college_id ? '#ef4444' : '#4CA466' }}
                  placeholder="Enter college ID"
                />
                {errors.college_id && <p className="mt-1 text-sm text-red-600">{errors.college_id}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200"
                style={{ focusRingColor: '#4CA466' }}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
            
            <div>
              <label htmlFor="address.line1" className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1 *
              </label>
              <input
                type="text"
                id="address.line1"
                name="address.line1"
                value={formData.address.line1}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 ${
                  errors['address.line1'] ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
                style={{ focusRingColor: errors['address.line1'] ? '#ef4444' : '#4CA466' }}
                placeholder="Enter street address"
              />
              {errors['address.line1'] && <p className="mt-1 text-sm text-red-600">{errors['address.line1']}</p>}
            </div>

            <div>
              <label htmlFor="address.line2" className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                id="address.line2"
                name="address.line2"
                value={formData.address.line2}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200"
                style={{ focusRingColor: '#4CA466' }}
                placeholder="Apartment, suite, etc. (optional)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 ${
                    errors['address.city'] ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  style={{ focusRingColor: errors['address.city'] ? '#ef4444' : '#4CA466' }}
                  placeholder="Enter city"
                />
                {errors['address.city'] && <p className="mt-1 text-sm text-red-600">{errors['address.city']}</p>}
              </div>

              <div>
                <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 ${
                    errors['address.state'] ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  style={{ focusRingColor: errors['address.state'] ? '#ef4444' : '#4CA466' }}
                  placeholder="Enter state"
                />
                {errors['address.state'] && <p className="mt-1 text-sm text-red-600">{errors['address.state']}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  id="address.country"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 ${
                    errors['address.country'] ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  style={{ focusRingColor: errors['address.country'] ? '#ef4444' : '#4CA466' }}
                  placeholder="Enter country"
                />
                {errors['address.country'] && <p className="mt-1 text-sm text-red-600">{errors['address.country']}</p>}
              </div>

              <div>
                <label htmlFor="address.zip_code" className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="address.zip_code"
                  name="address.zip_code"
                  value={formData.address.zip_code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200"
                  style={{ focusRingColor: '#4CA466' }}
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 resize-none"
              style={{ focusRingColor: '#4CA466' }}
              placeholder="Enter any additional notes about the college..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ 
                backgroundColor: '#4CA466',
                focusRingColor: '#4CA466'
              }}
            >
              Add College
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCollegeModal;