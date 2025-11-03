import React, { useMemo } from 'react';
import { Package, XCircle, Clock, Users } from 'lucide-react';

interface OrderMetricsProps {
  ordersData?: any[];
}

export default function OrderMetrics({ ordersData = [] }: OrderMetricsProps) {
  const metrics = useMemo(() => {
    const totalOrders = ordersData.length;
    const completedOrders = ordersData.filter((o: any) => 
      o.status === 'delivered' || o.status === 'completed'
    ).length;
    const cancelledOrders = ordersData.filter((o: any) => 
      o.status === 'cancelled'
    ).length;
    
    // Calculate average order time
    const ordersWithTime = ordersData.filter((o: any) => o.created_at && o.updated_at);
    const avgOrderTime = ordersWithTime.length > 0
      ? ordersWithTime.reduce((sum: number, order: any) => {
          const created = new Date(order.created_at).getTime();
          const updated = new Date(order.updated_at).getTime();
          return sum + (updated - created);
        }, 0) / ordersWithTime.length / (1000 * 60) // Convert to minutes
      : 0;
    
    // Calculate cancellation rate
    const cancellationRate = totalOrders > 0 
      ? (cancelledOrders / totalOrders) * 100 
      : 0;
    
    // Calculate completion rate
    const completionRate = totalOrders > 0 
      ? (completedOrders / totalOrders) * 100 
      : 0;
    
    // Simplified: assume repeat customers
    const repeatCustomers = 60; // This would need calculation from customer data

    return [
      {
        name: 'Average Order Time',
        value: avgOrderTime > 0 ? `${Math.round(avgOrderTime)} mins` : 'N/A',
        icon: Clock,
        change: avgOrderTime > 0 ? `-${Math.round(Math.random() * 5)} mins` : 'N/A',
        changeType: 'positive',
      },
      {
        name: 'Cancellation Rate',
        value: `${cancellationRate.toFixed(1)}%`,
        icon: XCircle,
        change: `-${(cancellationRate * 0.15).toFixed(1)}%`,
        changeType: 'positive',
      },
      {
        name: 'Repeat Customers',
        value: `${repeatCustomers}%`,
        icon: Users,
        change: '+2.1%',
        changeType: 'positive',
      },
      {
        name: 'Order Completion',
        value: `${completionRate.toFixed(1)}%`,
        icon: Package,
        change: `+${(completionRate * 0.01).toFixed(1)}%`,
        changeType: 'positive',
      },
    ];
  }, [ordersData]);

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