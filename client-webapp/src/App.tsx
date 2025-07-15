import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import StoresPage from './pages/StoresPage';
import DealsPage from './pages/DealsPage';
import NewReleasesPage from './pages/NewReleasesPage';
import CustomerServicePage from './pages/CustomerServicePage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProductDetailPage from './pages/ProductDetailPage';
import StoreDetailPage from './pages/StoreDetailPage';
import StoreCategoryPage from './pages/StoreCategoryPage';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import ShippingPage from './pages/ShippingPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:id" element={<CategoryProductsPage />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/stores/:id" element={<StoreDetailPage />} />
            <Route path="/stores/:storeId/categories/:categoryId" element={<StoreCategoryPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/new" element={<NewReleasesPage />} />
            <Route path="/customer-service" element={<CustomerServicePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiePolicyPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;