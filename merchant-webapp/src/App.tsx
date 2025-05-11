import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import MenuItems from './pages/MenuItems';
import StoreProfile from './pages/StoreProfile';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import Payments from './pages/Payments';
import Users from './pages/Users';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import StoreSetup from './pages/StoreSetup';
import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/store-setup" element={
            <ProtectedRoute>
              <StoreSetup />
            </ProtectedRoute>
          } />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="menu" element={<MenuItems />} />
            <Route path="profile" element={<StoreProfile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="settings" element={<Settings />} />
            <Route path="payments" element={<Payments />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}