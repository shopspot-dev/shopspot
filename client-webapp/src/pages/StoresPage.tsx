import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import StoreCard from '../components/StoreCard';
import { dataService } from '../services/dataService';
import { Store } from '../types';

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[StoresPage] Fetching stores...');
    dataService.getStores()
      .then((data) => {
        console.log('[StoresPage] Stores fetched:', data);
        setStores(data);
        if (!data || data.length === 0) {
          setError('No stores found.');
        }
      })
      .catch((err) => {
        console.error('[StoresPage] Error fetching stores:', err);
        setError('Failed to load stores.');
      })
      .finally(() => {
        setLoading(false);
        console.log('[StoresPage] Loading finished.');
      });
  }, []);

  if (loading) return <div>Loading stores...</div>;
  if (error) return <div className="min-h-screen bg-gray-50"><Header /><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-red-600">{error}</div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Stores</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </div>
  );
}