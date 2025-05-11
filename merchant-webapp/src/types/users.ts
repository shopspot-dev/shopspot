export type UserRole = 'admin' | 'staff' | 'viewer';

export interface StoreUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

export interface UserPermissions {
  canManageUsers: boolean;
  canManageMenu: boolean;
  canManageOrders: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
  canManagePayments: boolean;
}

export const rolePermissions: Record<UserRole, UserPermissions> = {
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