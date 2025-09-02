import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { privateAxios } from "../../../utils/axios";
import { showSuccess, showError } from "../../../utils/toast";

function EditCollegeModal({ college, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: college?.name || "",
    notes: college?.notes || "",
    address: {
      line1: college?.address?.line1 || "",
      line2: college?.address?.line2 || "",
      city: college?.address?.city || "",
      state: college?.address?.state || "",
      country: college?.address?.country || "",
      zip_code: college?.address?.zip_code || "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [key]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await privateAxios.put(`/colleges/${college.college_id}`, formData);
      showSuccess(res.data.message);
      onUpdate(res.data.data); // send updated data back to parent
      onClose();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update college");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">Edit College</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
              rows={3}
            />
          </div>

          <h3 className="font-semibold text-gray-800 mt-4">Address</h3>
          {["line1", "line2", "city", "state", "country", "zip_code"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {field.replace("_", " ")}
              </label>
              <input
                type="text"
                name={`address.${field}`}
                value={formData.address[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#4CA466] hover:bg-[#3d8352] text-white rounded-lg flex items-center gap-2"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditCollegeModal;
