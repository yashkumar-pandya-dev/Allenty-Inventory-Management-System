'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit2, Trash2, X } from 'lucide-react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit Modal State
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', email: '' });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:8000/api/employees/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load employees.');
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee? They will lose mobile app access.")) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:8000/api/employees/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (err) {
      alert("Failed to delete employee.");
    }
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setEditForm({ first_name: employee.first_name, last_name: employee.last_name, email: employee.email });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(`http://localhost:8000/api/employees/${editingEmployee.id}/`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update table instantly
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? response.data : emp));
      setEditingEmployee(null);
    } catch (err) {
      alert("Failed to update employee.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-500 mt-1">Manage mobile app access for warehouse workers.</p>
        </div>
        <button 
          className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          onClick={() => window.location.href = '/employees/create'}
        >
          + Add New Employee
        </button>
      </div>

      {loading && <p className="text-gray-500 p-12 text-center">Loading employees...</p>}
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6">{error}</div>}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase font-bold text-xs border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Employee ID (Username)</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.length === 0 ? (
                  <tr><td colSpan="4" className="p-6 text-center text-gray-500">No employees found.</td></tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-mono font-bold text-blue-600">{emp.username}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{emp.first_name} {emp.last_name}</td>
                      <td className="px-6 py-4 text-gray-500">{emp.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openEditModal(emp)} className="text-gray-400 hover:text-blue-600 p-2 mx-1 transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => deleteEmployee(emp.id)} className="text-gray-400 hover:text-red-600 p-2 mx-1 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Edit Employee Details</h2>
              <button onClick={() => setEditingEmployee(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">First Name</label>
                <input type="text" required className="w-full border border-gray-200 p-2.5 rounded-lg mt-1 outline-none focus:border-blue-500"
                  value={editForm.first_name} onChange={(e) => setEditForm({...editForm, first_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Last Name</label>
                <input type="text" required className="w-full border border-gray-200 p-2.5 rounded-lg mt-1 outline-none focus:border-blue-500"
                  value={editForm.last_name} onChange={(e) => setEditForm({...editForm, last_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Email</label>
                <input type="email" className="w-full border border-gray-200 p-2.5 rounded-lg mt-1 outline-none focus:border-blue-500"
                  value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditingEmployee(null)} className="flex-1 bg-gray-100 py-3 rounded-xl font-bold hover:bg-gray-200">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}