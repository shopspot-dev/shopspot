import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Last updated: March 15, 2024
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose max-w-none">
            <h2 className="flex items-center text-2xl font-bold mb-4">
              <Shield className="h-6 w-6 text-green-600 mr-2" />
              Introduction
            </h2>
            <p className="text-gray-600 mb-8">
              At ShopSpot, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>

            <h2 className="flex items-center text-2xl font-bold mb-4">
              <Lock className="h-6 w-6 text-green-600 mr-2" />
              Information We Collect
            </h2>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Name and contact information</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information</li>
                <li>Email address</li>
                <li>Phone number</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4 mb-2">Usage Information</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>IP address</li>
                <li>Pages visited</li>
                <li>Time and date of visits</li>
              </ul>
            </div>

            <h2 className="flex items-center text-2xl font-bold mb-4">
              <Eye className="h-6 w-6 text-green-600 mr-2" />
              How We Use Your Information
            </h2>
            <div className="mb-8">
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Process your orders and transactions</li>
                <li>Communicate with you about your orders</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our services and user experience</li>
                <li>Detect and prevent fraud</li>
              </ul>
            </div>

            <h2 className="flex items-center text-2xl font-bold mb-4">
              <FileText className="h-6 w-6 text-green-600 mr-2" />
              Information Sharing
            </h2>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-8">
              <li>Service providers who assist in our operations</li>
              <li>Law enforcement when required by law</li>
              <li>Business partners with your consent</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <p className="text-gray-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Lodge a complaint with supervisory authorities</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}