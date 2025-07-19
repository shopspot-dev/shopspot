import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { Store, Product, Category } from '../types';

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const data = await dataService.getStores();
        setStores(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch stores');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return { stores, loading, error };
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await dataService.getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await dataService.getCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useStoreProducts = (storeId: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreProducts = async () => {
      try {
        setLoading(true);
        const data = await dataService.getProductsByStore(storeId);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch store products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchStoreProducts();
    }
  }, [storeId]);

  return { products, loading, error };
};

export const useStore = (storeId: string) => {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const data = await dataService.getStoreById(storeId);
        setStore(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch store');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchStore();
    }
  }, [storeId]);

  return { store, loading, error };
}; 