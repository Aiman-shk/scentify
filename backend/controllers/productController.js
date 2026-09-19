import Product from '../models/Product.js';
import sanitize from 'mongo-sanitize';
import { validateProductInput } from '../middleware/validate.js';

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
    // Sanitize the ID parameter
    const productId = sanitize(req.params.id);
    
    const product = await Product.findById(productId);
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
// @access  Private/Admin (should be protected)
export const createProduct = async (req, res) => {
  try {
    // Sanitize all input data
    const sanitizedBody = sanitize(req.body);
    
    // Validate input
    const errors = validateProductInput(sanitizedBody);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    
    const { name, brand, price, description, image, gender, inStock } = sanitizedBody;
    
    // Check if product already exists
    const existingProduct = await Product.findOne({ name: name.trim(), brand: brand.trim() });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product already exists' });
    }
    
    const product = new Product({
      name: name.trim(),
      brand: brand.trim(),
      price: Number(price),
      description: description.trim(),
      image: image.trim(),
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
    // Sanitize all input
    const productId = sanitize(req.params.id);
    const sanitizedBody = sanitize(req.body);
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Validate input (optional)
    const errors = validateProductInput(sanitizedBody);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    
    const { name, brand, price, description, image, gender, inStock, rating, numReviews } = sanitizedBody;
    
    product.name = name?.trim() || product.name;
    product.brand = brand?.trim() || product.brand;
    product.price = price ? Number(price) : product.price;
    product.description = description?.trim() || product.description;
    product.image = image?.trim() || product.image;
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
    // Sanitize the ID parameter
    const productId = sanitize(req.params.id);
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.deleteOne();
    res.status(200).json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get products by gender
// @route   GET /api/products/gender/:gender
// @access  Public
export const getProductsByGender = async (req, res) => {
  try {
    const gender = sanitize(req.params.gender);
    const products = await Product.find({ gender: gender });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get products by price range
// @route   GET /api/products/price?min=0&max=10000
// @access  Public
export const getProductsByPrice = async (req, res) => {
  try {
    const min = Number(req.query.min) || 0;
    const max = Number(req.query.max) || 10000;
    
    const products = await Product.find({
      price: { $gte: min, $lte: max }
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};