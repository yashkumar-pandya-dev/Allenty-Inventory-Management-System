'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Pencil, X, Download } from 'lucide-react';

const DEFAULT_CATEGORIES = ['Electronics', 'Apparel', 'Tools', 'Office Supplies', 'Hardware'];

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const token = () => localStorage.getItem('accessToken');
  const headers = () => ({ Authorization: `Bearer ${token()}` });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/', { headers: headers() });
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load inventory. Are you logged in?');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id, currentQty, action) => {
    const newQty = action === 'add' ? currentQty + 1 : currentQty - 1;
    if (newQty < 0) return;
    setProducts(prev => prev.map(p => p.id === id ? { ...p, quantity: newQty } : p));
    try {
      await axios.patch(`http://localhost:8000/api/products/${id}/`, { quantity: newQty }, { headers: headers() });
    } catch {
      alert('Failed to update stock on the server.');
      setProducts(prev => prev.map(p => p.id === id ? { ...p, quantity: currentQty } : p));
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/products/${id}/`, { headers: headers() });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete product from the server.');
    }
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name, sku: product.sku,
      category: product.category || '', quantity: product.quantity,
      min_stock_level: product.min_stock_level,
      location: product.location || '', description: product.description || '',
    });
    setIsCustomCategory(product.category ? !DEFAULT_CATEGORIES.includes(product.category) : false);
    setEditError('');
  };

  const handleEditCategoryChange = (e) => {
    if (e.target.value === 'ADD_NEW') {
      setIsCustomCategory(true);
      setEditForm(f => ({ ...f, category: '' }));
    } else {
      setIsCustomCategory(false);
      setEditForm(f => ({ ...f, category: e.target.value }));
    }
  };

  const saveEdit = async () => {
    if (!editForm.name.trim() || !editForm.sku.trim()) { setEditError('Name and SKU are required.'); return; }
    setEditLoading(true); setEditError('');
    try {
      const res = await axios.patch(`http://localhost:8000/api/products/${editProduct.id}/`, editForm, { headers: headers() });
      setProducts(prev => prev.map(p => p.id === editProduct.id ? res.data : p));
      setEditProduct(null);
    } catch {
      setEditError('Failed to save changes. Check for duplicate SKU or server errors.');
    } finally {
      setEditLoading(false);
    }
  };

  // ── Export CSV — runs entirely in the browser, no backend needed ──
  const exportCSV = () => {
    const cols = ['ID', 'Name', 'SKU', 'Category', 'Quantity', 'Min Stock', 'Location', 'Description'];
    const rows = products.map(p => [
      p.id,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.sku || '').replace(/"/g, '""')}"`,
      `"${(p.category || '').replace(/"/g, '""')}"`,
      p.quantity,
      p.min_stock_level,
      `"${(p.location || '').replace(/"/g, '""')}"`,
      `"${(p.description || '').replace(/"/g, '""')}"`,
    ]);
    const csv = [cols.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `allenty-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View, adjust, and edit your current stock levels.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => window.location.href = '/inventory/create'} className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            + Add New Item
          </button>
        </div>
      </div>

      {loading && <div className="flex items-center justify-center p-12"><p className="text-gray-500 font-medium">Loading items...</p></div>}
      {error && <div className="bg-red-50 dark:bg-red-950 text-red-600 p-4 rounded-xl border border-red-100 dark:border-red-900 mb-6">{error}</div>}

      {!loading && !error && (
        <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
              <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                <tr>
                  {['Product Name', 'SKU', 'Category', 'Stock Level', 'Location', 'Actions'].map(h => (
                    <th key={h} className={`px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-50 dark:divide-gray-800">
                {products.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 font-medium">No products found.</td></tr>
                ) : products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 dark:text-white">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 font-medium">{product.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900 px-3 py-1 rounded-full text-xs font-bold">
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => updateStock(product.id, product.quantity, 'remove')} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 border border-red-100 dark:border-red-900 flex items-center justify-center font-bold text-lg transition-colors">-</button>
                        <span className={`min-w-[3rem] text-center px-3 py-1 inline-flex justify-center text-sm font-bold rounded-full border ${
                          product.quantity <= (product.min_stock_level || 5)
                            ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-100 dark:border-red-900'
                            : 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-100 dark:border-green-900'
                        }`}>{product.quantity}</span>
                        <button onClick={() => updateStock(product.id, product.quantity, 'add')} className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 border border-green-100 dark:border-green-900 flex items-center justify-center font-bold text-lg transition-colors">+</button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 font-medium">{product.location || 'Main'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button onClick={() => openEdit(product)} className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors inline-flex items-center mr-1" title="Edit"><Pencil size={18} /></button>
                      <button onClick={() => deleteProduct(product.id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors inline-flex items-center" title="Delete"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Product</h2>
              <button onClick={() => setEditProduct(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><X size={22} /></button>
            </div>
            <div className="p-6 space-y-5">
              {editError && <div className="bg-red-50 dark:bg-red-950 text-red-600 p-3 rounded-lg border border-red-100 dark:border-red-900 text-sm">{editError}</div>}
              {[['Product Name', 'name'], ['SKU', 'sku']].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                  <input type="text" value={editForm[key] || ''} onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={isCustomCategory ? 'ADD_NEW' : editForm.category} onChange={handleEditCategoryChange}>
                  <option value="">Uncategorized</option>
                  {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="ADD_NEW">+ Create New Category...</option>
                </select>
                {isCustomCategory && (
                  <input autoFocus type="text" value={editForm.category || ''} placeholder="Type new category..."
                    onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950 text-gray-900 dark:text-white p-3 rounded-lg mt-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[['Quantity', 'quantity'], ['Min Stock Level', 'min_stock_level']].map(([label, key]) => (
                  <div key={key}>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                    <input type="number" min="0" value={editForm[key] ?? 0} onChange={e => setEditForm(f => ({ ...f, [key]: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Warehouse Location</label>
                <input type="text" value={editForm.location || ''} placeholder="e.g., Aisle 4, Shelf B"
                  onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                <textarea value={editForm.description || ''} rows="3" onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100 dark:border-gray-800">
              <button onClick={() => setEditProduct(null)} className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl transition-colors">Cancel</button>
              <button onClick={saveEdit} disabled={editLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl transition-colors">
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}