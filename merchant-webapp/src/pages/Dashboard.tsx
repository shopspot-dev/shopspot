import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import SalesTrends from '../components/analytics/SalesTrends';
import TopItems from '../components/analytics/TopItems';
import OrderMetrics from '../components/analytics/OrderMetrics';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,345',
      icon: DollarSign,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Total Orders',
      value: '156',
      icon: ShoppingBag,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Average Order Value',
      value: '$79.12',
      icon: TrendingUp,
      trend: { value: 3, isPositive: false },
    },
    {
      title: 'Active Customers',
      value: '892',
      icon: Users,
      trend: { value: 15, isPositive: true },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      <SalesTrends />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopItems />
        <OrderMetrics />
      </div>
    </div>
  );
}