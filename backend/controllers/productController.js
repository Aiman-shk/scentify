import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Public (for now)
export const createProduct = async (req, res) => {
  try {
    // ===== CATEGORY REMOVED FROM CREATE =====
    const { name, brand, price, description, image, gender, inStock } = req.body;
    
    const product = new Product({
      name,
      brand,
      // category removed
      price,
      description,
      image,
      gender: gender || 'Unisex',
      inStock: inStock !== undefined ? inStock : true,
    });
    
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // ===== CATEGORY REMOVED FROM UPDATE =====
    const { name, brand, price, description, image, gender, inStock, rating, numReviews } = req.body;
    
    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.gender = gender || product.gender;
    product.inStock = inStock !== undefined ? inStock : product.inStock;
    product.rating = rating || product.rating;
    product.numReviews = numReviews || product.numReviews;
    
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.deleteOne();
    res.status(200).json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};