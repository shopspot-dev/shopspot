import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Users, Store } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import SalesTrends from '../components/analytics/SalesTrends';
import TopItems from '../components/analytics/TopItems';
import OrderMetrics from '../components/analytics/OrderMetrics';
import { useAuth } from '../contexts/AuthContext';
import { orders, menuItems } from '../lib/supabase';
import { formatCurrency } from '../utils/currencyUtils';

export default function Dashboard() {
  const { currentStore } = useAuth();
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    activeCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (currentStore?.id) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [currentStore?.id]);

  const loadDashboardData = async () => {
    if (!currentStore?.id) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Fetch orders and menu items for the current store
      const [ordersData, menuData] = await Promise.all([
        orders.getAll(currentStore.id),
        menuItems.getAll(currentStore.id),
      ]);
      
      // Calculate statistics
      const totalOrders = ordersData.length;
      
      // Calculate total revenue from orders
      const totalRevenue = ordersData.reduce((sum: number, order: any) => {
        // If order has a total field, use it
        if (order.total) {
          return sum + Number(order.total);
        }
        // Otherwise, calculate from order items
        if (order.items && order.items.length > 0) {
          const orderTotal = order.items.reduce((itemSum: number, item: any) => 
            itemSum + (Number(item.price_at_time || 0) * Number(item.quantity || 0)), 0
          );
          return sum + orderTotal;
        }
        return sum;
      }, 0);
      
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      // Calculate unique customers
      const uniqueCustomers = new Set(
        ordersData
          .map((order: any) => order.customer_email || order.customer_name)
          .filter(Boolean)
      ).size;
      
      setDashboardStats({
        totalOrders,
        totalRevenue,
        averageOrderValue: avgOrderValue,
        activeCustomers: uniqueCustomers,
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Show message if no store selected
  if (!currentStore) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No store selected</h3>
          <p className="text-gray-600">Please select a store to view the dashboard</p>
        </div>
      </div>
    );
  }

  // Create display array using real data from state
  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(dashboardStats.totalRevenue),
      icon: DollarSign,
      trend: { value: 0, isPositive: true },
    },
    {
      title: 'Total Orders',
      value: dashboardStats.totalOrders.toString(),
      icon: ShoppingBag,
      trend: { value: 0, isPositive: true },
    },
    {
      title: 'Average Order Value',
      value: formatCurrency(dashboardStats.averageOrderValue),
      icon: TrendingUp,
      trend: { value: 0, isPositive: true },
    },
    {
      title: 'Active Customers',
      value: dashboardStats.activeCustomers.toString(),
      icon: Users,
      trend: { value: 0, isPositive: true },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Store className="w-6 h-6 text-indigo-600 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-900">{currentStore.name}</h1>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's what's happening with {currentStore.name} today.
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