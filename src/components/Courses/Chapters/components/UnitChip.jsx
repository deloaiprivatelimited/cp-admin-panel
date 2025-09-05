// src/pages/components/UnitChip.jsx
import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function UnitChip({ id, name, type, index, onEdit, onDelete }) {
  // truncate helper
  const truncateText = (text, limit = 15) =>
    text.length > limit ? text.slice(0, limit) + "…" : text;

  return (
    <div className="group flex items-center justify-between w-64 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer">
      {/* Left side content */}
      <div className="flex flex-col pr-3">
        <span className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
          {type}
        </span>
        <span
          className="text-sm font-medium text-gray-900 group-hover:text-gray-700"
          title={name} // show full name on hover
        >
          {truncateText(name)}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          onClick={() => onEdit?.({ id, name, type, index })}
          className="p-2 rounded-full hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition"
          aria-label="Edit unit"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={() => onDelete?.({ id, name, type, index })}
          className="p-2 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 transition"
          aria-label="Delete unit"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
