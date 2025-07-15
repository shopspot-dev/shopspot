import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Cookie, Settings, Shield, Info } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Last updated: March 15, 2024
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose max-w-none">
            <h2 className="flex items-center text-2xl font-bold mb-4">
              <Cookie className="h-6 w-6 text-green-600 mr-2" />
              What Are Cookies
            </h2>
            <p className="text-gray-600 mb-8">
              Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide a better browsing experience.
            </p>

            <h2 className="flex items-center text-2xl font-bold mb-4">
              <Settings className="h-6 w-6 text-green-600 mr-2" />
              How We Use Cookies
            </h2>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Essential Cookies</h3>
              <p className="text-gray-600 mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
              </p>

              <h3 className="text-xl font-semibold mb-2">Performance Cookies</h3>
              <p className="text-gray-600 mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
              </p>

              <h3 className="text-xl font-semibold mb-2">Functionality Cookies</h3>
              <p className="text-gray-600 mb-4">
                These cookies enable the website to provide enhanced functionality and personalization based on your preferences.
              </p>

              <h3 className="text-xl font-semibold mb-2">Targeting Cookies</h3>
              <p className="text-gray-600">
                These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant ads on other sites.
              </p>
            </div>

            <h2 className="flex items-center text-2xl font-bold mb-4">
              <Shield className="h-6 w-6 text-green-600 mr-2" />
              Managing Cookies
            </h2>
            <div className="mb-8">
              <p className="text-gray-600 mb-4">
                Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience of our website.
              </p>
              <p className="text-gray-600">
                You can manage your cookie preferences by:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Adjusting your browser settings</li>
                <li>Using our cookie consent tool</li>
                <li>Opting out of specific cookie types</li>
              </ul>
            </div>

            <h2 className="flex items-center text-2xl font-bold mb-4">
              <Info className="h-6 w-6 text-green-600 mr-2" />
              Additional Information
            </h2>
            <div className="mb-8">
              <p className="text-gray-600 mb-4">
                For more information about cookies and your privacy rights, please visit:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Our Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact our Data Protection Officer</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Cookie Preferences</h2>
              <p className="text-gray-600 mb-4">
                You can adjust your cookie preferences at any time using the settings below:
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Essential Cookies</h3>
                    <p className="text-sm text-gray-500">Required for basic site functionality</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" checked disabled className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Performance Cookies</h3>
                    <p className="text-sm text-gray-500">Help us improve our website</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Targeting Cookies</h3>
                    <p className="text-sm text-gray-500">Used for personalized advertising</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}