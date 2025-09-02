import React, { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Save,
  Mail,
  Phone,
  Briefcase,
  Key,
} from "lucide-react";
import { privateAxios } from "../../../utils/axios";
import { showSuccess, showError } from "../../../utils/toast";

function CollegeAdmin({ college }) {
  const [admins, setAdmins] = useState(college?.admins || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingAdminIndex, setEditingAdminIndex] = useState(null);
  const [passwordAdminIndex, setPasswordAdminIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    designation: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  // ✅ Add Admin
  const handleAddAdmin = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.designation
    )
      return;

    try {
      const res = await privateAxios.post(
        `/colleges/${college.id}/admins`,
        formData
      );
      setAdmins(res.data.data);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        designation: "",
      });
      setShowAddModal(false);
      showSuccess(res.data.message);
    } catch (err) {
      showError(err.response?.data?.message || err.message);
    }
  };

  // ✅ Open Edit Modal
  const openEditModal = (index) => {
    const admin = admins[index];
    setEditingAdminIndex(index);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "",
      phone: admin.phone,
      designation: admin.designation,
    });
    setShowEditModal(true);
  };

  // ✅ Edit Admin
  const handleEditAdmin = async () => {
    if (editingAdminIndex === null) return;
    try {
      const admin = admins[editingAdminIndex];
      const res = await privateAxios.put(
        `/colleges/${college.id}/admins/${admin.id}`,
        formData
      );
      setAdmins(res.data.data);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        designation: "",
      });
      setShowEditModal(false);
      setEditingAdminIndex(null);
      showSuccess(res.data.message);
    } catch (err) {
      showError(err.response?.data?.message || err.message);
    }
  };

  // ✅ Delete Admin
  const handleDeleteAdmin = async (index) => {
    const admin = admins[index];
    try {
      const res = await privateAxios.delete(
        `/colleges/${college.id}/admins/${admin.id}`
      );
      setAdmins(res.data.data);
      showSuccess(res.data.message);
    } catch (err) {
      showError(err.response?.data?.message || err.message);
    }
  };

  // ✅ Toggle Status
  const handleToggleStatus = async (index) => {
    const admin = admins[index];
    try {
      const res = await privateAxios.patch(
        `/colleges/${college.id}/admins/${admin.id}/toggle-status`
      );
      setAdmins(res.data.data);
      showSuccess(res.data.message);
    } catch (err) {
      showError(err.response?.data?.message || err.message);
    }
  };

  // ✅ Open Password Modal
  const openPasswordModal = (index) => {
    setPasswordAdminIndex(index);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordModal(true);
  };

  // ✅ Update Password
  const handleUpdatePassword = async () => {
    if (passwordAdminIndex === null) return;
    if (
      !passwordData.newPassword ||
      passwordData.newPassword !== passwordData.confirmPassword
    )
      return;

    const admin = admins[passwordAdminIndex];
    try {
      const res = await privateAxios.patch(
        `/colleges/${college.id}/admins/${admin.id}/update-password`,
        passwordData
      );
      setShowPasswordModal(false);
      setPasswordAdminIndex(null);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
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
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      designation: "",
    });
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div>
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white/70 backdrop-blur-sm rounded-md border border-white/20 shadow-md p-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Admin Details
            </h1>
            <p className="text-slate-600 mt-1 text-sm md:text-base">
              Manage college admin accounts
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#4CA466] hover:bg-[#3d8352] text-white px-5 py-2.5 rounded-md font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm"
          >
            <Plus size={18} /> Add Admin
          </button>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {admins.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-600 mb-4">No admins found.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#4CA466] hover:bg-[#3d8352] text-white px-6 py-2.5 rounded-md font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm"
              >
                <Plus size={18} /> Add Admin
              </button>
            </div>
          ) : (
            admins.map((admin, index) => (
              <div
                key={admin.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 p-5 relative group"
              >
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      admin.status === "active"
                        ? "bg-[#6dd083]/10 text-[#6dd083] border border-[#6dd083]/20"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {admin.status.charAt(0).toUpperCase() +
                      admin.status.slice(1)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleToggleStatus(index)}
                    title={`${
                      admin.status === "active" ? "Deactivate" : "Activate"
                    } admin`}
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    {admin.status === "active" ? (
                      <ToggleRight size={16} className="text-[#6dd083]" />
                    ) : (
                      <ToggleLeft size={16} className="text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => openPasswordModal(index)}
                    title="Update password"
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <Key size={16} className="text-gray-500 hover:text-[#6dd083]" />
                  </button>
                  <button
                    onClick={() => openEditModal(index)}
                    title="Edit admin"
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <Edit3
                      size={16}
                      className="text-gray-500 hover:text-[#6dd083]"
                    />
                  </button>
                  <button
                    onClick={() => handleDeleteAdmin(index)}
                    title="Delete admin"
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <Trash2
                      size={16}
                      className="text-gray-500 hover:text-red-500"
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="pt-8 pr-20">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {admin.name}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      <span className="font-medium"><Mail className="inline-block w-4 h-4 mr-1 text-[#4CA466]" /></span> {admin.email}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium"><Phone className="inline-block w-4 h-4 mr-1 text-[#4CA466]" /></span> {admin.phone}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium"><Briefcase className="inline-block w-4 h-4 mr-1 text-[#4CA466]" /></span>{" "}
                      {admin.designation}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-md shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {showAddModal ? "Add New Admin" : "Edit Admin"}
                  </h2>
                  <button
                    onClick={closeModals}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {["name", "email", "password", "phone", "designation"].map(
                    (field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          type={
                            field === "email"
                              ? "email"
                              : field === "password"
                              ? "password"
                              : "text"
                          }
                          name={field}
                          value={formData[field]}
                          onChange={handleInputChange}
                          placeholder={`Enter ${field}`}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6dd083]/20 focus:border-[#6dd083] outline-none transition-all duration-200 text-sm"
                        />
                      </div>
                    )
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={closeModals}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={showAddModal ? handleAddAdmin : handleEditAdmin}
                    className="flex-1 bg-[#4CA466] hover:bg-[#3d8352] text-white px-4 py-2.5 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <Save size={16} />
                    {showAddModal ? "Add Admin" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-md shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Update Password
                  </h2>
                  <button
                    onClick={closeModals}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6dd083]/20 focus:border-[#6dd083] outline-none transition-all duration-200 text-sm"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6dd083]/20 focus:border-[#6dd083] outline-none transition-all duration-200 text-sm"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={closeModals}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdatePassword}
                    className="flex-1 bg-[#4CA466] hover:bg-[#3d8352] text-white px-4 py-2.5 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <Save size={16} /> Update Password
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
