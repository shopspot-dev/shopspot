import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileText, AlertCircle, Scale, Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Last updated: March 15, 2024
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose max-w-none">
            <h2 className="flex items-center text-2xl font-bold mb-4">
              <FileText className="h-6 w-6 text-green-600 mr-2" />
              Agreement to Terms
            </h2>
            <p className="text-gray-600 mb-8">
              By accessing or using ShopSpot's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
            </p>

            <h2 className="flex items-center text-2xl font-bold mb-4">
              <AlertCircle className="h-6 w-6 text-green-600 mr-2" />
              Use License
            </h2>
            <div className="mb-8">
              <p className="text-gray-600 mb-4">
                Permission is granted to temporarily access and use ShopSpot's services for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Transfer the materials to another person</li>
              </ul>
            </div>

            <h2 className="flex items-center text-2xl font-bold mb-4">
              <Scale className="h-6 w-6 text-green-600 mr-2" />
              User Responsibilities
            </h2>
            <div className="mb-8">
              <p className="text-gray-600 mb-4">As a user of ShopSpot, you agree to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Provide accurate account information</li>
                <li>Maintain the security of your account</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not engage in any fraudulent activities</li>
                <li>Not interfere with other users' access to the service</li>
              </ul>
            </div>

            <h2 className="flex items-center text-2xl font-bold mb-4">
              <Shield className="h-6 w-6 text-green-600 mr-2" />
              Disclaimer
            </h2>
            <div className="mb-8">
              <p className="text-gray-600 mb-4">
                ShopSpot's services are provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement of intellectual property</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold mb-4">Limitations</h2>
            <p className="text-gray-600 mb-8">
              In no event shall ShopSpot or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use our services.
            </p>

            <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
            <p className="text-gray-600">
              These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}