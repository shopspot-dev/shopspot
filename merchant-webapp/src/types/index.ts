// =========================================
// TYPE INTERFACES
// =========================================

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
}

export interface StoreProfile {
  name: string;
  description: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
      isClosed: boolean;
    };
  };
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingItems: MenuItem[];
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface StoreSettings {
  notifications: NotificationSettings;
  autoAcceptOrders: boolean;
  preparationTime: number;
  taxRate: number;
  currency: string;
}

// =========================================
// CONSTANTS
// =========================================

export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  VIEWER: 'viewer',
} as const;

export const ROLE_PERMISSIONS = {
  admin: {
    canManageUsers: true,
    canManageMenu: true,
    canManageOrders: true,
    canViewAnalytics: true,
    canManageSettings: true,
    canManagePayments: true,
  },
  staff: {
    canManageUsers: false,
    canManageMenu: true,
    canManageOrders: true,
    canViewAnalytics: true,
    canManageSettings: false,
    canManagePayments: false,
  },
  viewer: {
    canManageUsers: false,
    canManageMenu: false,
    canManageOrders: false,
    canViewAnalytics: true,
    canManageSettings: false,
    canManagePayments: false,
  },
} as const;