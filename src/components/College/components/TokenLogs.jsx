import React, { useState } from 'react';
import { Plus, ToggleLeft, ToggleRight, X, Save } from 'lucide-react';
import { privateAxios } from '../../../utils/axios';
import { showSuccess, showError } from '../../../utils/toast';

function TokenLogs({ college }) {
  const [tokenLogs, setTokenLogs] = useState(college?.tokens || []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    totalTokens: '',
    notes: ''
  });

  console.log(tokenLogs)
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add Token Log
  const handleAddTokenLog = async () => {
    console.log(formData);

    if (!formData.totalTokens) return showError("Number of tokens is required");

    try {
      const payload = {
        number_of_tokens: parseInt(formData.totalTokens),
        notes: formData.notes
      };
      const res = await privateAxios.post(`/colleges/${college.id}/token-log`, payload);

    //   setTokenLogs([res.data.data, ...tokenLogs]); // prepend new log
      setFormData({ totalTokens: '', notes: '' });
      setShowAddModal(false);
      showSuccess(res.data.message);
    } catch (err) {
      if (err.response?.data?.message) showError(err.response.data.message);
      else showError(err.message || 'Failed to add token log');
    }
  };

// Toggle token status (consumed, pending, unused)
// Toggle token status (consumed, pending, unused)
const handleToggleStatus = async (logId, tokenType) => {
  try {
    const log = tokenLogs.find(t => t.id === logId);

    // Map tokenType to the correct field in log
    const fieldMap = {
      consumed: 'consumed_tokens',
      pending: 'pending_initiation',
      unused: 'unused_tokens',
    };

    const fieldName = fieldMap[tokenType];
    const currentStatus = log[fieldName].status;

    const res = await privateAxios.patch(
      `/colleges/${college.id}/token-log/${logId}/${tokenType}-tokens/status`,
      { status: currentStatus === 'active' ? 'inactive' : 'active' }
    );

    setTokenLogs(tokenLogs.map(l => l.id === logId ? res.data.data : l));
    showSuccess(res.data.message);
  } catch (err) {
    if (err.response?.data?.message) showError(err.response.data.message);
    else showError(err.message || 'Failed to toggle token status');
  }
};



  const closeModal = () => {
    setShowAddModal(false);
    setFormData({ totalTokens: '', notes: '' });
  };

  const formatNumber = (num) => num.toLocaleString();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Token Logs</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#4CA466] hover:bg-[#3d8352] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Token Log
          </button>
        </div>

        {/* Token Logs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tokenLogs.map((log) => (
            <div key={log.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
              {/* Header */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-semibold text-gray-800">Token Record</h3>
                  <span className="text-xs text-gray-500">{log.assigned_date}</span>
                </div>
                <div className="bg-[#4CA466] bg-opacity-10 rounded-lg p-3">
                  <p className="text-xl font-bold text-center">{log.number_of_tokens.count}</p>
                  <p className="text-xs text-gray-600 text-center mt-1">Total Tokens</p>
                </div>
              </div>

              {/* Token Breakdown */}
           <div className="space-y-3">
  {/* Consumed Tokens */}
  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
    <div>
      <p className="text-sm font-medium text-gray-800">Consumed</p>
      <p className="text-base font-semibold text-gray-700">{formatNumber(log.consumed_tokens.count)}</p>
    </div>
<button
  onClick={() => handleToggleStatus(log.id, 'consumed')}
  className="p-1 hover:bg-white rounded-sm transition-colors duration-200"
  title={`${log.consumed_tokens.status === 'active' ? 'Deactivate' : 'Activate'} consumed tokens`}
>
  {log.consumed_tokens.status === 'active' ? (
    <ToggleRight size={16} className="text-[#4CA466]" />
  ) : (
    <ToggleLeft size={16} className="text-gray-400" />
  )}
</button>

  </div>

  {/* Pending Tokens */}
  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
    <div>
      <p className="text-sm font-medium text-gray-800">Pending</p>
      <p className="text-base font-semibold text-gray-700">{formatNumber(log.pending_initiation.count)}</p>
    </div>
    <button
      onClick={() => handleToggleStatus(log.id, 'pending')}
      className="p-1 hover:bg-white rounded-sm transition-colors duration-200"
      title={`${log.pending_initiation.status === 'active' ? 'Deactivate' : 'Activate'} pending tokens`}
    >
      {log.pending_initiation.status === 'active' ? (
        <ToggleRight size={16} className="text-[#4CA466]" />
      ) : (
        <ToggleLeft size={16} className="text-gray-400" />
      )}
    </button>
  </div>

  {/* Unused Tokens */}
  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
    <div>
      <p className="text-sm font-medium text-gray-800">Unused</p>
      <p className="text-base font-semibold text-gray-700">{formatNumber(log.unused_tokens.count)}</p>
    </div>
    <button
      onClick={() => handleToggleStatus(log.id, 'unused')}
      className="p-1 hover:bg-white rounded-sm transition-colors duration-200"
      title={`${log.unused_tokens.status === 'active' ? 'Deactivate' : 'Activate'} unused tokens`}
    >
      {log.unused_tokens.status === 'active' ? (
        <ToggleRight size={16} className="text-[#4CA466]" />
      ) : (
        <ToggleLeft size={16} className="text-gray-400" />
      )}
    </button>
  </div>

  {/* Optional Notes */}
  {log.notes && <p className="mt-2 text-sm text-gray-600 italic">Note: {log.notes}</p>}
</div>

            </div>
          ))}
        </div>

        {/* Add Token Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Add Token Log</h2>
                  <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded transition-colors duration-200">
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tokens</label>
                    <input
                      type="number"
                      name="totalTokens"
                      value={formData.totalTokens}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter total number of tokens"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Add any notes about this token log"
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
                    className="flex-1 bg-[#4CA466] hover:bg-[#3d8352] text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> Save Token Log
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {tokenLogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No token logs yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first token log.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#4CA466] hover:bg-[#3d8352] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2"
            >
              <Plus size={20} /> Add Your First Token Log
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TokenLogs;
