// services/payment/revolutPaymentHandler.js

const createRevolutPaymentHandler = () => {
  let revolutCheckout = null;
  let currentPublicId = null;

  // Initialize Revolut Checkout with public_id (for token validation)
  const initialize = async (publicId) => {
    if (typeof window === 'undefined') {
      throw new Error('Window not available');
    }

    if (typeof window.RevolutCheckout === 'undefined') {
      throw new Error('Revolut SDK not loaded');
    }

    try {
      // Clean up any existing instance
      if (revolutCheckout) {
        destroy();
      }

      // Initialize with the public_id
      revolutCheckout = await window.RevolutCheckout(publicId);
      currentPublicId = publicId;
      console.log('Revolut Checkout initialized successfully with public_id:', publicId);
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

    console.log("Order Data for Revolut:", orderData);

    if (!revolutCheckout) {
      throw new Error('Revolut checkout not initialized');
    }

    try {
      // Check if we need to reinitialize with new public_id
      if (currentPublicId !== orderData.public_id) {
        console.log('Reinitializing Revolut with new public_id:', orderData.public_id);
        await initialize(orderData.public_id);
      }

      const paymentOptions = {
        email: orderData.customer_email,
        // savePaymentMethodFor: 'merchant',
        locale: 'en',
        ...(orderData.order_id && { orderId: orderData.order_id }),
        
        // Callbacks
        onSuccess: (revolutOrderId) => {
          console.log('Revolut payment successful. Revolut Order ID:', revolutOrderId);
          
          // Return combined response
          onSuccess({ 
            revolut_order_id: revolutOrderId,
            public_id: orderData.public_id,
            order_id: orderData.order_id || revolutOrderId,
            metadata: orderData.metadata || {}
          });
        },
        
        onError: (error) => {
          console.error('Revolut payment error details:', {
    message: error.message,
    code: error.code,
    details: error.details
  });
          onError(error);
        },
        
        onCancel: () => {
          console.log('Revolut payment cancelled');
          onCancel();
        }
      };

      // Open the payment modal
      const payment = await revolutCheckout.payWithPopup(paymentOptions);
      return payment;
    } catch (error) {
      console.error('Error opening Revolut payment modal:', error);
      throw error;
    }
  };

  // Destroy instance
  const destroy = () => {
    if (revolutCheckout) {
      try {
        // Check if destroy method exists
        if (typeof revolutCheckout.destroy === 'function') {
          revolutCheckout.destroy();
        }
      } catch (error) {
        console.error('Error destroying Revolut instance:', error);
      }
      revolutCheckout = null;
      currentPublicId = null;
      console.log('Revolut instance destroyed');
    }
  };

  // Check if initialized
  const isInitialized = () => revolutCheckout !== null;

  return {
    initialize,
    openPaymentModal,
    destroy,
    isInitialized
  };
};

// Create singleton instance
const revolutPaymentHandler = createRevolutPaymentHandler();

export default revolutPaymentHandler;