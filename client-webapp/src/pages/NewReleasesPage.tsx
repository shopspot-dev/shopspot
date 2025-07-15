import React from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { products } from '../data/mockData';

export default function NewReleasesPage() {
  const newProducts = products.slice(0, 8); // Simulating new products

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">New Releases</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}