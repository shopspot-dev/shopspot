export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stockStatus: 'available' | 'low' | 'out';
  storeId: string;
  featured?: boolean;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  image: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  categories: string[];
  rating: number;
  featured?: boolean;
  openingHours?: {
    [key: string]: string;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  storeId?: string;
}

export interface StoreCategory extends Category {
  productCount: number;
}