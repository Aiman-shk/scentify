import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      const data = await res.json();
      setOrders(data.reverse());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  // ========== UPDATED: Update order status with API ==========
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        alert(`✅ Order status updated to ${newStatus}`);
      } else {
        alert('❌ Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('❌ Network error. Please try again.');
    }
  };
  // ==========================================================

  if (loading) {
    return <div className="admin-loading">Loading orders...</div>;
  }

  return (
    <div className="orders-admin">
      <h2>Order Management</h2>
      <div className="orders-table-container">
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>#{order._id.slice(-8)}</td>
                <td>{order.shippingAddress.fullName}</td>
                <td>{order.orderItems.length}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>
                  {/* ========== UPDATED: Status dropdown ========== */}
                  <select 
                    value={order.status || 'Pending'}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className={`status-select status-${(order.status || 'pending').toLowerCase()}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  {/* =============================================== */}
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="action-btn view-btn" onClick={() => setSelectedOrder(order)}>
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="order-detail-modal" onClick={() => setSelectedOrder(null)}>
          <div className="order-detail-content" onClick={(e) => e.stopPropagation()}>
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>Customer:</strong> {selectedOrder.shippingAddress.fullName}</p>
            <p><strong>Email:</strong> {selectedOrder.shippingAddress.email}</p>
            <p><strong>Address:</strong> {selectedOrder.shippingAddress.address}</p>
            <p><strong>City:</strong> {selectedOrder.shippingAddress.city}</p>
            <p><strong>Phone:</strong> {selectedOrder.shippingAddress.phone}</p>
            <p><strong>Total:</strong> ${selectedOrder.totalPrice.toFixed(2)}</p>
            <p><strong>Status:</strong> {selectedOrder.status || 'Pending'}</p>
            <h4>Order Items:</h4>
            <ul>
              {selectedOrder.orderItems.map((item, i) => (
                <li key={i}>{item.name} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</li>
              ))}
            </ul>
            <button className="close-modal-btn" onClick={() => setSelectedOrder(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;