import React from 'react';
import { Link } from 'react-router-dom';
import { Store } from '../types';
import { Star, MapPin } from 'lucide-react';

interface StoreCardProps {
  store: Store;
}

export default function StoreCard({ store }: StoreCardProps) {
  return (
    <Link to={`/stores/${store.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="relative">
          <img
            src={store.image}
            alt={store.name}
            className="h-48 w-full object-cover rounded-t-lg"
          />
          <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{store.rating}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{store.description}</p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{store.location.address}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {store.categories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}