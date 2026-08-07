import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaShoppingBag, FaSignOutAlt } from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();

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
          <button className="logout-btn">
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