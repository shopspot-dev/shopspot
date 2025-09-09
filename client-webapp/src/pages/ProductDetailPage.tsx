import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Truck, Store, ShoppingCart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { dataService } from '../services/dataService';
import { Product } from '../types';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    dataService.getMenuItemById(id)
      .then((data) => {
        if (!data) setError('Product not found');
        setProduct(data);
      })
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading product...</div>;
  if (error || !product) return <div className="min-h-screen bg-gray-50"><Header /><div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-600">{error || 'Product not found'}</div><Footer /></div>;

  const store = product ? dataService.getStoreById(product.storeId) : null;

  if (!product || !store) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    // This function needs to be updated to use the dataService
    // For now, it will just add the product to the cart context
    // In a real application, you'd add it to a cart state and then sync with Supabase
    // For this example, we'll just add it to the context
    // This part of the logic needs to be adapted to your cart context implementation
    // Assuming useCart is available and working
    // import { useCart } from '../context/CartContext';
    // const { addItem } = useCart();
    // addItem(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product Image */}
          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-center object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Store Info */}
            <div className="mt-4">
              <button
                onClick={() => store && dataService.getStoreById(store.id)}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <Store className="h-4 w-4 mr-1" />
                Sold by {store?.name}
                <div className="ml-2 flex items-center">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="ml-1">{store?.rating}</span>
                </div>
              </button>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <p className="text-base text-gray-900">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="mt-6">
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${product.stockStatus === 'available' ? 'bg-green-100 text-green-800' :
                  product.stockStatus === 'low' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}
              >
                {product.stockStatus === 'available' ? 'In Stock' :
                  product.stockStatus === 'low' ? 'Low Stock' : 'Out of Stock'}
              </div>
            </div>

            {/* Delivery Options */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-gray-500">
                <Truck className="h-5 w-5 mr-2" />
                <span>Available for delivery</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Store className="h-5 w-5 mr-2" />
                <span>Available for pickup at {store?.name}</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stockStatus === 'out'}
                className={`w-full flex items-center justify-center px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white
                  ${product.stockStatus !== 'out'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'}`}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}