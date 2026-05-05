'use client';
import { useState } from 'react';
import axios from 'axios';

export default function CreateEmployee() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    employee_id: '',
    password: ''
  });

  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://localhost:8000/api/employees/create/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStatus({ loading: false, error: '', success: 'Employee created successfully! They can now log into the mobile app.' });
      setFormData({ first_name: '', last_name: '', email: '', employee_id: '', password: '' });
      
    } catch (err) {
      console.error("Full Error:", err);
      
      // 👇 Smarter error handling to show the REAL issue
      let errorMessage = 'Failed to create employee.';
      
      if (err.response) {
        // If Django sent a specific error message, show it:
        errorMessage = err.response.data.error || err.response.data.detail || `Server Error: ${err.response.status}`;
      } else if (err.request) {
        // If the server is down or CORS failed:
        errorMessage = 'Network Error: Cannot connect to the Django server.';
      }

      setStatus({ 
        loading: false, 
        success: '',
        error: errorMessage 
      });
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Employee</h1>
        <p className="text-gray-500 mt-1">Generate credentials for warehouse workers to access the mobile app.</p>
      </div>

      {status.success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 mb-6 font-medium">
          ✅ {status.success}
        </div>
      )}

      {status.error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 mb-6 font-medium">
          ❌ {status.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">First Name</label>
            <input 
              type="text" required
              className="w-full border border-gray-200 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Last Name</label>
            <input 
              type="text" required
              className="w-full border border-gray-200 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Email Address (Optional)</label>
          <input 
            type="email" 
            className="w-full border border-gray-200 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="border-t border-gray-100 my-4 pt-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Mobile App Credentials</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-blue-700">Employee ID (Used as Username)</label>
              <input 
                type="text" required
                placeholder="e.g. EMP001"
                className="w-full border border-blue-200 bg-blue-50 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                value={formData.employee_id}
                onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700">Temporary Password</label>
              <input 
                type="text" required
                placeholder="e.g. warehouse2026"
                className="w-full border border-gray-200 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={status.loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-bold shadow-sm transition-colors mt-4 disabled:opacity-70"
        >
          {status.loading ? 'Creating Account...' : 'Create Employee Account'}
        </button>
      </form>
    </div>
  );
}