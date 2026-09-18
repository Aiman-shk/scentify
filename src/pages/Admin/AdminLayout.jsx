import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaShoppingBag, FaSignOutAlt, FaLock } from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ===== CHANGE THIS PASSWORD =====
  const ADMIN_PASSWORD = 'scent@@1098ify!';
  // ===============================

  // Check if already logged in
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setError('');
    } else {
      setError('❌ Wrong password. Try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    navigate('/');
  };

  // ===== LOGIN SCREEN =====
  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <FaLock className="lock-icon" />
          <h2>Admin Access</h2>
          <p>Enter password to continue</p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="admin-password-input"
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="admin-login-btn">
              Login
            </button>
          </form>

          <Link to="/" className="back-to-site">
            ← Back to Website
          </Link>
        </div>
      </div>
    );
  }

  // ===== ADMIN PANEL =====
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>🪄 Scentify</h2>
          <p>Admin Panel</p>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className={`admin-nav-link ${isActive('/admin')}`}>
            <FaTachometerAlt /> Dashboard
          </Link>
          <Link to="/admin/orders" className={`admin-nav-link ${isActive('/admin/orders')}`}>
            <FaShoppingBag /> Orders
          </Link>
          <Link to="/admin/products" className={`admin-nav-link ${isActive('/admin/products')}`}>
            <FaBox /> Products
          </Link>
        </nav>
        <div className="admin-logout">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>Welcome to Admin Panel</h1>
          <div className="admin-user">
            <span>Admin</span>
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;