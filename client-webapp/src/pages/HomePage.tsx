import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import StoreCard from '../components/StoreCard';
import { categories, products } from '../data/mockData';
import { dataService } from '../services/dataService';
import { Store } from '../types';

export default function HomePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[HomePage] Fetching stores for Popular Stores section...');
    dataService.getStores()
      .then((data) => {
        console.log('[HomePage] Stores fetched:', data);
        setStores(data);
        if (!data || data.length === 0) {
          setError('No stores found.');
        }
      })
      .catch((err) => {
        console.error('[HomePage] Error fetching stores:', err);
        setError('Failed to load stores.');
      })
      .finally(() => {
        setLoading(false);
        console.log('[HomePage] Loading finished.');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />

        {/* Categories Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* Featured Stores Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Stores</h2>
          {loading ? (
            <div>Loading stores...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {stores.map((store) => (
                <div key={store.id} className="flex-shrink-0 w-80">
                  <StoreCard store={store} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Featured Products Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}