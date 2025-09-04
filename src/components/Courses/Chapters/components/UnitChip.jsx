// src/pages/components/UnitChip.jsx
import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function UnitChip({ name, type, index, onEdit, onDelete }) {
  const icon = type === "mcq" ? "❓" : "📝";

  return (
    <div className="w-32 rounded-lg border border-gray-200 bg-white p-2 shadow-sm hover:shadow transition flex flex-col items-start">
      {/* Type */}
      <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
        <span>{icon}</span>
        <span className="capitalize">{type}</span>
      </div>

      {/* Name */}
      <div className="mt-1 text-sm font-medium text-gray-800 truncate w-full">
        {name}
      </div>

      {/* Actions */}
      <div className="mt-1 flex gap-2 text-gray-500">
        <button
          onClick={() => onEdit?.(index)}
          className="hover:text-blue-600 transition"
          title="Edit"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete?.(index)}
          className="hover:text-red-600 transition"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
