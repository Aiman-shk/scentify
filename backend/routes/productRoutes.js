import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// GET all products & POST a new product
router.route('/').get(getProducts).post(createProduct);

// GET, PUT, DELETE a single product by ID
router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

// ===== CATEGORY ROUTES REMOVED =====
// No category routes needed anymore

export default router;