import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TopItem {
  id: string;
  name: string;
  revenue: number;
  quantity: number;
  trend: number;
  image: string;
}

const topItems: TopItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    revenue: 2345.67,
    quantity: 189,
    trend: 12,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: '2',
    name: 'Caesar Salad',
    revenue: 1456.89,
    quantity: 145,
    trend: -8,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
  },
];

export default function TopItems() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Top Selling Items</h2>
      <div className="space-y-4">
        {topItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.quantity} sold</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">
                ${item.revenue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <div className={`flex items-center justify-end ${
                item.trend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.trend >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm">{Math.abs(item.trend)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}