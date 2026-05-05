"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Charts from '../../components/Charts';
import InventoryTable from '../../components/InventoryTable';
import { Package, AlertTriangle, Search, Bell } from 'lucide-react';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, lowStock: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState({ full_name: '', initials: '' });
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const headers = { Authorization: `Bearer ${token}` };

        const [productsRes, meRes] = await Promise.all([
          axios.get('http://localhost:8000/api/products/', { headers }),
          axios.get('http://localhost:8000/api/me/', { headers }),
        ]);

        const fetchedProducts = productsRes.data;
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        setUser(meRes.data);

        const lowStockCount = fetchedProducts.filter(p => p.quantity <= p.min_stock_level).length;
        setStats({ total: fetchedProducts.length, lowStock: lowStockCount });

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Live search — filters by name, SKU, or category
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(p =>
          p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, products]);

  return (
    <div className="max-w-7xl mx-auto">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {loading ? '...' : user.full_name || 'Manager'}!
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening in your warehouse today.</p>
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            />
          </div>
          <button onClick={() => router.push('/alerts')} className="p-2 relative text-gray-500 hover:text-gray-800 transition-colors">
            <Bell size={24} />
            {stats.lowStock > 0 && (
              <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-50"></span>
            )}
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold shadow-sm text-sm">
            {loading ? '…' : user.initials || '??'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Products</p>
            <p className="text-4xl font-extrabold text-gray-900">
              {loading ? '...' : stats.total}
            </p>
          </div>
          <Package className="absolute right-[-10px] bottom-[-20px] text-gray-50" size={120} />
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-50 relative overflow-hidden md:col-span-2">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-red-500 text-sm font-bold uppercase tracking-wider mb-2">Action Needed</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-4xl font-extrabold text-red-600">
                  {loading ? '...' : stats.lowStock}
                </p>
                <p className="text-red-400 font-medium">products below minimum stock</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/alerts')}
              className="hidden md:block bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-4 rounded-lg transition-colors border border-red-100"
            >
              View Alerts
            </button>
          </div>
          <AlertTriangle className="absolute right-[10%] bottom-[-20px] text-red-50 opacity-40" size={140} />
        </div>
      </div>

      {/* Show search result count when filtering */}
      {searchQuery && (
        <div className="mb-4 text-sm text-gray-500 font-medium">
          Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
          <button onClick={() => setSearchQuery('')} className="ml-3 text-blue-600 hover:underline">Clear</button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Stock Distribution</h3>
          </div>
          <div className="min-h-[300px] flex items-center justify-center">
            {loading ? <p className="text-gray-400">Loading chart...</p> : <Charts products={filteredProducts} />}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Inventory Overview</h3>
            <button
              onClick={() => router.push('/inventory')}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <InventoryTable products={filteredProducts} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
