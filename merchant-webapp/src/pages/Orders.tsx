import React, { useState } from 'react';
import { Order } from '../types';
import OrderCard from '../components/orders/OrderCard';

const SAMPLE_ORDERS: Order[] = [
  {
    id: '1001',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    items: [
      { id: '1', name: 'Classic Burger', quantity: 2, price: 12.99 },
      { id: '2', name: 'French Fries', quantity: 1, price: 4.99 },
    ],
    total: 30.97,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '1002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    items: [
      { id: '3', name: 'Caesar Salad', quantity: 1, price: 9.99 },
      { id: '4', name: 'Iced Tea', quantity: 2, price: 2.99 },
    ],
    total: 15.97,
    status: 'preparing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage and track your incoming orders
        </p>
      </div>

      {/* Order Status Filter */}
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

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
}