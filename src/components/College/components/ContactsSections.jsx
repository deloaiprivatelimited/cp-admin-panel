import React, { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Save,
  Briefcase,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { privateAxios } from "../../../utils/axios";
import { showSuccess, showError } from "../../../utils/toast";

function ContactSection({ college }) {
  const [contacts, setContacts] = useState(college?.contacts || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContactIndex, setEditingContactIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    designation: "",
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new contact to the college
  const handleAddContact = async () => {
    try {
      if (
        formData.name &&
        formData.phone &&
        formData.email &&
        formData.designation
      ) {
        const res = await privateAxios.post(
          `/colleges/${college.id}/contacts`,
          formData
        );
        setContacts(res.data.data);
        setFormData({ name: "", phone: "", email: "", designation: "" });
        setShowAddModal(false);
        showSuccess(res.data.message);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        showError(err.response.data.message || "Failed to add contact");
      } else {
        showError(err.message || "Failed to add contact");
      }
    }
  };

  // Open edit modal with existing contact data
  const openEditModal = (index) => {
    setEditingContactIndex(index);
    const contact = contacts[index];
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      designation: contact.designation,
    });
    setShowEditModal(true);
  };

  // Edit existing contact
  const handleEditContact = async () => {
    if (editingContactIndex === null) return;

    try {
      const res = await privateAxios.put(
        `/colleges/${college.id}/contacts/${editingContactIndex}`,
        formData
      );
      setContacts(res.data.data);
      setShowEditModal(false);
      setEditingContactIndex(null);
      setFormData({ name: "", phone: "", email: "", designation: "" });
      showSuccess(res.data.message);
    } catch (err) {
      if (err.response && err.response.data) {
        showError(err.response.data.message || "Failed to edit contact");
      } else {
        showError(err.message || "Failed to edit contact");
      }
    }
  };

  // Delete a contact
  const handleDeleteContact = async (index) => {
    try {
      const res = await privateAxios.delete(
        `/colleges/${college.id}/contacts/${index}`
      );
      setContacts(res.data.data);
      showSuccess(res.data.message);
    } catch (err) {
      if (err.response && err.response.data) {
        showError(err.response.data.message || "Failed to delete contact");
      } else {
        showError(err.message || "Failed to delete contact");
      }
    }
  };

  // Toggle contact active/inactive status
  const handleToggleStatus = async (index) => {
    try {
      const res = await privateAxios.patch(
        `/colleges/${college.id}/contacts/${index}/toggle-status`
      );
      setContacts(res.data.data);
      showSuccess(res.data.message);
    } catch (err) {
      if (err.response && err.response.data) {
        showError(err.response.data.message || "Failed to toggle status");
      } else {
        showError(err.message || "Failed to toggle status");
      }
    }
  };

  // Close all modals and reset form data
  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingContactIndex(null);
    setFormData({ name: "", phone: "", email: "", designation: "" });
  };

  return (
    <div className="">
      <div className="w-full mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white/70 backdrop-blur-sm rounded-md border border-white/20 shadow-md p-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Contact Details
            </h1>
            <p className="text-slate-600 mt-1 text-sm md:text-base">
              Manage college contact information
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#4CA466] hover:bg-[#3d8352] text-white px-5 py-2.5 rounded-md font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm"
          >
            <Plus size={18} /> Add Contact
          </button>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 p-5 relative group"
            >
              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    contact.status === "active"
                      ? "bg-[#6dd083]/10 text-[#6dd083] border border-[#6dd083]/20"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}
                >
                  {contact.status.charAt(0).toUpperCase() +
                    contact.status.slice(1)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleToggleStatus(index)}
                  title={`${
                    contact.status === "active" ? "Deactivate" : "Activate"
                  } contact`}
                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  {contact.status === "active" ? (
                    <ToggleRight size={16} className="text-[#6dd083]" />
                  ) : (
                    <ToggleLeft size={16} className="text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => openEditModal(index)}
                  title="Edit contact"
                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  <Edit3
                    size={16}
                    className="text-gray-500 hover:text-[#6dd083]"
                  />
                </button>
                <button
                  onClick={() => handleDeleteContact(index)}
                  title="Delete contact"
                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  <Trash2
                    size={16}
                    className="text-gray-500 hover:text-red-500"
                  />
                </button>
              </div>

              {/* Contact Information */}
              <div className="pt-8 pr-20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {contact.name}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={16} className="text-[#4CA466]" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail size={16} className="text-[#4CA466]" />
                    <span className="break-all">{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Briefcase size={16} className="text-[#4CA466]" />
                    <span>{contact.designation}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-md shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {showAddModal ? "Add New Contact" : "Edit Contact"}
                  </h2>
                  <button
                    onClick={closeModals}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {[
                    {
                      field: "name",
                      label: "Full Name",
                      type: "text",
                      placeholder: "Enter full name",
                    },
                    {
                      field: "phone",
                      label: "Phone Number",
                      type: "tel",
                      placeholder: "Enter phone number",
                    },
                    {
                      field: "email",
                      label: "Email Address",
                      type: "email",
                      placeholder: "Enter email address",
                    },
                    {
                      field: "designation",
                      label: "Designation",
                      type: "text",
                      placeholder: "Enter designation/role",
                    },
                  ].map(({ field, label, type, placeholder }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6dd083]/20 focus:border-[#6dd083] outline-none transition-all duration-200 text-sm"
                        placeholder={placeholder}
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={closeModals}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={
                      showAddModal ? handleAddContact : handleEditContact
                    }
                    className="flex-1 bg-[#4CA466] hover:bg-[#3d8352] text-white px-4 py-2.5 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <Save size={16} />
                    {showAddModal ? "Add Contact" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {contacts.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No contacts yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Start building your contact directory by adding your first contact
              person.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#6dd083] hover:bg-[#5cc072] text-white px-6 py-2.5 rounded-md font-medium shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center gap-2 text-sm"
            >
              <Plus size={18} /> Add Your First Contact
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactSection;
