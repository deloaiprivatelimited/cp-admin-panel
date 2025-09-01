import React, { useState, useEffect } from 'react';
import { privateAxios } from '../../utils/axios';
import { showError } from '../../utils/toast';
import AddCollegeModal from './AddCollegeModal'; // ✅ corrected import
import { useNavigate } from 'react-router-dom';

function CollegeList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [colleges, setColleges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchColleges = async (search = '') => {
    try {
      const res = await privateAxios.get(`/colleges/`, { params: { search } });
      if (res.data.success) setColleges(res.data.data);
      else showError(res.data.message);
    } catch (err) {
      console.error(err);
      showError(err.message || 'Something went wrong');
    }
  };
  const handleViewMore = (collegeId) => {
    navigate(`/college/${collegeId}`);
  };
  useEffect(() => { fetchColleges(); }, []);

  useEffect(() => {
    const debounce = setTimeout(() => fetchColleges(searchTerm), 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  // ✅ Add this function
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search & Add */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md relative">
          <input
            type="text"
            placeholder="Search colleges by name, ID, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          style={{ backgroundColor: '#4CA466' }}
        >
          + Add College
        </button>
      </div>

            {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Colleges ({colleges.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {colleges.map((college, index) => (
                <tr key={college.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{college.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{college.college_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{college.address?.line1}, {college.address?.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{college.notes}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${college.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {college.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                    onClick={ () => handleViewMore(college.id)}
                    className="px-4 py-2 text-white text-xs font-medium rounded-md shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50" style={{ backgroundColor: '#4CA466' }}>
                      View More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {colleges.length === 0 && (
          <div className="text-center py-12 text-gray-500">No colleges found</div>
        )}
      </div>

      {/* ✅ Add College Modal */}
      <AddCollegeModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default CollegeList;
