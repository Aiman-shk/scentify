import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaImage } from 'react-icons/fa';
import API_URL from '../../api/config';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Scentify',
    price: '',
    description: '',
    image: '',
    image2: '',
    inStock: true,
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
    longevity: '',
    size: '50ml',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: 'Scentify',
      price: '',
      description: '',
      image: '',
      image2: '',
      inStock: true,
      topNotes: '',
      heartNotes: '',
      baseNotes: '',
      longevity: '',
      size: '50ml',
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
        setShowAddForm(false);
        resetForm();
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
        setEditingProduct(null);
        resetForm();
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
      name: product.name || '',
      brand: product.brand || 'Scentify',
      price: product.price || '',
      description: product.description || '',
      image: product.image || '',
      image2: product.image2 || '',
      inStock: product.inStock !== undefined ? product.inStock : true,
      topNotes: product.topNotes || '',
      heartNotes: product.heartNotes || '',
      baseNotes: product.baseNotes || '',
      longevity: product.longevity || '',
      size: product.size || '50ml',
    });
  };

  const closeModal = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    resetForm();
  };

  if (loading) return <div className="admin-loading">Loading products...</div>;

  return (
    <div className="products-admin">
      <div className="products-header">
        <h2>Product Management</h2>
        <button
          className="add-product-btn"
          onClick={() => { setShowAddForm(true); resetForm(); }}
        >
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

      {/* ===== ADD / EDIT PRODUCT MODAL ===== */}
      {(showAddForm || editingProduct) && (
        <div className="product-modal" onClick={closeModal}>
          <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <p className="modal-subtitle">
                Fill in the details below to {editingProduct ? 'update this' : 'create a new'} product.
              </p>
            </div>

            <form
              onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
              className="product-form"
            >
              {/* BASIC INFORMATION */}
              <div className="form-section">
                <h4 className="form-section-title">Basic Information</h4>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Product Name <span className="required">*</span></label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Dream"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Brand <span className="required">*</span></label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Scentify"
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Price (Rs.) <span className="required">*</span></label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="1800"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Size</label>
                    <select
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    >
                      <option value="30ml">30 ml</option>
                      <option value="50ml">50 ml</option>
                      <option value="100ml">100 ml</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* IMAGES */}
              <div className="form-section">
                <h4 className="form-section-title">Images</h4>

                <div className="form-group">
                  <label>Main Image URL <span className="required">*</span> <FaImage className="label-icon" /></label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/dream1.jpg"
                    required
                  />
                  <small className="helper-text">
                    Example: <code>/images/dream1.jpg</code> — file must be inside <code>public/images/</code>
                  </small>
                </div>

                <div className="form-group">
                  <label>Second Image URL (optional) <FaImage className="label-icon" /></label>
                  <input
                    type="text"
                    value={formData.image2}
                    onChange={(e) => setFormData({ ...formData, image2: e.target.value })}
                    placeholder="/images/dream2.jpg"
                  />
                  <small className="helper-text">
                    Shown as the second thumbnail on the product page.
                  </small>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="form-section">
                <h4 className="form-section-title">Description</h4>
                <div className="form-group">
                  <label>Product Description <span className="required">*</span></label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    placeholder="A sweet, fruity gourmand fragrance with strawberry and vanilla..."
                    required
                  />
                </div>
              </div>

              {/* FRAGRANCE NOTES */}
              <div className="form-section">
                <h4 className="form-section-title">Fragrance Notes</h4>
                <div className="form-group">
                  <label>Top Notes 🍎</label>
                  <input
                    type="text"
                    value={formData.topNotes}
                    onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                    placeholder="Strawberry, Peach, Bergamot"
                  />
                </div>
                <div className="form-group">
                  <label>Heart Notes 🌸</label>
                  <input
                    type="text"
                    value={formData.heartNotes}
                    onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                    placeholder="Candy Floss, Orchid, Lily"
                  />
                </div>
                <div className="form-group">
                  <label>Base Notes 💎</label>
                  <input
                    type="text"
                    value={formData.baseNotes}
                    onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                    placeholder="Vanilla, Musk, Sandalwood"
                  />
                </div>
                <div className="form-group">
                  <label>Longevity</label>
                  <input
                    type="text"
                    value={formData.longevity}
                    onChange={(e) => setFormData({ ...formData, longevity: e.target.value })}
                    placeholder="8-10 Hours"
                  />
                </div>
              </div>

              {/* STOCK */}
              <div className="form-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  />
                  <span>In Stock (available for purchase)</span>
                </label>
              </div>

              {/* ACTIONS */}
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;