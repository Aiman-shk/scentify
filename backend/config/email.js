// In createOrder function, after saving order:

// ===== SEND EMAILS IN BACKGROUND =====
const customerEmail = shippingAddress.email;
if (customerEmail) {
  // Send confirmation email to customer (no await)
  sendOrderConfirmation(createdOrder, customerEmail)
    .then(success => {
      if (success) {
        console.log(`✅ Confirmation email sent to ${customerEmail}`);
      } else {
        console.error(`❌ Failed to send confirmation email to ${customerEmail}`);
      }
    })
    .catch(err => console.error('❌ Email error:', err));
}

// Send admin notification (no await)
sendAdminNotification(createdOrder)
  .then(success => {
    if (success) {
      console.log('✅ Admin notification sent');
    } else {
      console.error('❌ Failed to send admin notification');
    }
  })
  .catch(err => console.error('❌ Admin email error:', err));