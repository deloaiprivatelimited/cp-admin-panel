import React from 'react';
import { Edit, MapPin, Hash, Building2 } from 'lucide-react';

function CollegeInfo({ college}) {
  const formatAddress = (address) => {
    if (typeof address === 'string') return address;

    const parts = [];
    if (address?.line1) parts.push(address.line1);
    if (address?.line2) parts.push(address.line2);
    if (address?.city) parts.push(address.city);
    if (address?.state) parts.push(address.state);
    if (address?.country) parts.push(address.country);
    if (address?.zip_code) parts.push(address.zip_code);

    return parts.join(', ') || 'No address provided';
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Lead': return 'bg-blue-100 text-blue-800';
      case 'Fallowup':
      case 'fallowup_2': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">College Information</h2>
          <button
            onClick={() => alert('Edit functionality not implemented')}
            className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-500 transition"
          >
            <Edit className="w-4 h-4 mr-1" /> Edit
          </button>
        </div>

        {/* College Card */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {/* College Header */}
          <div className="flex items-center p-5 border-b border-gray-200">
            <Building2 className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{college?.name || 'Harvard University'}</h1>
              <p className="text-sm text-gray-500">Educational Institution</p>
            </div>
          </div>

          {/* College Details */}
          <div className="p-5 space-y-4">
            {/* College ID */}
            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <Hash className="w-4 h-4 mr-1" /> College ID
              </div>
              <div className="text-gray-900 font-mono">{college?.college_id || 'HRV001'}</div>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <MapPin className="w-4 h-4 mr-1" /> Address
              </div>
              <div className="text-gray-900">{college?.address ? formatAddress(college.address) : 'Cambridge, MA 02138, United States'}</div>
            </div>

            {/* Status */}
            <div>
              <div className="flex items-center text-gray-600 mb-1">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: '#4CA466' }}></div> Status
              </div>
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${statusColor(college?.status || 'Active')}`}>
                {college?.status || 'Active'}
              </span>
            </div>

            {/* Notes */}
            <div>
              <div className="text-gray-600 mb-1">Additional Notes</div>
              <div className="text-gray-800 text-sm">{college?.notes || 'Ivy League institution founded in 1636. Harvard University is a private research university in Cambridge, Massachusetts.'}</div>
            </div>
          </div>

      
        </div>
      </div>
    </div>
  );
}

export default CollegeInfo;