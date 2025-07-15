import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const stockStatusColors = {
    available: 'bg-green-100 text-green-800',
    low: 'bg-yellow-100 text-yellow-800',
    out: 'bg-red-100 text-red-800'
  };

  const stockStatusText = {
    available: 'In Stock',
    low: 'Low Stock',
    out: 'Out of Stock'
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stockStatus !== 'out') {
      addItem(product);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="h-48 w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="mt-1 text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</p>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatusColors[product.stockStatus]}`}>
              {stockStatusText[product.stockStatus]}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stockStatus === 'out'}
            className={`mt-4 w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium
              ${product.stockStatus !== 'out'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}