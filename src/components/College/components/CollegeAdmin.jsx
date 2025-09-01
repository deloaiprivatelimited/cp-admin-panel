import React, { useState } from 'react';
import { Plus, Edit3, Trash2, ToggleLeft, ToggleRight, X, Save, Key } from 'lucide-react';

function CollegeAdmin() {
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: 'Dr. Emily Carter',
      email: 'emily.carter@college.edu',
      phone: '+1 (555) 123-4567',
      designation: 'Dean of Students',
      status: 'active'
    },
    {
      id: 2,
      name: 'Prof. Michael Rodriguez',
      email: 'michael.rodriguez@college.edu',
      phone: '+1 (555) 987-6543',
      designation: 'Academic Director',
      status: 'inactive'
    },
    {
      id: 3,
      name: 'Dr. Sarah Thompson',
      email: 'sarah.thompson@college.edu',
      phone: '+1 (555) 456-7890',
      designation: 'Registrar',
      status: 'active'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [passwordAdmin, setPasswordAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    designation: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAdmin = () => {
    if (formData.name && formData.email && formData.password && formData.phone && formData.designation) {
      const newAdmin = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        designation: formData.designation,
        status: 'active'
      };
      setAdmins([...admins, newAdmin]);
      setFormData({ name: '', email: '', password: '', phone: '', designation: '' });
      setShowAddModal(false);
    }
  };

  const handleEditAdmin = () => {
    if (formData.name && formData.email && formData.phone && formData.designation) {
      setAdmins(admins.map(admin => 
        admin.id === editingAdmin.id 
          ? { 
              ...admin, 
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              designation: formData.designation
            }
          : admin
      ));
      setShowEditModal(false);
      setEditingAdmin(null);
      setFormData({ name: '', email: '', password: '', phone: '', designation: '' });
    }
  };

  const handleUpdatePassword = () => {
    if (passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword) {
      // In a real app, you would make an API call here
      setShowPasswordModal(false);
      setPasswordAdmin(null);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const handleDeleteAdmin = (id) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };

  const handleToggleStatus = (id) => {
    setAdmins(admins.map(admin => 
      admin.id === id 
        ? { ...admin, status: admin.status === 'active' ? 'inactive' : 'active' }
        : admin
    ));
  };

  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      phone: admin.phone,
      designation: admin.designation
    });
    setShowEditModal(true);
  };

  const openPasswordModal = (admin) => {
    setPasswordAdmin(admin);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowPasswordModal(false);
    setEditingAdmin(null);
    setPasswordAdmin(null);
    setFormData({ name: '', email: '', password: '', phone: '', designation: '' });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Details</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#4CA466] hover:bg-[#3d8352] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Admin
          </button>
        </div>

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map((admin) => (
            <div key={admin.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 relative">
              {/* Action Icons */}
              <div className="absolute top-4 right-4 flex gap-1">
                <button
                  onClick={() => handleToggleStatus(admin.id)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors duration-200"
                  title={`${admin.status === 'active' ? 'Deactivate' : 'Activate'} admin`}
                >
                  {admin.status === 'active' ? (
                    <ToggleRight size={16} className="text-[#4CA466]" />
                  ) : (
                    <ToggleLeft size={16} className="text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => openPasswordModal(admin)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors duration-200"
                  title="Update password"
                >
                  <Key size={16} className="text-gray-600 hover:text-[#4CA466]" />
                </button>
                <button
                  onClick={() => openEditModal(admin)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors duration-200"
                  title="Edit admin"
                >
                  <Edit3 size={16} className="text-gray-600 hover:text-[#4CA466]" />
                </button>
                <button
                  onClick={() => handleDeleteAdmin(admin.id)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors duration-200"
                  title="Delete admin"
                >
                  <Trash2 size={16} className="text-gray-600 hover:text-red-500" />
                </button>
              </div>

              {/* Admin Info */}
              <div className="pr-24">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{admin.name}</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {admin.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> {admin.phone}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Role:</span> {admin.designation}
                  </p>
                  <div className="mt-3">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      admin.status === 'active' 
                        ? 'bg-[#4CA466] bg-opacity-10 text-[#fff]' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Admin Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Add New Admin</h2>
                  <button
                    onClick={closeModals}
                    className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter designation"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={closeModals}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAdmin}
                    className="flex-1 bg-[#4CA466] hover:bg-[#3d8352] text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Save Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Admin Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Edit Admin</h2>
                  <button
                    onClick={closeModals}
                    className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter designation"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={closeModals}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditAdmin}
                    className="flex-1 bg-[#4CA466] hover:bg-[#3d8352] text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Update Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Update Password</h2>
                  <button
                    onClick={closeModals}
                    className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Admin:</span> {passwordAdmin?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {passwordAdmin?.email}
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Confirm new password"
                    />
                  </div>
                  {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-red-500 text-sm">Passwords do not match</p>
                  )}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={closeModals}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdatePassword}
                    disabled={!passwordData.newPassword || !passwordData.confirmPassword || passwordData.newPassword !== passwordData.confirmPassword}
                    className="flex-1 bg-[#4CA466] hover:bg-[#3d8352] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Key size={18} />
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {admins.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No admins yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first admin.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#4CA466] hover:bg-[#3d8352] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add Your First Admin
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CollegeAdmin;