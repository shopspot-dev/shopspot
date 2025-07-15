import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/ui/FilterSidebar';
import SortSelect from '../components/ui/SortSelect';
import { categories, products } from '../data/mockData';
import { Filter } from 'lucide-react';

export default function CategoryProductsPage() {
  const { id } = useParams();
  const category = categories.find(c => c.id === id);
  const categoryProducts = products.filter(p => p.category === id);

  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [sortOption, setSortOption] = useState('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Category not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
            <p className="mt-2 text-sm text-gray-500">
              {categoryProducts.length} products
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <SortSelect
              options={sortOptions}
              value={sortOption}
              onChange={setSortOption}
            />
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-500"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
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

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="lg:hidden">
              <FilterSidebar
                title="Filters"
                filters={filters}
                selectedFilters={selectedFilters}
                onFilterChange={(id, value) => 
                  setSelectedFilters(prev => ({ ...prev, [id]: value }))
                }
                onClearFilters={() => setSelectedFilters({})}
                isMobile
                onClose={() => setShowMobileFilters(false)}
              />
            </div>
          )}

          {/* Product Grid */}
          <div className="mt-6 lg:mt-0 lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProducts.map((product) => (
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