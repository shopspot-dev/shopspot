import React from 'react';
import { Search } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-green-600">
      <div className="absolute inset-0">
        <img
          className="h-full w-full object-cover opacity-30"
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
          alt="Shopping"
        />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Discover Local Stores
        </h1>
        <p className="mt-6 text-xl text-white max-w-3xl">
          Find everything you need from your favorite local stores. Shop clothes, food, electronics, and more.
        </p>
        <div className="mt-10 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for stores, products, or categories"
              className="block w-full pl-10 pr-4 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}