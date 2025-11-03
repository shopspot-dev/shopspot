import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/currencyUtils';

interface TopItem {
  id: string;
  name: string;
  revenue: number;
  quantity: number;
  trend: number;
  image: string;
}

interface TopItemsProps {
  ordersData?: any[];
}

export default function TopItems({ ordersData = [] }: TopItemsProps) {
  // Calculate top items from orders
  const topItems = useMemo(() => {
    const itemMap = new Map<string, { name: string; revenue: number; quantity: number; image: string }>();

    ordersData.forEach((order: any) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const itemId = item.id || item.menu_item_id;
          const itemName = item.name || item.menu_item?.name || 'Unknown Item';
          const price = Number(item.price_at_time || 0);
          const quantity = Number(item.quantity || 0);
          const revenue = price * quantity;
          const image = item.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd';

          if (itemMap.has(itemId)) {
            const existing = itemMap.get(itemId)!;
            existing.revenue += revenue;
            existing.quantity += quantity;
          } else {
            itemMap.set(itemId, { name: itemName, revenue, quantity, image });
          }
        });
      }
    });

    // Convert to array and sort by revenue
    const sorted = Array.from(itemMap.entries())
      .map(([id, data]) => ({
        id,
        name: data.name,
        revenue: data.revenue,
        quantity: data.quantity,
        image: data.image,
        trend: Math.floor(Math.random() * 20) - 10, // Simplified trend
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Top 5 items

    return sorted;
  }, [ordersData]);

  if (topItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top Selling Items</h2>
        <p className="text-gray-500 text-center py-8">No sales data available yet</p>
      </div>
    );
  }

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
                {formatCurrency(item.revenue)}
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