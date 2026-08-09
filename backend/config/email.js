import dotenv from 'dotenv';

dotenv.config();

// ===== SECURE LOGGING =====
console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
console.log('📧 BREVO_API_KEY:', process.env.BREVO_API_KEY ? '✅ Set' : '❌ Missing');

// ===== SEND EMAIL USING BREVO API =====
const sendBrevoEmail = async (mailOptions) => {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.error('❌ BREVO_API_KEY is missing');
    return false;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: 'Scentify',
          email: 'scentify25@gmail.com',
        },
        to: [{ email: mailOptions.to }],
        subject: mailOptions.subject,
        textContent: mailOptions.text,
        htmlContent: mailOptions.html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Brevo API error');
    }

    const data = await response.json();
    console.log('✅ Email sent via Brevo API');
    console.log('📨 Message ID:', data.messageId);
    return true;
  } catch (error) {
    console.error('❌ Brevo API error:', error.message);
    return false;
  }
};

// ===== HELPER: Sanitize email input =====
const sanitizeEmail = (text) => {
  if (!text) return '';
  return text
    .replace(/[<>{}|\\^~\[\]]/g, '')
    .trim();
};

// ===== HELPER: Safe order ID =====
const getSafeOrderId = (order) => {
  if (!order || !order._id) return 'N/A';
  return order._id.toString();
};

const getSafeOrderIdShort = (order) => {
  const id = getSafeOrderId(order);
  return id.slice(-6) || 'N/A';
};

// ===== SEND ORDER CONFIRMATION EMAIL =====
export const sendOrderConfirmation = async (order, userEmail) => {
  try {
    if (!order || !userEmail) {
      console.error('❌ Missing order or email');
      return false;
    }

    const sanitizedEmail = sanitizeEmail(userEmail);
    if (!sanitizedEmail || !sanitizedEmail.includes('@')) {
      console.error('❌ Invalid email address');
      return false;
    }

    console.log(`📧 Preparing email for: ${sanitizedEmail}`);

    const orderId = getSafeOrderId(order);
    const orderIdShort = getSafeOrderIdShort(order);

    // ===== ORDER ITEMS TABLE =====
    const orderItemsHtml = order.orderItems ? order.orderItems.map(item => `
      <tr>
        <td style="padding: 8px 10px; border-bottom: 1px solid #eee;">${sanitizeEmail(item.name) || 'Unknown'}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #eee; text-align: center;">${Number(item.quantity) || 0}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${Number(item.price).toFixed(0) || 0}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${(Number(item.price) * Number(item.quantity)).toFixed(0) || 0}</td>
      </tr>
    `).join('') : '';

    // ===== FIXED: Use Vercel URL for track order =====
    const frontendUrl = process.env.FRONTEND_URL || 'https://scentifypurfume.vercel.app';
    const trackOrderLink = `${frontendUrl}/track-order`;

    // ===== PLAIN TEXT VERSION =====
    const plainText = `
Scentify Order Confirmation

Order ID: ${orderId}
Date: ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
Payment: ${order.paymentMethod || 'N/A'}

Items:
${order.orderItems ? order.orderItems.map(item => `  ${sanitizeEmail(item.name)} x ${item.quantity} = Rs. ${(Number(item.price) * Number(item.quantity)).toFixed(0)}`).join('\n') : '  No items'}

Subtotal: Rs. ${Number(order.itemsPrice).toFixed(0) || 0}
Shipping: ${order.shippingPrice === 0 ? 'FREE' : 'Rs. ' + Number(order.shippingPrice).toFixed(0) || 0}
Total: Rs. ${Number(order.totalPrice).toFixed(0) || 0}

Shipping to:
${order.shippingAddress ? sanitizeEmail(order.shippingAddress.fullName) : 'N/A'}
${order.shippingAddress ? sanitizeEmail(order.shippingAddress.address) : ''}
${order.shippingAddress ? sanitizeEmail(order.shippingAddress.city) : ''}
${order.shippingAddress ? sanitizeEmail(order.shippingAddress.phone) : ''}

Track your order: ${trackOrderLink}

Questions? Reply to this email or contact us at ${process.env.EMAIL_USER}

Thank you,
Scentify
    `;

    const mailOptions = {
      from: 'scentify25@gmail.com',
      to: sanitizedEmail,
      subject: `Your order #${orderIdShort} is confirmed`,
      text: plainText,
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
                  <tr>
                    <td align="center" style="padding-bottom: 20px;">
                      <h1 style="color: #2d1b12; margin: 0; font-size: 28px;">Scentify</h1>
                      <p style="color: #8b7355; margin: 5px 0 0; font-size: 16px;">Thank You for Your Order</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #fdf8f3; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px;">
                      <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Order ID:</strong> ${orderId}</p>
                      <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Date:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                      <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Payment:</strong> ${order.paymentMethod || 'N/A'}</p>
                    </td>
                  </tr>
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
                            <td style="padding: 10px; text-align: right; font-weight: bold;">Rs. ${Number(order.itemsPrice).toFixed(0) || 0}</td>
                          </tr>
                          <tr>
                            <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Shipping:</td>
                            <td style="padding: 10px; text-align: right; font-weight: bold;">${order.shippingPrice === 0 ? 'FREE' : 'Rs. ' + Number(order.shippingPrice).toFixed(0) || 0}</td>
                          </tr>
                          <tr style="border-top: 2px solid #2d1b12;">
                            <td colspan="3" style="padding: 12px 10px; text-align: right; font-weight: bold; font-size: 18px; color: #2d1b12;">Total:</td>
                            <td style="padding: 12px 10px; text-align: right; font-weight: bold; font-size: 18px; color: #2d1b12;">Rs. ${Number(order.totalPrice).toFixed(0) || 0}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #fdf8f3; border-radius: 12px; padding: 16px 20px;">
                      <h3 style="color: #2d1b12; margin: 0 0 8px; font-size: 16px;">Shipping Address</h3>
                      <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>${order.shippingAddress ? sanitizeEmail(order.shippingAddress.fullName) : 'N/A'}</strong></p>
                      <p style="margin: 4px 0; color: #555; font-size: 14px;">${order.shippingAddress ? sanitizeEmail(order.shippingAddress.address) : ''}</p>
                      <p style="margin: 4px 0; color: #555; font-size: 14px;">${order.shippingAddress ? sanitizeEmail(order.shippingAddress.city) : ''}</p>
                      <p style="margin: 4px 0; color: #555; font-size: 14px;">${order.shippingAddress ? sanitizeEmail(order.shippingAddress.phone) : ''}</p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 24px 0 10px;">
                      <a href="${trackOrderLink}" style="display: inline-block; background-color: #2d1b12; color: #ffffff; padding: 14px 40px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px;">Track Your Order</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="text-align: center; padding: 20px 0 0; color: #a89a8e; font-size: 12px; border-top: 1px solid #f0e8e0;">
                      <p style="margin: 4px 0;">You received this email because you placed an order with Scentify.</p>
                      <p style="margin: 4px 0;">© 2026 Scentify</p>
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

    // ===== SEND USING BREVO API =====
    const result = await sendBrevoEmail(mailOptions);
    return result;

  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

// ===== SEND ADMIN NOTIFICATION EMAIL =====
export const sendAdminNotification = async (order) => {
  try {
    if (!order) {
      console.error('❌ Missing order for admin notification');
      return false;
    }

    const orderId = getSafeOrderId(order);
    const orderIdShort = getSafeOrderIdShort(order);
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
      from: 'scentify25@gmail.com',
      to: adminEmail,
      subject: `New Order #${orderIdShort} - ${order.shippingAddress ? sanitizeEmail(order.shippingAddress.fullName) : 'Customer'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f6f2; border-radius: 12px;">
          <h1 style="color: #2d1b12; margin: 0 0 20px;">🛍️ New Order!</h1>
          <div style="background: white; padding: 20px; border-radius: 10px;">
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Customer:</strong> ${order.shippingAddress ? sanitizeEmail(order.shippingAddress.fullName) : 'N/A'}</p>
            <p><strong>Email:</strong> ${order.shippingAddress ? sanitizeEmail(order.shippingAddress.email) : 'N/A'}</p>
            <p><strong>Phone:</strong> ${order.shippingAddress ? sanitizeEmail(order.shippingAddress.phone) : 'N/A'}</p>
            <p><strong>Total:</strong> Rs. ${Number(order.totalPrice).toFixed(0) || 0}</p>
            <p><strong>Payment:</strong> ${order.paymentMethod || 'N/A'}</p>
            <p><strong>Items:</strong> ${order.orderItems ? order.orderItems.length : 0}</p>
            <p style="margin-top: 20px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/orders/${orderId}" style="background: #2d1b12; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; display: inline-block;">View Order Details</a>
            </p>
          </div>
          <p style="color: #888; font-size: 12px; margin-top: 20px; text-align: center;">© 2026 Scentify</p>
        </div>
      `,
    };

    // ===== SEND USING BREVO API =====
    const result = await sendBrevoEmail(mailOptions);
    return result;

  } catch (error) {
    console.error('❌ Admin email error:', error.message);
    return false;
  }
};

export default { sendOrderConfirmation, sendAdminNotification };