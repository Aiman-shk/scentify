import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import AnnouncementBar from './components/common/AnnouncementBar';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import WhatsAppButton from './components/common/WhatsAppButton';
import Home from './pages/Home';
import Products from './pages/products';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';
import About from './pages/About';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import PolicyPages from './pages/PolicyPages';
import Sitemap from './components/Sitemap'; // ← ADD THIS IMPORT

// Admin Imports
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import Orders from './pages/Admin/Orders';
import AdminProducts from './pages/Admin/Products';

import './App.css';

function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            {/* ===== ANNOUNCEMENT BAR - ABOVE NAVBAR ===== */}
            <AnnouncementBar />
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* ===== SITEMAP ROUTE - MUST BE FIRST ===== */}
                <Route path="/sitemap.xml" element={<Sitemap />} />
                
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success/:id" element={<OrderSuccess />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/about" element={<About />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/contact" element={<Contact />} />

                {/* Policy Routes */}
                <Route path="/privacy-policy" element={<PolicyPages />} />
                <Route path="/terms" element={<PolicyPages />} />
                <Route path="/shipping" element={<PolicyPages />} />
                <Route path="/returns" element={<PolicyPages />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="products" element={<AdminProducts />} />
                </Route>
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </Router>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;