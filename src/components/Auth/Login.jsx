import React, { useState } from 'react';
// import { publicAxios } from '../utils/axios'; // import public Axios instance
// import { useAuth } from '../components/Auth/AuthContext'; // import AuthContext
import { useAuth } from './AuthContext';
import { publicAxios } from '../../utils/axios';
import { showSuccess, showError } from '../../utils/toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // get login function from context
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await publicAxios.post('/admin/login', { email, password });

      if (response.data.success) {
        // Call login from AuthContext
        login(response.data.data.access_token, response.data.data.admin);
              showSuccess("Logged in successfully!"); // ✅ toast

      } else {
        // alert(response.data.message);
              showError(response.data.message); // ✅ toast

      }
    } catch (err) {
      console.error(err);
          showError("Login failed. Please try again."); // ✅ toast

      // alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Gmail Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@gmail.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CA466] focus:border-transparent transition-all duration-200 outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CA466] focus:border-transparent transition-all duration-200 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#4CA466] text-white py-3 px-4 rounded-xl font-semibold focus:ring-2 focus:ring-[#4CA466] focus:ring-offset-2 transform transition-all duration-200 shadow-md ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3d8751] hover:scale-[1.02] hover:shadow-lg'
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
