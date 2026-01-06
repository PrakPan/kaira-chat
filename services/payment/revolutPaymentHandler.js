// services/payment/revolutPaymentHandler.js

// Create a functional service using closures
const createRevolutPaymentHandler = () => {
  let revolutCheckout = null;

  // Initialize Revolut Checkout
  const initialize = async (publicKey) => {
    if (typeof window === 'undefined') {
      throw new Error('Window not available');
    }

    if (typeof window.RevolutCheckout === 'undefined') {
      throw new Error('Revolut SDK not loaded');
    }

    try {
      revolutCheckout = await window.RevolutCheckout(publicKey);
      console.log('Revolut Checkout initialized successfully');
      return revolutCheckout;
    } catch (error) {
      console.error('Failed to initialize Revolut:', error);
      throw error;
    }
  };

  // Create and open Revolut payment modal
  const openPaymentModal = async (orderData, callbacks = {}) => {
    const {
      onSuccess = () => {},
      onError = () => {},
      onCancel = () => {}
    } = callbacks;

    console.log("Order Data",orderData);

    try {
      if (!revolutCheckout) {
        throw new Error('Revolut Checkout not initialized');
      }

      // Create payment with Revolut
      const payment = await revolutCheckout.payWithPopup({
        token: orderData.public_id,
        email: orderData.customer_email,
        savePaymentMethodFor: 'merchant',
        
        // Customization options
        locale: 'en',
        
        // Callbacks
        onSuccess: (orderId) => {
          console.log('Revolut payment successful:', orderId);
          onSuccess({ order_id: orderId });
        },
        
        onError: (error) => {
          console.error('Revolut payment error:', error);
          onError(error);
        },
        
        onCancel: () => {
          console.log('Revolut payment cancelled');
          onCancel();
        }
      });

      return payment;
    } catch (error) {
      console.error('Error opening Revolut payment modal:', error);
      throw error;
    }
  };

  // Alternative: Redirect method (if popup doesn't work)
  const redirectToPayment = (orderData) => {
    if (!revolutCheckout) {
      throw new Error('Revolut Checkout not initialized');
    }

    revolutCheckout.redirect({
      token: orderData.public_id,
      email: orderData.customer_email
    });
  };

  // Destroy instance
  const destroy = () => {
    if (revolutCheckout) {
      try {
        revolutCheckout.destroy();
      } catch (error) {
        console.error('Error destroying Revolut instance:', error);
      }
      revolutCheckout = null;
    }
  };

  // Check if initialized
  const isInitialized = () => revolutCheckout !== null;

  return {
    initialize,
    openPaymentModal,
    redirectToPayment,
    destroy,
    isInitialized
  };
};

// Create singleton instance
let handlerInstance = null;

const getRevolutPaymentHandler = () => {
  if (!handlerInstance) {
    handlerInstance = createRevolutPaymentHandler();
  }
  return handlerInstance;
};

export default getRevolutPaymentHandler();