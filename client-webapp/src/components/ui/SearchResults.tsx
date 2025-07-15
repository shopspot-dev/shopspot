import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Product } from '../../types';
import { Star, Package } from 'lucide-react';

interface SearchResultsProps {
  stores: Store[];
  products: Product[];
  onClose: () => void;
}

export default function SearchResults({ stores, products, onClose }: SearchResultsProps) {
  if (stores.length === 0 && products.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No results found
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white rounded-b-lg shadow-lg border border-gray-200 mt-1 max-h-96 overflow-y-auto">
      {stores.length > 0 && (
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Stores</h3>
          <div className="space-y-2">
            {stores.map((store) => (
              <Link
                key={store.id}
                to={`/stores/${store.id}`}
                className="flex items-center p-2 hover:bg-gray-50 rounded-lg"
                onClick={onClose}
              >
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{store.name}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-xs text-gray-600 ml-1">{store.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Products</h3>
          <div className="space-y-2">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="flex items-center p-2 hover:bg-gray-50 rounded-lg"
                onClick={onClose}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                </div>
                <div className="ml-auto">
                  <Package className="h-4 w-4 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}