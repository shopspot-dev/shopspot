import React from 'react';
import { Order } from '../../types';
import { Clock, Package } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

export default function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    delivered: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{order.customerName}</p>
        </div>
        <p className="text-lg font-medium text-gray-900">${order.total.toFixed(2)}</p>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-900">Items:</h4>
        <ul className="mt-2 space-y-2">
          {order.items.map((item) => (
            <li key={item.id} className="text-sm text-gray-600">
              {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          {new Date(order.createdAt).toLocaleTimeString()}
        </div>
        
        <div className="flex space-x-2">
          {order.status === 'pending' && (
            <>
              <button
                onClick={() => onUpdateStatus(order.id, 'preparing')}
                className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
              >
                Decline
              </button>
            </>
          )}
          {order.status === 'preparing' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'ready')}
              className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Mark Ready
            </button>
          )}
          {order.status === 'ready' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'delivered')}
              className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
            >
              Complete Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}