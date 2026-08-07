import express from 'express';
import {
  createOrder,
  getOrderById,
  getOrders,
  trackOrder, // ← ADD THIS
  updateOrderStatus, // ← ADD THIS
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/').post(createOrder).get(getOrders);
router.route('/:id').get(getOrderById);
router.route('/track/:id').get(trackOrder); // ← ADD THIS
router.route('/:id/status').put(updateOrderStatus); // ← ADD THIS

export default router;