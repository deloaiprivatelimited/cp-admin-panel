import React, { useState } from 'react';
import { Plus, Edit3, Trash2, ToggleLeft, ToggleRight, X, Save } from 'lucide-react';
import { privateAxios } from '../../../utils/axios';
import { showSuccess, showError } from '../../../utils/toast';

function ContactSection({ college }) {
  const [contacts, setContacts] = useState(college?.contacts || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContactIndex, setEditingContactIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    designation: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add contact
  const handleAddContact = async () => {
    try {
      if (formData.name && formData.phone && formData.email && formData.designation) {
        const res = await privateAxios.post(`/colleges/${college.id}/contacts`, formData);
        setContacts(res.data.data); // update state with returned contacts
        setFormData({ name: '', phone: '', email: '', designation: '' });
        setShowAddModal(false);
        showSuccess(res.data.message);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        showError(err.response.data.message || 'Failed to add contact');
      } else {
        showError(err.message || 'Failed to add contact');
      }
    }
  };

  // Open edit modal
  const openEditModal = (index) => {
    setEditingContactIndex(index);
    const contact = contacts[index];
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      designation: contact.designation
    });
    setShowEditModal(true);
  };

  // Edit contact
  const handleEditContact = async () => {
    if (editingContactIndex === null) return;

    try {
      const res = await privateAxios.put(
        `/colleges/${college.id}/contacts/${editingContactIndex}`,
        formData
      );
      setContacts(res.data.data); // update contacts state
      setShowEditModal(false);
      setEditingContactIndex(null);
      setFormData({ name: '', phone: '', email: '', designation: '' });
      showSuccess(res.data.message);
    } catch (err) {
      if (err.response && err.response.data) {
        showError(err.response.data.message || 'Failed to edit contact');
      } else {
        showError(err.message || 'Failed to edit contact');
      }
    }
  };

  // Delete contact
  const handleDeleteContact = async (index) => {
    try {
      const res = await privateAxios.delete(`/colleges/${college.id}/contacts/${index}`);
      setContacts(res.data.data); // update contacts state
      showSuccess(res.data.message);
    } catch (err) {
      if (err.response && err.response.data) {
        showError(err.response.data.message || 'Failed to delete contact');
      } else {
        showError(err.message || 'Failed to delete contact');
      }
    }
  };

  // Toggle status
  const handleToggleStatus = async (index) => {
    try {
      const res = await privateAxios.patch(
        `/colleges/${college.id}/contacts/${index}/toggle-status`
      );
      setContacts(res.data.data); // update contacts state
      showSuccess(res.data.message);
    } catch (err) {
      if (err.response && err.response.data) {
        showError(err.response.data.message || 'Failed to toggle status');
      } else {
        showError(err.message || 'Failed to toggle status');
      }
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingContactIndex(null);
    setFormData({ name: '', phone: '', email: '', designation: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Contact Details</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#4CA466] hover:bg-[#3d8352] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus size={20} /> Add Contact
          </button>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 relative">
              {/* Action Icons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleToggleStatus(index)}
                  title={`${contact.status === 'active' ? 'Deactivate' : 'Activate'} contact`}
                  className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                >
                  {contact.status === 'active' ? (
                    <ToggleRight size={18} className="text-[#4CA466]" />
                  ) : (
                    <ToggleLeft size={18} className="text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => openEditModal(index)}
                  title="Edit contact"
                  className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                >
                  <Edit3 size={18} className="text-gray-600 hover:text-[#4CA466]" />
                </button>
                <button
                  onClick={() => handleDeleteContact(index)}
                  title="Delete contact"
                  className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                >
                  <Trash2 size={18} className="text-gray-600 hover:text-red-500" />
                </button>
              </div>

              {/* Contact Info */}
              <div className="pr-16">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{contact.name}</h3>
                <div className="space-y-2">
                  <p className="text-gray-600"><span className="font-medium">Phone:</span> {contact.phone}</p>
                  <p className="text-gray-600"><span className="font-medium">Email:</span> {contact.email}</p>
                  <p className="text-gray-600"><span className="font-medium">Role:</span> {contact.designation}</p>
                  <div className="mt-3">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      contact.status === 'active'
                        ? 'bg-[#4CA466] bg-opacity-10 text-[#ffffff]'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modals */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {showAddModal ? 'Add New Contact' : 'Edit Contact'}
                  </h2>
                  <button onClick={closeModals} className="p-1 hover:bg-gray-100 rounded transition-colors duration-200">
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  {['name', 'phone', 'email', 'designation'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                        placeholder={`Enter ${field}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={closeModals}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={showAddModal ? handleAddContact : handleEditContact}
                    className="flex-1 bg-[#4CA466] hover:bg-[#3d8352] text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> {showAddModal ? 'Save Contact' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {contacts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first contact.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#4CA466] hover:bg-[#3d8352] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2"
            >
              <Plus size={20} /> Add Your First Contact
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactSection;
