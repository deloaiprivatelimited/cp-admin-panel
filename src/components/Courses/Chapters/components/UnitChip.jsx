// src/pages/components/UnitChip.jsx
import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";

export default function UnitChip({ id, name, type, index, onEdit, onDelete }) {
  const icon = type === "mcq" ? "❓" : "📝";
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={wrapRef} className="relative inline-flex">
      <div className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
        <span className="text-lg">{icon}</span>
        <span className="max-w-44 truncate text-sm font-medium text-gray-800">{name}</span>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="opacity-60 transition-opacity hover:opacity-100"
          aria-label="Unit actions"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute right-0 top-[110%] z-50 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button
            className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-gray-50"
            onClick={() => { setMenuOpen(false); onEdit?.({ id, name, type, index }); }}
          >
            ✏️ Edit
          </button>
          <button
            className="flex w-full items-center px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            onClick={() => { setMenuOpen(false); onDelete?.({ id, name, type, index }); }}
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}
