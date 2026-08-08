import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './Products.css';
import API_URL from '../../api/config';
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
      try {
        // ===== CHANGED: Use API_URL instead of hardcoded URL =====
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        
        // Filter for men's products
        const mensProducts = data.filter(p => p.gender === 'Men' || p.gender === 'Unisex');
        setProducts(mensProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // In a real app, you would have a DELETE endpoint
        // For now, we'll just remove it from the list
        setProducts(products.filter(p => p._id !== id));
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading products...</div>;
  }

  return (
    <div className="products-admin">
      <div className="products-header">
        <h2>Product Management</h2>
        <button className="add-product-btn" onClick={() => setShowAddForm(true)}>
          <FaPlus /> Add Product
        </button>
      </div>

      <div className="products-table-container">
        <table className="admin-products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>
                  <img src={product.image} alt={product.name} className="product-thumb" />
                </td>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <button className="action-btn edit-btn" onClick={() => setEditingProduct(product)}>
                    <FaEdit />
                  </button>
                  <button className="action-btn delete-btn" onClick={() => deleteProduct(product._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="product-modal" onClick={() => setShowAddForm(false)}>
          <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Product</h3>
            <p>This feature will be available soon!</p>
            <button className="close-modal-btn" onClick={() => setShowAddForm(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="product-modal" onClick={() => setEditingProduct(null)}>
          <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Product</h3>
            <p>This feature will be available soon!</p>
            <button className="close-modal-btn" onClick={() => setEditingProduct(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;