import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Transporter verification failed:', error);
  } else {
    console.log('✅ Transporter ready to send emails');
  }
});

// Send order confirmation email - SPAM OPTIMIZED
export const sendOrderConfirmation = async (order, userEmail) => {
  try {
    console.log(`📧 Preparing email for: ${userEmail}`);

    // ===== SAFE ID CONVERSION =====
    const orderId = order._id.toString();
    const orderIdShort = orderId.slice(-6);
    // ==============================

    // ===== ORDER ITEMS TABLE =====
    const orderItemsHtml = order.orderItems.map(item => `
      <tr>
        <td style="padding: 8px 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${item.price.toFixed(0)}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${(item.price * item.quantity).toFixed(0)}</td>
      </tr>
    `).join('');
    // ==============================

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const trackOrderLink = `${frontendUrl}/track-order`;

    // ===== PLAIN TEXT VERSION (CRITICAL FOR SPAM) =====
    const plainText = `
Scentify Order Confirmation

Order ID: ${orderId}
Date: ${new Date(order.createdAt).toLocaleDateString()}
Payment: ${order.paymentMethod}

Items:
${order.orderItems.map(item => `  ${item.name} x ${item.quantity} = Rs. ${(item.price * item.quantity).toFixed(0)}`).join('\n')}

Subtotal: Rs. ${order.itemsPrice.toFixed(0)}
Shipping: ${order.shippingPrice === 0 ? 'FREE' : 'Rs. ' + order.shippingPrice.toFixed(0)}
Total: Rs. ${order.totalPrice.toFixed(0)}

Shipping to:
${order.shippingAddress.fullName}
${order.shippingAddress.address}
${order.shippingAddress.city}
${order.shippingAddress.phone}

Track your order: ${trackOrderLink}

Questions? Reply to this email or contact us at ${process.env.EMAIL_USER}

Thank you,
Scentify
    `;
    // ===================================================

    const mailOptions = {
      from: `"Scentify" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Your order #${orderIdShort} is confirmed`, // ← Simple, clean subject
      text: plainText, // ← PLAIN TEXT (CRITICAL!)
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f9f6f2;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9f6f2; padding: 20px;">
            <tr>
              <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 16px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding-bottom: 20px;">
                      <h1 style="color: #2d1b12; margin: 0; font-size: 28px;">Scentify</h1>
                      <p style="color: #8b7355; margin: 5px 0 0; font-size: 16px;">Thank You for Your Order</p>
                    </td>
                  </tr>
                  
                  <!-- Order Details -->
                  <tr>
                    <td style="background-color: #fdf8f3; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px;">
                      <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Order ID:</strong> ${orderId}</p>
                      <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                      <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Payment:</strong> ${order.paymentMethod}</p>
                    </td>
                  </tr>
                  
                  <!-- Items -->
                  <tr>
                    <td style="padding: 16px 0;">
                      <h3 style="color: #2d1b12; margin: 0 0 12px; font-size: 18px;">Items</h3>
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                        <thead>
                          <tr style="background-color: #f0e8e0;">
                            <th style="padding: 10px; text-align: left; font-size: 13px; color: #555;">Product</th>
                            <th style="padding: 10px; text-align: center; font-size: 13px; color: #555;">Qty</th>
                            <th style="padding: 10px; text-align: right; font-size: 13px; color: #555;">Price</th>
                            <th style="padding: 10px; text-align: right; font-size: 13px; color: #555;">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${orderItemsHtml}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
                            <td style="padding: 10px; text-align: right; font-weight: bold;">Rs. ${order.itemsPrice.toFixed(0)}</td>
                          </tr>
                          <tr>
                            <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Shipping:</td>
                            <td style="padding: 10px; text-align: right; font-weight: bold;">${order.shippingPrice === 0 ? 'FREE' : 'Rs. ' + order.shippingPrice.toFixed(0)}</td>
                          </tr>
                          <tr style="border-top: 2px solid #2d1b12;">
                            <td colspan="3" style="padding: 12px 10px; text-align: right; font-weight: bold; font-size: 18px; color: #2d1b12;">Total:</td>
                            <td style="padding: 12px 10px; text-align: right; font-weight: bold; font-size: 18px; color: #2d1b12;">Rs. ${order.totalPrice.toFixed(0)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Shipping -->
                  <tr>
                    <td style="background-color: #fdf8f3; border-radius: 12px; padding: 16px 20px;">
                      <h3 style="color: #2d1b12; margin: 0 0 8px; font-size: 16px;">Shipping Address</h3>
                      <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>${order.shippingAddress.fullName}</strong></p>
                      <p style="margin: 4px 0; color: #555; font-size: 14px;">${order.shippingAddress.address}</p>
                      <p style="margin: 4px 0; color: #555; font-size: 14px;">${order.shippingAddress.city}</p>
                      <p style="margin: 4px 0; color: #555; font-size: 14px;">${order.shippingAddress.phone}</p>
                    </td>
                  </tr>
                  
                  <!-- Track Button -->
                  <tr>
                    <td align="center" style="padding: 24px 0 10px;">
                      <a href="${trackOrderLink}" style="display: inline-block; background-color: #2d1b12; color: #ffffff; padding: 14px 40px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px; font-family: Arial, sans-serif;">Track Your Order</a>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="text-align: center; padding: 20px 0 0; color: #a89a8e; font-size: 12px; border-top: 1px solid #f0e8e0;">
                      <p style="margin: 4px 0;">You received this email because you placed an order with Scentify.</p>
                      <p style="margin: 4px 0;"><a href="${frontendUrl}/unsubscribe" style="color: #a89a8e; text-decoration: underline;">Unsubscribe</a> | © 2026 Scentify</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

// Send admin notification email
export const sendAdminNotification = async (order) => {
  try {
    const orderId = order._id.toString();
    const orderIdShort = orderId.slice(-6);

    const mailOptions = {
      from: `"Scentify Admin" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Order #${orderIdShort} - ${order.shippingAddress.fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2d1b12;">New Order!</h1>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer:</strong> ${order.shippingAddress.fullName}</p>
          <p><strong>Total:</strong> Rs. ${order.totalPrice.toFixed(0)}</p>
          <p><strong>Payment:</strong> ${order.paymentMethod}</p>
          <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/order-success/${orderId}" style="background: #2d1b12; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">View Order</a></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Admin notification sent`);
    return true;
  } catch (error) {
    console.error('❌ Admin email error:', error.message);
    return false;
  }
};

export default transporter;