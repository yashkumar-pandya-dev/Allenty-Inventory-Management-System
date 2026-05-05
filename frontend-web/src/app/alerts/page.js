"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:8000/api/products/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const lowStockItems = res.data.filter(p => p.quantity <= p.min_stock_level);
        setAlerts(lowStockItems);
      } catch (error) {
        console.error("Alerts fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleRestock = (productName) => {
    alert(`Redirecting to Inventory to restock ${productName}...`);
    router.push('/inventory');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-red-600 flex items-center gap-2">
             <AlertTriangle /> Low Stock Alerts
           </h1>
           <p className="text-gray-500">{alerts.length} items need attention</p>
        </div>
      </div>

      
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-center gap-4">
        <div className="bg-red-100 p-2 rounded-full">
           <AlertTriangle className="text-red-600" size={24} />
        </div>
        <div>
           <h3 className="font-bold text-red-800">Action Required</h3>
           <p className="text-red-600 text-sm">
             {alerts.length} products are below their minimum stock level. Immediate restocking recommended.
           </p>
        </div>
      </div>

      
      {loading ? (
        <p className="text-gray-500 font-medium p-4">Loading alerts...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
              <div className="h-1 w-full bg-red-500 absolute top-0"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                      {item.warehouse_details?.location || 'Unassigned'}
                    </span>
                  </div>
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full uppercase">
                    Critical
                  </span>
                </div>

                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Current Stock</span>
                    <span className="font-bold text-gray-900">{item.quantity} / {item.min_stock_level}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-red-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min((item.quantity / item.min_stock_level) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    Shortage: {item.min_stock_level - item.quantity} units
                  </p>
                </div>

                <div className="flex gap-3 mt-4">
                  
                  <button 
                    onClick={() => handleRestock(item.name)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2"
                  >
                    <TrendingUp size={16} /> Restock
                  </button>
                  
                
                  <button 
                    onClick={() => router.push('/inventory')}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-bold border border-gray-200 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && alerts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
           <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
           <h3 className="text-xl font-bold text-gray-800">All Good!</h3>
           <p className="text-gray-500">Inventory levels are healthy.</p>
        </div>
      )}
    </div>
  );
}