import Order from '../models/Order.js';
import { sendOrderConfirmation, sendAdminNotification } from '../config/email.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    console.log('📥 Received order data:', req.body);

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Validate each order item has a product ID
    for (let i = 0; i < orderItems.length; i++) {
      if (!orderItems[i].product) {
        console.log(`❌ Order item ${i} is missing product ID:`, orderItems[i]);
        return res.status(400).json({
          message: `Order item ${i} is missing product ID`,
          item: orderItems[i]
        });
      }
    }

    const order = new Order({
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      itemsPrice,
      shippingPrice,
      totalPrice,
      status: 'Pending',
    });

    const createdOrder = await order.save();
    console.log('✅ Order created:', createdOrder._id);

    // ========== SEND EMAILS IN BACKGROUND (NON-BLOCKING) ==========
    console.log('🔥🔥🔥 EMAIL CODE IS RUNNING! 🔥🔥🔥');
    console.log('📧 Attempting to send emails...');
    
    // ===== REMOVED 'await' - EMAILS RUN IN BACKGROUND =====
    // Send confirmation email to customer (don't wait)
    const customerEmail = shippingAddress.email;
    if (customerEmail) {
      console.log(`📧 Sending confirmation to: ${customerEmail}`);
      // NO AWAIT - runs in background
      sendOrderConfirmation(createdOrder, customerEmail)
        .then(() => console.log(`✅ Confirmation email sent to ${customerEmail}`))
        .catch(err => console.error('⚠️ Confirmation email error:', err.message));
    }

    // Send notification to admin (don't wait)
    console.log(`📧 Sending admin notification...`);
    sendAdminNotification(createdOrder)
      .then(() => console.log(`✅ Admin notification sent`))
      .catch(err => console.error('⚠️ Admin email error:', err.message));
    // ==========================================================

    // ===== INSTANT RESPONSE (NO WAITING FOR EMAILS) =====
    res.status(201).json({
      success: true,
      order: createdOrder,
      message: 'Order placed successfully! You will receive a confirmation email shortly.',
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by order ID (for tracking)
// @route   GET /api/orders/track/:id
// @access  Public
export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('❌ Error tracking order:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Public
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();
    console.log(`✅ Order ${order._id} status updated to: ${status}`);
    res.json(updatedOrder);
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Public
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await order.deleteOne();
    res.json({ message: 'Order removed successfully' });
  } catch (error) {
    console.error('❌ Error deleting order:', error);
    res.status(500).json({ message: error.message });
  }
};