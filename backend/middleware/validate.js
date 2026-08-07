import validator from 'validator';

export const validateOrderInput = (data) => {
  const errors = {};

  // Validate email
  if (data.email && !validator.isEmail(data.email)) {
    errors.email = 'Invalid email address';
  }

  // Validate phone (11 digits)
  if (data.phone) {
    const cleanPhone = data.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 11) {
      errors.phone = 'Phone number must be 11 digits';
    }
  }

  // Validate price
  if (data.totalPrice && data.totalPrice < 0) {
    errors.totalPrice = 'Total price cannot be negative';
  }

  return errors;
};

export const validateProductInput = (data) => {
  const errors = {};

  if (!data.name || data.name.length < 2) {
    errors.name = 'Product name must be at least 2 characters';
  }

  if (!data.price || data.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  if (data.description && data.description.length > 2000) {
    errors.description = 'Description cannot exceed 2000 characters';
  }

  return errors;
};

export const validateReviewInput = (data) => {
  const errors = {};

  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.rating = 'Rating must be between 1 and 5';
  }

  if (!data.comment || data.comment.length < 3) {
    errors.comment = 'Comment must be at least 3 characters';
  }

  if (data.comment && data.comment.length > 500) {
    errors.comment = 'Comment cannot exceed 500 characters';
  }

  return errors;
};