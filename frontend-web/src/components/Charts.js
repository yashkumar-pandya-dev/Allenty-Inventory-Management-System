"use client";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Charts({ products }) {
  
  const sortedProducts = [...products].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  
  const data = {
    labels: sortedProducts.map(p => p.name),
    datasets: [
      {
        label: 'Stock Quantity',
        data: sortedProducts.map(p => p.quantity),
        backgroundColor: 'rgba(37, 99, 235, 0.6)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Top Inventory Items' },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <Bar options={options} data={data} />
    </div>
  );
}
