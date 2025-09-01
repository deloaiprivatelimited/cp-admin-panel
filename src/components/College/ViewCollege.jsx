import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CollegeInfo from './components/CollegeInfo';
import ContactSection from './components/ContactsSections';
import CollegeAdmin from './components/CollegeAdmin';
import TokenLogs from './components/TokenLogs';
import { privateAxios } from '../../utils/axios';
import { showError } from '../../utils/toast';

function ViewCollege() {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCollege = async (collegeId) => {
    setLoading(true);
    try {
      const response = await privateAxios.get(`/colleges/${collegeId}`);
      if (response.data.success) {
        setCollege(response.data.data);
      } else {
        showError(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching college data:', error);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollege(id);
  }, [id]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!college) {
    return <div className="text-center p-4">No college data found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Pass college to all child components */}
      <CollegeInfo college={college} />
      <ContactSection college={college} />
      <CollegeAdmin college={college} />
      <TokenLogs college={college} />
    </div>
  );
}

export default ViewCollege;
