import React from 'react';
import { Package, XCircle, Clock, Users } from 'lucide-react';

const metrics = [
  {
    name: 'Average Order Time',
    value: '24 mins',
    icon: Clock,
    change: '-2 mins',
    changeType: 'positive',
  },
  {
    name: 'Cancellation Rate',
    value: '3.2%',
    icon: XCircle,
    change: '-0.5%',
    changeType: 'positive',
  },
  {
    name: 'Repeat Customers',
    value: '64%',
    icon: Users,
    change: '+2.1%',
    changeType: 'positive',
  },
  {
    name: 'Order Completion',
    value: '98.5%',
    icon: Package,
    change: '+0.3%',
    changeType: 'positive',
  },
];

export default function OrderMetrics() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.name} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className="h-5 w-5 text-gray-400" />
                <span className={`text-sm font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-sm text-gray-500 mt-1">{metric.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}