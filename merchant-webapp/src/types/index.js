// Constants and shared data structures
export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  VIEWER: 'viewer',
};

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
};