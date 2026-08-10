import React, { useState, useEffect } from 'react';
import { FaShoppingBag, FaBox, FaUsers, FaDollarSign } from 'react-icons/fa';
import API_URL from '../../api/config'; // ← ADD THIS
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ===== FIXED: Use API_URL =====
        const ordersRes = await fetch(`${API_URL}/orders`);
        const orders = await ordersRes.json();
        const productsRes = await fetch(`${API_URL}/products`);
        const products = await productsRes.json();

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const pendingOrders = orders.filter(order => order.status === 'Pending').length;

        setStats({
          totalOrders,
          totalProducts: products.length,
          totalRevenue,
          pendingOrders,
        });

        setRecentOrders(orders.slice(-5).reverse());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3498db' }}>
            <FaShoppingBag />
          </div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#27ae60' }}>
            <FaBox />
          </div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f39c12' }}>
            <FaDollarSign />
          </div>
          <div className="stat-info">
            <h3>Rs. {stats.totalRevenue.toFixed(0)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e74c3c' }}>
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
      </div>

      <div className="recent-orders">
        <h3>Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p className="no-orders">No orders yet</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{order.shippingAddress?.fullName || 'N/A'}</td>
                  <td>Rs. {order.totalPrice?.toFixed(0) || '0'}</td>
                  <td>
                    <span className={`status-badge status-${order.status?.toLowerCase() || 'pending'}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;