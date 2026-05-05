"use client";

export default function InventoryTable({ products, loading }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-800">Live Inventory Status</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase font-bold text-xs">
            <tr>
              <th className="px-6 py-3">Product Name</th>
              <th className="px-6 py-3">SKU</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="p-6 text-center">Loading...</td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-3 font-mono text-xs">{p.sku}</td>
                <td className="px-6 py-3 text-gray-500">{p.warehouse_details?.location || 'Unassigned'}</td>
                <td className="px-6 py-3">{p.quantity}</td>
                <td className="px-6 py-3">
                  {p.quantity <= p.min_stock_level ? (
                    <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">Low</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">Good</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
