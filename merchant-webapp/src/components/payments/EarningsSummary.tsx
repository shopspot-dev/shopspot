import React from 'react';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

export default function EarningsSummary() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Earnings Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-indigo-600">Total Earnings</p>
              <h3 className="text-2xl font-semibold text-indigo-900">$12,345.67</h3>
            </div>
          </div>
          <p className="mt-2 text-sm text-indigo-600">+12.5% from last month</p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">This Month</p>
              <h3 className="text-2xl font-semibold text-green-900">$2,890.00</h3>
            </div>
          </div>
          <p className="mt-2 text-sm text-green-600">142 orders completed</p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Next Payout</p>
              <h3 className="text-2xl font-semibold text-blue-900">$1,234.56</h3>
            </div>
          </div>
          <p className="mt-2 text-sm text-blue-600">Expected on Mar 15</p>
        </div>
      </div>
    </div>
  );
}