import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/ui/FilterSidebar';
import SortSelect from '../components/ui/SortSelect';
import { stores, products, categories } from '../data/mockData';

export default function StoreCategoryPage() {
  const { storeId, categoryId } = useParams();
  const store = stores.find(s => s.id === storeId);
  const category = categories.find(c => c.id === categoryId);
  const storeProducts = products.filter(
    p => p.storeId === storeId && p.category === categoryId
  );

  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [sortOption, setSortOption] = useState('featured');

  const filters = [
    {
      id: 'price',
      label: 'Price Range',
      type: 'range' as const,
      min: 0,
      max: 1000,
    },
    {
      id: 'availability',
      label: 'Availability',
      type: 'checkbox' as const,
      options: [
        { value: 'available', label: 'In Stock' },
        { value: 'low', label: 'Low Stock' },
      ],
    },
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
  ];

  if (!store || !category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to={`/stores/${store.id}`}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to {store.name}
          </Link>
        </nav>

        {/* Category Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {category.name} at {store.name}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {storeProducts.length} items available
            </p>
          </div>
          <SortSelect
            options={sortOptions}
            value={sortOption}
            onChange={setSortOption}
          />
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
          {/* Filters */}
          <div className="hidden lg:block">
            <FilterSidebar
              title="Filters"
              filters={filters}
              selectedFilters={selectedFilters}
              onFilterChange={(id, value) => 
                setSelectedFilters(prev => ({ ...prev, [id]: value }))
              }
              onClearFilters={() => setSelectedFilters({})}
            />
          </div>

          {/* Product Grid */}
          <div className="mt-6 lg:mt-0 lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {storeProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}