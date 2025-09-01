import React, { useState } from "react";
import { privateAxios } from "../../utils/axios";
import { showSuccess, showError } from "../../utils/toast";

function AddCollegeModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    college_id: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      country: "",
      zip_code: "",
    },
    notes: "",
    status: "active",
  });

  const statusOptions = [
    { value: "Lead", label: "Lead" },
    { value: "Fallowup", label: "Follow Up" },
    { value: "inactive", label: "Inactive" },
    { value: "active", label: "Active" },
    { value: "fallowup_2", label: "Follow Up 2" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.name || !formData.college_id) {
      showError("College name and College ID are required");
      return;
    }
    if (!formData.address.line1 || !formData.address.city) {
      showError("Address Line 1 and City are required");
      return;
    }

    try {
      const response = await privateAxios.post("/colleges/", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        showSuccess("College added successfully");

        setFormData({
          name: "",
          college_id: "",
          address: {
            line1: "",
            line2: "",
            city: "",
            state: "",
            country: "",
            zip_code: "",
          },
          notes: "",
          status: "active",
        });

        onClose();
      } else {
        showError(response.data.message || "Failed to add college");
      }
    } catch (error) {
      console.error("Error submitting college:", error);
      showError(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }

    console.log("Submitted payload:", formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Add New College</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* College Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter college name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* College ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College ID *
              </label>
              <input
                type="text"
                name="college_id"
                value={formData.college_id}
                onChange={handleInputChange}
                placeholder="Enter college ID"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Address *
              </label>
              {["line1", "line2", "city", "state", "country", "zip_code"].map(
                (field) => (
                  <input
                    key={field}
                    type="text"
                    name={`address.${field}`}
                    value={formData.address[field]}
                    onChange={handleInputChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required={field === "line1" || field === "city"}
                  />
                )
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Additional notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-white rounded-lg"
                style={{ backgroundColor: "#4CA466" }}
              >
                Add College
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCollegeModal;
