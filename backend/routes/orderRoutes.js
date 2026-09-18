import express from 'express';
import {
  createOrder,
  getOrderById,
  getOrders,
  trackOrder,
  updateOrderStatus,
  deleteOrder, // ← ADD THIS
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/').post(createOrder).get(getOrders);

router.route('/track/:id').get(trackOrder); // ← MOVE THIS BEFORE /:id

router.route('/:id')
  .get(getOrderById)
  .delete(deleteOrder); // ← ADD THIS

router.route('/:id/status').put(updateOrderStatus);

export default router;