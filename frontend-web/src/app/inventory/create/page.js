'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CreateProduct() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    quantity: 0,
    category: '', 
    location: '',
    description: ''
  });

  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const defaultCategories = ['Electronics', 'Apparel', 'Tools', 'Office Supplies', 'Hardware'];

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'ADD_NEW') {
      setIsCustomCategory(true);
      setFormData({ ...formData, category: '' }); 
    } else {
      setIsCustomCategory(false);
      setFormData({ ...formData, category: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://localhost:8000/api/products/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      router.push('/inventory');
    } catch (err) {
      alert('Failed to create product. Check console for details.');
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700">Product Name</label>
          <input 
            type="text" 
            required
            className="w-full border border-gray-200 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        
        <div>
          <label className="block text-sm font-bold text-gray-700">Category</label>
          <select 
            required={!isCustomCategory}
            className="w-full border border-gray-200 p-3 rounded-lg mt-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleCategoryChange}
            defaultValue=""
          >
            <option value="" disabled>Select a Category</option>
            {defaultCategories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
            <option value="ADD_NEW" className="font-bold text-blue-600">+ Create New Category...</option>
          </select>

          {isCustomCategory && (
            <input 
              type="text" 
              required
              autoFocus
              placeholder="Type your new category name..."
              className="w-full border border-blue-300 bg-blue-50 p-3 rounded-lg mt-3 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">SKU (Unique ID)</label>
            <input 
              type="text" 
              required
              className="w-full border border-gray-200 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, sku: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Quantity</label>
            <input 
              type="number" 
              required
              className="w-full border border-gray-200 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Warehouse Location</label>
          <input 
            type="text" 
            placeholder="e.g., Aisle 4, Shelf B"
            className="w-full border border-gray-200 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700">Description (Optional)</label>
          <textarea 
            className="w-full border border-gray-200 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            rows="3"
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-bold shadow-sm transition-colors mt-4">
          Save Product
        </button>
      </form>
    </div>
  );
}