import React, { useState, useEffect } from "react";

export default function AddChapterModal({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tagline: "",
  });

  useEffect(() => {
    if (!open) {
      setFormData({ name: "", description: "", tagline: "" });
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleAdd = () => {
    if (!formData.name.trim()) return;
    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      tagline: formData.tagline.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-chapter-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100">
          <h3 id="add-chapter-title" className="text-xl font-semibold text-gray-900">
            Add New Chapter
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Create a new chapter for your content
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chapter Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter chapter name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CA466] focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Brief tagline (optional)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CA466] focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Chapter description (optional)"
              rows="3"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CA466] focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!formData.name.trim()}
            className="flex-1 px-4 py-3 bg-[#4CA466] hover:bg-[#429356] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 hover:shadow-md"
          >
            Add Chapter
          </button>
        </div>
      </div>
    </div>
  );
}
