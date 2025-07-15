import React from 'react';
import Header from '../components/Header';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-600">You haven't placed any orders yet</p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
}