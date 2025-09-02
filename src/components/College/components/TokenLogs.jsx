import React, { useState } from "react";
import { Plus, ToggleLeft, ToggleRight, X, Save, Edit } from "lucide-react";
import { privateAxios } from "../../../utils/axios";
import { showSuccess, showError } from "../../../utils/toast";

function TokenLogs({ college }) {
  const [tokenLogs, setTokenLogs] = useState(college?.tokens || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ totalTokens: "", notes: "" });
  const [editData, setEditData] = useState({ logId: null, notes: "" });

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleEditInputChange = (e) =>
    setEditData({ ...editData, notes: e.target.value });
  const formatNumber = (num) => num.toLocaleString();

  const handleAddTokenLog = async () => {
    if (!formData.totalTokens) return showError("Number of tokens is required");
    try {
      const payload = {
        number_of_tokens: parseInt(formData.totalTokens),
        notes: formData.notes,
      };
      const res = await privateAxios.post(
        `/colleges/${college.id}/token-log`,
        payload
      );
      setFormData({ totalTokens: "", notes: "" });
      setShowAddModal(false);
      showSuccess(res.data.message);
    } catch (err) {
      showError(
        err.response?.data?.message || err.message || "Failed to add token log"
      );
    }
  };

  const handleToggleStatus = async (logId, tokenType) => {
    try {
      const log = tokenLogs.find((t) => t.id === logId);
      const fieldMap = {
        consumed: "consumed_tokens",
        pending: "pending_initiation",
        unused: "unused_tokens",
      };
      const fieldName = fieldMap[tokenType];
      const currentStatus = log[fieldName].status;

      const res = await privateAxios.patch(
        `/colleges/${college.id}/token-log/${logId}/${tokenType}-tokens/status`,
        { status: currentStatus === "active" ? "inactive" : "active" }
      );

      setTokenLogs(tokenLogs.map((l) => (l.id === logId ? res.data.data : l)));
      showSuccess(res.data.message);
    } catch (err) {
      showError(
        err.response?.data?.message ||
          err.message ||
          "Failed to toggle token status"
      );
    }
  };

  const handleSaveNotes = async () => {
    if (!editData.notes) return showError("Notes cannot be empty");
    try {
      const res = await privateAxios.patch(
        `/colleges/${college.id}/token-log/${editData.logId}/edit-notes`,
        { notes: editData.notes }
      );
      setTokenLogs(
        tokenLogs.map((l) => (l.id === editData.logId ? res.data.data : l))
      );
      setShowEditModal(false);
      showSuccess(res.data.message);
    } catch (err) {
      showError(
        err.response?.data?.message || err.message || "Failed to update notes"
      );
    }
  };

  const openEditModal = (log) => {
    setEditData({ logId: log.id, notes: log.notes || "" });
    setShowEditModal(true);
  };

  const closeModal = () => setShowAddModal(false);
  const closeEditModal = () => setShowEditModal(false);

  return (
    <div className="w-full">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white/70 backdrop-blur-sm rounded-md border border-white/20 shadow-md p-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Token Logs
            </h1>
            <p className="text-slate-600 mt-1 text-sm md:text-base">
              Manage college token logs
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#4CA466] hover:bg-[#3d8352] text-white px-5 py-2.5 rounded-md font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm"
          >
            <Plus size={18} /> Add Token Log
          </button>
        </div>

        {/* Token Logs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokenLogs.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-md">
              <p className="text-gray-500 mb-4 text-lg">No token logs found.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#4CA466] hover:bg-[#3d8352] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <Plus size={20} /> Add Token Log
              </button>
            </div>
          ) : (
            tokenLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 relative"
              >
                {/* Status badge */}
                {/* Status badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                      log.status === "active"
                        ? "border-green-200 text-green-600"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {log.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Info */}
                <div className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Token Record
                  </h3>
                  <div className="bg-[#4CA466] text-white bg-opacity-10 rounded-lg p-3 mb-4">
                    <p className="text-xl font-bold text-center">
                      {log.number_of_tokens?.count || 0}
                    </p>
                    <p className="text-xs text-white text-center mt-1">
                      Total Tokens
                    </p>
                  </div>

                  <div className="space-y-3">
                    {["consumed", "pending_initiation", "unused_tokens"].map(
                      (type) => (
                        <div
                          key={type}
                          className="flex items-center capitalize justify-between p-2 bg-gray-50 rounded-md"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {type
                                .replace("_", " ")
                                .replace("tokens", "")
                                .replace("pending", "Pending")}
                            </p>
                            <p className="text-base font-semibold text-gray-700">
                              {formatNumber(log[type]?.count || 0)}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleToggleStatus(
                                log.id,
                                type === "pending_initiation"
                                  ? "pending"
                                  : type.replace("_tokens", "")
                              )
                            }
                            className="p-1 hover:bg-white rounded-sm transition-colors duration-200"
                          >
                            {log[type]?.status === "active" ? (
                              <ToggleRight
                                size={16}
                                className="text-[#4CA466]"
                              />
                            ) : (
                              <ToggleLeft size={16} className="text-gray-400" />
                            )}
                          </button>
                        </div>
                      )
                    )}

                    {log.notes && (
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-gray-600 italic">
                          Note: {log.notes}
                        </p>
                        <button
                          onClick={() => openEditModal(log)}
                          className="text-[#4CA466] hover:text-[#3d8352]"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add Token Log
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Tokens
                  </label>
                  <input
                    type="number"
                    name="totalTokens"
                    value={formData.totalTokens}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter total number of tokens"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Add notes about this token log"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTokenLog}
                  className="flex-1 bg-[#4CA466] hover:bg-[#3d8352] text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Save Token Log
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit Note
                </h2>
                <button
                  onClick={closeEditModal}
                  className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>
              <textarea
                value={editData.notes}
                onChange={handleEditInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                rows={4}
                placeholder="Edit note for this token log"
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="flex-1 bg-[#4CA466] hover:bg-[#3d8352] text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Save Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TokenLogs;
