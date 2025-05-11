import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface SalesData {
  period: string;
  amount: number;
  orderCount: number;
  trend: number;
}

const salesData: SalesData[] = [
  { period: 'Today', amount: 1234.56, orderCount: 25, trend: 15 },
  { period: 'This Week', amount: 8765.43, orderCount: 156, trend: -5 },
  { period: 'This Month', amount: 35678.90, orderCount: 642, trend: 12 },
];

export default function SalesTrends() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Trends</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {salesData.map((data) => (
          <div key={data.period} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">{data.period}</span>
              <div className={`flex items-center ${
                data.trend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.trend >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">{Math.abs(data.trend)}%</span>
              </div>
            </div>
            <div className="flex items-center mb-1">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <span className="text-2xl font-bold text-gray-900">
                {data.amount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <p className="text-sm text-gray-500">{data.orderCount} orders</p>
          </div>
        ))}
      </div>
    </div>
  );
}