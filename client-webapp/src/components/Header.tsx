import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, User, ShoppingCart, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import DeliveryToggle from './DeliveryToggle';
import SearchResults from './ui/SearchResults';
import { products, stores } from '../data/mockData';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, signOut } = useAuth();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Left Section: Logo and Delivery Toggle */}
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-xl font-bold">ShopSpot</span>
              </Link>
              <DeliveryToggle mode={deliveryMode} onChange={setDeliveryMode} />
            </div>

            {/* Middle Section: Search */}
            <div className="flex-1 max-w-lg mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search ShopSpot"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                />
                {showSearchResults && (
                  <SearchResults
                    stores={filteredStores}
                    products={filteredProducts}
                    onClose={() => setShowSearchResults(false)}
                  />
                )}
              </div>
            </div>

            {/* Right Section: Account, Returns, Cart */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/signin" className="flex flex-col items-start text-sm">
                <span className="text-gray-500">Hello, sign in</span>
                <span className="font-medium">Account & Lists</span>
              </Link>
              <Link to="/orders" className="flex flex-col items-start text-sm">
                <span className="text-gray-500">Returns</span>
                <span className="font-medium">& Orders</span>
              </Link>
              <Link to="/cart" className="flex items-center text-sm group relative">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="ml-1 font-medium">Cart</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-10 space-x-6">
            <Link to="/categories" className="text-sm text-gray-600 hover:text-gray-900">
              Categories
            </Link>
            <Link to="/stores" className="text-sm text-gray-600 hover:text-gray-900">
              Stores
            </Link>
            <Link to="/deals" className="text-sm text-gray-600 hover:text-gray-900">
              Today's Deals
            </Link>
            <Link to="/new" className="text-sm text-gray-600 hover:text-gray-900">
              New Releases
            </Link>
            <Link to="/customer-service" className="text-sm text-gray-600 hover:text-gray-900">
              Customer Service
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/signin"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Sign In
            </Link>
            <Link
              to="/orders"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Returns & Orders
            </Link>
            <Link
              to="/cart"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}