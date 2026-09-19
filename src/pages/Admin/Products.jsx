import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import API_URL from '../../api/config';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
    image: '',
    gender: 'Unisex',
    inStock: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // ===== FIXED: Use API_URL and show ALL products =====
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data); // ← SHOW ALL PRODUCTS (not just Men's)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
        setShowAddForm(false);
        setFormData({ name: '', brand: '', price: '', description: '', image: '', gender: 'Unisex', inStock: true });
        alert('✅ Product added successfully!');
      } else {
        alert('❌ Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('❌ Network error. Please try again.');
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
        setEditingProduct(null);
        setFormData({ name: '', brand: '', price: '', description: '', image: '', gender: 'Unisex', inStock: true });
        alert('✅ Product updated successfully!');
      } else {
        alert('❌ Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('❌ Network error. Please try again.');
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${API_URL}/products/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setProducts(products.filter(p => p._id !== id));
          alert('✅ Product deleted successfully!');
        } else {
          alert('❌ Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('❌ Network error. Please try again.');
      }
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price,
      description: product.description,
      image: product.image,
      gender: product.gender || 'Unisex',
      inStock: product.inStock,
    });
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
              <th>Gender</th>
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
                <td>{product.gender || 'Unisex'}</td>
                <td>Rs. {product.price.toFixed(0)}</td>
                <td>
                  <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <button className="action-btn edit-btn" onClick={() => openEditModal(product)}>
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
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (Rs.)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Unisex">Unisex</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/product.jpg"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  required
                />
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  />
                  In Stock
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="product-modal" onClick={() => setEditingProduct(null)}>
          <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Product</h3>
            <form onSubmit={handleEditProduct}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (Rs.)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Unisex">Unisex</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  required
                />
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  />
                  In Stock
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setEditingProduct(null)}>Cancel</button>
                <button type="submit" className="submit-btn">Update Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;