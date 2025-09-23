import React, { useState, useEffect } from 'react';
import { Search, Plus, Key, Shield, Trash2 } from 'lucide-react';
import { privateAxios } from '../../utils/axios';
import UpdatePassword from './UpdatePassword';
import UpdatePermissions from './UpdatePermissions';
import AddAdminModal from './addAdmin';
import { useAuth } from '../Auth/AuthContext';
import { showSuccess, showError } from '../../utils/toast';
import Header from '@/utils/header.jsx';

const Admins = () => {
  const { auth } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch admins
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await privateAxios.get('/admin/');
      if (res.data.success) {
        const adminData = res.data.data;
        console.log(adminData[0].is_active)
        setAdmins(adminData);
      } else {
        showError(res.data.message);
      }
    } catch (err) {
      console.error(err);
      showError(err.message || "Failed to fetch admins");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Delete admin
  const handleDelete = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await privateAxios.delete(`/admin/${adminId}`);
      setAdmins(prev => prev.filter(a => a.id !== adminId));
      showSuccess("Admin deleted successfully");
    } catch (err) {
      console.error(err);
      showError("Failed to delete admin");
    }
  };

  // Toggle status
  const handleStatusToggle = async (adminId, currentStatus) => {
    const confirmToggle = window.confirm(
      `Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this admin?`
    );
    if (!confirmToggle) return;

    const newStatus = !currentStatus;
    try {
      const res = await privateAxios.put(`/admin/${adminId}/status`, { status: newStatus });
      if (res.data.success) {
        setAdmins(prev =>
          prev.map(a => a.id === adminId ? { ...a, status: newStatus } : a)
        );
        showSuccess("Status updated successfully");
      } else {
        showError(res.data.message);
      }
    } catch (err) {
      console.error(err);
      showError("Failed to update status");
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header (moved page title, search and add button into Header util) */}
        <Header
          heading={`Administrator List (${filteredAdmins.length})`}
          buttons={[
            <button
              key="add-admin"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-6 py-3 bg-[#4CA466] text-white font-medium rounded-lg hover:bg-[#3d8a54] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CA466] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Admin
            </button>
          ]}
          children={(
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search admins by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CA466] focus:border-transparent transition-all duration-200"
              />
            </div>
          )}
        />

        {/* Admin Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.map(admin => (
                  <tr key={admin.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-[#4CA466] flex items-center justify-center">
                          <span className="text-white font-medium text-sm">{admin.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center justify-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${admin.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {admin.is_active ? 'active' : 'inactive'}
                      </span>
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input 
                          type="checkbox"
                          className="sr-only peer"
                          checked={admin.is_active}
                          onChange={() => handleStatusToggle(admin.id, admin.is_active)}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 transition-all duration-200"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button onClick={() => { setSelectedAdmin(admin); setShowPasswordModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150 hover:scale-110 transform" title="Reset Password"><Key className="h-4 w-4" /></button>
                        <button onClick={() => { setSelectedAdmin(admin); setShowPermissionsModal(true); }} className="p-2 text-[#4CA466] hover:bg-green-50 rounded-lg transition-colors duration-150 hover:scale-110 transform" title="Manage Permissions"><Shield className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(admin.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 hover:scale-110 transform" title="Delete Admin"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAdmins.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No admins found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Modals */}
        <UpdatePassword isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} admin={selectedAdmin} />
        <UpdatePermissions isOpen={showPermissionsModal} onClose={() => setShowPermissionsModal(false)} admin={selectedAdmin} />
        <AddAdminModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      </div>
    </div>
  )
};

export default Admins;