import React, { useState } from 'react';
import { Plus, Edit3, Trash2, ToggleLeft, ToggleRight, X, Save, Key } from 'lucide-react';
import { privateAxios } from '../../../utils/axios';
import { showSuccess, showError } from '../../../utils/toast';

function CollegeAdmin({ college }) {
  const [admins, setAdmins] = useState(college?.admins || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingAdminIndex, setEditingAdminIndex] = useState(null);
  const [passwordAdminIndex, setPasswordAdminIndex] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', designation: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleAddAdmin = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.designation) return;
    try {
      const res = await privateAxios.post(`/colleges/${college.id}/admins`, formData);
      setAdmins(res.data.data); // update local state
      setFormData({ name: '', email: '', password: '', phone: '', designation: '' });
      setShowAddModal(false);
      showSuccess(res.data.message);
    } catch (err) {
      showError(err.response?.data?.message || err.message);
    }
  };

  const openEditModal = (index) => {
    const admin = admins[index];
    setEditingAdminIndex(index);
    setFormData({ name: admin.name, email: admin.email, password: '', phone: admin.phone, designation: admin.designation });
    setShowEditModal(true);
  };

  const handleEditAdmin = async () => {
    if (editingAdminIndex === null) return;
    try {
      const admin = admins[editingAdminIndex];
      const res = await privateAxios.put(`/colleges/${college.id}/admins/${admin.id}`, formData);
      setAdmins(res.data.data); // update local state
      setFormData({ name: '', email: '', password: '', phone: '', designation: '' });
      setShowEditModal(false);
      setEditingAdminIndex(null);
      showSuccess(res.data.message);
    } catch (err) {
      showError(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteAdmin = async (index) => {
    const admin = admins[index];
    try {
      const res = await privateAxios.delete(`/colleges/${college.id}/admins/${admin.id}`);
      setAdmins(res.data.data); // update local state
      showSuccess(res.data.message);
    } catch (err) {
      showError(err.response?.data?.message || err.message);
    }
  };

  const handleToggleStatus = async (index) => {
    const admin = admins[index];
    try {
      const res = await privateAxios.patch(`/colleges/${college.id}/admins/${admin.id}/toggle-status`);
      setAdmins(res.data.data); // update local state
      showSuccess(res.data.message);
    } catch (err) {
      showError(err.response?.data?.message || err.message);
    }
  };

  const openPasswordModal = (index) => {
    setPasswordAdminIndex(index);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordModal(true);
  };

  const handleUpdatePassword = async () => {
    if (passwordAdminIndex === null) return;
    if (!passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword) return;

    const admin = admins[passwordAdminIndex];
    try {
      const res = await privateAxios.patch(`/colleges/${college.id}/admins/${admin.id}/update-password`, passwordData);
      setShowPasswordModal(false);
      setPasswordAdminIndex(null);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showSuccess(res.data.message);
    } catch (err) {
      showError(err.response?.data?.message || err.message);
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowPasswordModal(false);
    setEditingAdminIndex(null);
    setPasswordAdminIndex(null);
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
            <Plus size={20} /> Add Admin
          </button>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.length === 0 ? (
    <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-md">
      <p className="text-gray-500 mb-4 text-lg">No admins found.</p>
      <button
        onClick={() => setShowAddModal(true)}
        className="bg-[#4CA466] hover:bg-[#3d8352] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
      >
        <Plus size={20} /> Add Admin
      </button>
    </div>
  )  :(admins.map((admin, index) => (
            <div key={admin.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 relative">
              <div className="absolute top-4 right-4 flex gap-1">
                <button onClick={() => handleToggleStatus(index)} title={`${admin.status === 'active' ? 'Deactivate' : 'Activate'} admin`} className="p-1 hover:bg-gray-100 rounded transition-colors duration-200">
                  {admin.status === 'active' ? <ToggleRight size={16} className="text-[#4CA466]" /> : <ToggleLeft size={16} className="text-gray-400" />}
                </button>
                <button onClick={() => openPasswordModal(index)} title="Update password" className="p-1 hover:bg-gray-100 rounded transition-colors duration-200">
                  <Key size={16} className="text-gray-600 hover:text-[#4CA466]" />
                </button>
                <button onClick={() => openEditModal(index)} title="Edit admin" className="p-1 hover:bg-gray-100 rounded transition-colors duration-200">
                  <Edit3 size={16} className="text-gray-600 hover:text-[#4CA466]" />
                </button>
                <button onClick={() => handleDeleteAdmin(index)} title="Delete admin" className="p-1 hover:bg-gray-100 rounded transition-colors duration-200">
                  <Trash2 size={16} className="text-gray-600 hover:text-red-500" />
                </button>
              </div>
              <div className="pr-24">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{admin.name}</h3>
                <p className="text-gray-600"><span className="font-medium">Email:</span> {admin.email}</p>
                <p className="text-gray-600"><span className="font-medium">Phone:</span> {admin.phone}</p>
                <p className="text-gray-600"><span className="font-medium">Role:</span> {admin.designation}</p>
                <div className="mt-3">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${admin.status === 'active' ? 'bg-[#4CA466] bg-opacity-10 text-[#ffffff]' : 'bg-gray-100 text-gray-500'}`}>
                    {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))) }
        </div>

        {/* Add/Edit Modals */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{showAddModal ? 'Add New Admin' : 'Edit Admin'}</h2>
                  <button onClick={closeModals} className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"><X size={24} className="text-gray-500" /></button>
                </div>
                <div className="space-y-4">
                  {['name','email','password','phone','designation'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      <input
                        type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        placeholder={`Enter ${field}`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={closeModals} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">Cancel</button>
                  <button onClick={showAddModal ? handleAddAdmin : handleEditAdmin} className="flex-1 bg-[#4CA466] hover:bg-[#3d8352] text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                    <Save size={18} /> {showAddModal ? 'Save Admin' : 'Save Changes'}
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
          <button onClick={closeModals} className="p-1 hover:bg-gray-100 rounded transition-colors duration-200">
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={closeModals} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
            Cancel
          </button>
          <button
            onClick={handleUpdatePassword}
            className="flex-1 bg-[#4CA466] hover:bg-[#3d8352] text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Save size={18} /> Update Password
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}

export default CollegeAdmin;
