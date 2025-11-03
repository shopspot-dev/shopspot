import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import OrderCard from '../components/orders/OrderCard';
import { useAuth } from '../contexts/AuthContext';
import { orders } from '../lib/supabase';

export default function Orders() {
  const { currentStore } = useAuth(); // ✅ Use currentStore
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentStore?.id) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [currentStore?.id]); // ✅ Reload when store changes

  const loadOrders = async () => {
    if (!currentStore?.id) return;
    
    try {
      setLoading(true);
      setError('');
      
      const data = await orders.getAll(currentStore.id); // ✅ Use helper
      setOrdersList(data);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await orders.updateStatus(orderId, newStatus); // ✅ Use helper
      await loadOrders(); // Reload to refresh UI
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order status');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  const filteredOrders = selectedStatus === 'all'
    ? ordersList
    : ordersList.filter(order => order.status === selectedStatus);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage and track your incoming orders
        </p>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2">
          {['all', 'pending', 'preparing', 'ready', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No orders found
          </div>
        ) : (
          filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}