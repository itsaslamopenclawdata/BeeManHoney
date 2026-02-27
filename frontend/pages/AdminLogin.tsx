import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronLeft } from 'lucide-react';
import api from '../services/api';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const { data } = await api.post('/auth/token', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      localStorage.setItem('token', data.access_token);
      navigate('/admin');
    } catch (err) {
      setError('Invalid Admin Credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <ShieldCheck className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Admin Portal</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Access Dashboard
          </button>
        </form>

        <button onClick={() => navigate('/login')} className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Store
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
