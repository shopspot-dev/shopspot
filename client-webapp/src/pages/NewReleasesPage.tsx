import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { dataService } from '../services/dataService';
import { Product } from '../types';

export default function NewReleasesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dataService.getMenuItems()
      .then((data) => {
        // Sort by created_at descending and take first 8
        const sorted = [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setProducts(sorted.slice(0, 8));
      })
      .catch((err) => setError('Failed to load new releases.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading new releases...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">New Releases</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}