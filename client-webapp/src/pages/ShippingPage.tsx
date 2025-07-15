import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Truck, Clock, Package, Shield } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about our shipping policies and delivery options.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Truck className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Delivery Options</h2>
            </div>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-2">Standard Delivery</h3>
                <p className="text-gray-600">3-5 business days</p>
                <p className="text-gray-600">Free for orders over $35</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-2">Express Delivery</h3>
                <p className="text-gray-600">1-2 business days</p>
                <p className="text-gray-600">$9.99</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Same-Day Delivery</h3>
                <p className="text-gray-600">Available in select areas</p>
                <p className="text-gray-600">$14.99</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Clock className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Processing Times</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Orders are typically processed within 24 hours of being placed. During peak seasons or promotional periods, processing times may be slightly longer.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Orders placed before 2 PM EST ship same day</li>
                <li>Weekend orders process on Monday</li>
                <li>Holiday schedules may affect processing times</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Package className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Tracking & Updates</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Once your order ships, you'll receive a confirmation email with tracking information. Track your package's journey from our warehouse to your doorstep.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Real-time tracking updates</li>
                <li>SMS notifications available</li>
                <li>Delivery window estimates</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Shipping Protection</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                All shipments are insured against loss or damage. If there's any issue with your delivery, our customer service team is here to help.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Full insurance coverage</li>
                <li>Easy claims process</li>
                <li>24/7 support available</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}