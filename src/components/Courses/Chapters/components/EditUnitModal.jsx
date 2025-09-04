// src/pages/components/EditUnitModal.jsx
import React, { useEffect, useState } from "react";

export default function EditUnitModal({ open, unit, onClose, onSubmit }) {
  const [name, setName] = useState("");
  useEffect(() => { setName(unit?.name || ""); }, [unit]);
  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim() });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={submit} className="relative z-[101] w-full max-w-sm rounded-xl bg-white p-4 shadow-xl">
        <h3 className="text-sm font-semibold text-gray-800">Rename Unit</h3>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-3 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring"
          placeholder="Unit name"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border px-3 py-1.5 text-sm">Cancel</button>
          <button type="submit" className="rounded-lg bg-[#4CA466] px-3 py-1.5 text-sm font-semibold text-white hover:brightness-95">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
