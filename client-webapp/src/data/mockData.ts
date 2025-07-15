import { Store, Product, Category } from '../types';

export const categories: Category[] = [
  {
    id: 'clothing',
    name: 'Clothing',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8'
  },
  {
    id: 'food',
    name: 'Food & Groceries',
    icon: 'Utensils',
    image: 'https://images.unsplash.com/photo-1543168256-418811576931'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: 'Watch',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49'
  },
];

export const stores: Store[] = [
  {
    id: 'store1',
    name: 'Fashion Forward',
    description: 'Your one-stop shop for trendy clothing and accessories',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Fashion St, New York, NY'
    },
    categories: ['clothing', 'accessories'],
    rating: 4.5,
    featured: true,
    openingHours: {
      'Monday': '9:00 AM - 9:00 PM',
      'Tuesday': '9:00 AM - 9:00 PM',
      'Wednesday': '9:00 AM - 9:00 PM',
      'Thursday': '9:00 AM - 9:00 PM',
      'Friday': '9:00 AM - 10:00 PM',
      'Saturday': '10:00 AM - 10:00 PM',
      'Sunday': '10:00 AM - 6:00 PM'
    }
  },
  {
    id: 'store2',
    name: 'Fresh Market',
    description: 'Premium groceries and fresh produce',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
    location: {
      lat: 40.7142,
      lng: -74.0064,
      address: '456 Market Ave, New York, NY'
    },
    categories: ['food'],
    rating: 4.8,
    featured: true,
    openingHours: {
      'Monday': '8:00 AM - 10:00 PM',
      'Tuesday': '8:00 AM - 10:00 PM',
      'Wednesday': '8:00 AM - 10:00 PM',
      'Thursday': '8:00 AM - 10:00 PM',
      'Friday': '8:00 AM - 11:00 PM',
      'Saturday': '8:00 AM - 11:00 PM',
      'Sunday': '9:00 AM - 9:00 PM'
    }
  },
];

export const products: Product[] = [
  {
    id: 'prod1',
    name: 'Classic White T-Shirt',
    description: 'Premium cotton basic tee',
    price: 29.99,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    stockStatus: 'available',
    storeId: 'store1',
    featured: true
  },
  {
    id: 'prod2',
    name: 'Organic Bananas',
    description: 'Fresh organic bananas, per bunch',
    price: 3.99,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1543218024-57a70143c369',
    stockStatus: 'low',
    storeId: 'store2',
    featured: true
  },
  {
    id: 'prod3',
    name: 'Leather Watch',
    description: 'Classic brown leather watch',
    price: 89.99,
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314',
    stockStatus: 'available',
    storeId: 'store1',
    featured: true
  },
  {
    id: 'prod4',
    name: 'Fresh Avocados',
    description: 'Ripe and ready to eat avocados',
    price: 2.49,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578',
    stockStatus: 'available',
    storeId: 'store2',
    featured: true
  },
];