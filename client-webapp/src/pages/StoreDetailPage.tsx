import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Star, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StoreCategoryList from '../components/StoreCategoryList';
import ProductCard from '../components/ProductCard';
// import MapView from '../components/ui/Map';
import { dataService } from '../services/dataService';
import { Store, StoreCategory } from '../types';

export default function StoreDetailPage() {
  const { id } = useParams();
  const [store, setStore] = useState<Store | null>(null);
  const [hours, setHours] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);


  useEffect(() => {
    if (!id) return;

    async function fetchStoreData() {
      try {
        const storeData = await dataService.getStoreById(id);
        const menuItems = await dataService.getMenuItemsByStore(id);

        if (!storeData) {
          setError("Store not found");
          return;
        }
        setStore(storeData);
        setProducts(menuItems);

        console.log("STORE DATA:", storeData);


        // ✅ Fetch store hours from store_hours table
        const hoursData = await dataService.getStoreHours(id);
        const hoursMap: Record<string, string> = {};
        hoursData.forEach((h: { day: string; open: string; close: string }) => {
          hoursMap[h.day] = `${h.open} - ${h.close}`;
        });
        setHours(hoursMap);
      } catch (err) {
        setError("Store not found");
      } finally {
        setLoading(false);
      }
    }

    fetchStoreData();
  }, [id]);


  if (loading) return <div>Loading store...</div>;
  if (error || !store) return <div className="min-h-screen bg-gray-50"><Header /><div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-600">{error || 'Store not found'}</div><Footer /></div>;

  const storeProducts = products;

  // Convert store.categories (array of IDs or objects) into objects with product counts
  const storeCategories = (store.categories || []).map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon || "",
    image: category.image || "",
    productCount: storeProducts.filter((p) => p.category === category.id).length,
    storeId: store.id,
  }));
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {/* Store Header */}
        <div className="relative h-96">
          <img
            src={store.image}
            alt={store.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold">{store.name}</h1>
              <div className="mt-4 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="ml-2 text-lg">{store.rating}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Store Info */}
            <div className="col-span-2">
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700">{store.description}</p>
              </div>

              {/* Categories */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
                <StoreCategoryList
                  storeId={store.id}
                  categories={storeCategories}
                />
              </div>

              {/* Featured Products */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {storeProducts
                    .filter(product => product.featured)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </div>
            </div>

            {/* Store Details Sidebar */}
            <div className="mt-12 lg:mt-0">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">Store Information</h3>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-500">{store.location.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Hours</p>
                      {Object.keys(hours).length > 0 ? (
                        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                          <p key={day} className="text-sm text-gray-500">
                            {day}: {hours[day] || "Closed"}
                          </p>
                        ))
                      ) : (
                        <>
                          <p className="text-sm text-gray-500">Monday: 9:00 AM - 9:00 PM</p>
                          <p className="text-sm text-gray-500">Tuesday: 9:00 AM - 9:00 PM</p>
                          <p className="text-sm text-gray-500">Wednesday: 9:00 AM - 9:00 PM</p>
                          <p className="text-sm text-gray-500">Thursday: 9:00 AM - 9:00 PM</p>
                          <p className="text-sm text-gray-500">Friday: 9:00 AM - 10:00 PM</p>
                          <p className="text-sm text-gray-500">Saturday: 10:00 AM - 10:00 PM</p>
                          <p className="text-sm text-gray-500">Sunday: 10:00 AM - 6:00 PM</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Map */}
                {/*<div className="mt-6 h-64 rounded-lg overflow-hidden">
                  <MapView location={store.location} />
                </div>*/}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}