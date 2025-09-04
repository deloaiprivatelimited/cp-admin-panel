// src/pages/components/ConfirmDialog.jsx
import React from "react";

export default function ConfirmDialog({ open, title="Are you sure?", message, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-[101] w-full max-w-sm rounded-xl bg-white p-4 shadow-xl">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-lg border px-3 py-1.5 text-sm">Cancel</button>
          <button onClick={onConfirm} className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
}
