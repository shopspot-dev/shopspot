import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Building2, Users, Target, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About ShopSpot</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting local businesses with customers through a seamless shopping experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600">
              Founded in 2024, ShopSpot was created with a simple mission: to bridge the gap between local businesses and their communities. We believe in the power of local commerce and its ability to create vibrant, sustainable neighborhoods.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600">
              We envision a world where every local business can thrive in the digital age, where customers can easily discover and support the shops that make their communities unique.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">1000+</h3>
            <p className="text-gray-600">Local Stores</p>
          </div>
          <div className="text-center">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">50,000+</h3>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div className="text-center">
            <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">20+</h3>
            <p className="text-gray-600">Cities Served</p>
          </div>
          <div className="text-center">
            <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">98%</h3>
            <p className="text-gray-600">Satisfaction Rate</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Community First</h3>
              <p className="text-gray-600">
                We prioritize the growth and sustainability of local communities through commerce.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We continuously improve our platform to provide the best experience for stores and customers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Transparency</h3>
              <p className="text-gray-600">
                We believe in honest, clear communication with all our stakeholders.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}