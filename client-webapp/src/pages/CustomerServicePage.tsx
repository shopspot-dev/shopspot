import React from 'react';
import Header from '../components/Header';

export default function CustomerServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Service</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">How can we help you?</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-medium">Returns & Refunds</h3>
              <p className="text-gray-600 mt-1">Learn about our return policy and how to initiate a return.</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-medium">Shipping Information</h3>
              <p className="text-gray-600 mt-1">Find details about shipping methods and delivery times.</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-medium">Contact Us</h3>
              <p className="text-gray-600 mt-1">Get in touch with our customer service team.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}