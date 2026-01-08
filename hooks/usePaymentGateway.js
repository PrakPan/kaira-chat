// hooks/usePaymentGateway.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { openNotification } from '../store/actions/notification';
import revolutPaymentHandler from '../services/payment/revolutPaymentHandler';
import paymentGatewayService from '../services/payment/paymentGatewayService';
import setCart from '../store/actions/Cart';

const usePaymentGateway = (props) => {
  const dispatch = useDispatch();
  
  // State management
  const [currentGateway, setCurrentGateway] = useState(null);
  const [gatewayLoadError, setGatewayLoadError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [revolutInstance, setRevolutInstance] = useState(null);
  
  // Refs to prevent multiple initializations
  const initializationAttempted = useRef(false);
  const cleanupRef = useRef(false);

  // Initialize payment gateway
  const initializePaymentGateway = useCallback(async () => {
    if (initializationAttempted.current || typeof window === 'undefined') {
      return;
    }

    initializationAttempted.current = true;

    try {
      const gateway = await paymentGatewayService.loadGatewayWithFallback();
      setCurrentGateway(gateway);
      console.log(`Payment gateway initialized: ${gateway}`);

      setIsInitialized(true);
      setGatewayLoadError(null);
    } catch (error) {
      console.error("Failed to initialize payment gateway:", error);
      setGatewayLoadError(error.message);
      setIsInitialized(false);
      
      dispatch(
        openNotification({
          text: "Payment system initialization failed. Please refresh the page.",
          heading: "Error!",
          type: "error",
        })
      );
    }
  }, [dispatch]);

  const getCreatedOrderId = (data) => {
    return data?.sales
      ?.flatMap(sale => sale.orders || [])
      ?.find(order => order.status === "Created")
      ?.order_id;
  };

  const getCreatedOrder = (data) => {
    return data?.sales
      ?.flatMap(sale => sale.orders || [])
      ?.find(order => order.status === "Created");
  };

  // Razorpay payment handler
  const startRazorpayHandler = useCallback((data, paymentType, callbacks = {}) => {
    if (typeof window === 'undefined' || !window.Razorpay) {
      console.error('Razorpay not loaded');
      callbacks.onError?.();
      return;
    }

    const createdOrderId = getCreatedOrderId(data);

    if (!createdOrderId) {
      console.error("No order with status Created found");
      callbacks.onError?.();
      return;
    }

    const razorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: data.amount * 100 || data?.discounted_cost * 100,
      name: "The Tarzan Way Payment Portal",
      description: "Payment for your itinerary",
      image: "https://bitbucket.org/account/thetarzanway/avatar/256/?ts=1555263480",
      order_id: createdOrderId,
      modal: {
        ondismiss: function () {
          setPaymentLoading(false);
          callbacks.onCancel?.();
        },
      },
      handler: function (response) {
        handlePaymentVerification(response, "Razorpay", paymentType, callbacks);
      },
      prefill: {
        name: props?.name,
        email: props?.email,
        contact: props?.phone,
      },
      theme: {
        color: "#F7e700",
      },
    };

    try {
      const rzp1 = new window.Razorpay(razorpayOptions);
      rzp1.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      tryAlternativeGateway(data, paymentType, callbacks);
    }
  }, [props?.name, props?.email, props?.phone]);

  // Revolut payment handler - FIXED VERSION
  const startRevolutHandler = useCallback(async (data, paymentType, callbacks = {}) => {
    try {
      const createdOrder = getCreatedOrder(data);

      if (!createdOrder || !createdOrder.public_id) {
        console.error("No order with public_id found");
        callbacks.onError?.();
        return;
      }

      console.log("Revolut Order Data:", createdOrder);

      // Initialize Revolut with the public_id (this validates the token)
      // For Revolut, public_id is used for initialization and payment
      const revolutCheckout = await revolutPaymentHandler.initialize(createdOrder.public_id);
      setRevolutInstance(revolutCheckout);

      // Prepare order data - only pass what Revolut expects
      const orderData = {
        public_id: createdOrder.public_id,  // This is the token Revolut needs
        customer_email: props?.email,
        // Store your backend order_id separately for verification
        metadata: {
          order_id: createdOrder.order_id, // Your backend order ID
          payment_type: paymentType
        }
      };

      await revolutPaymentHandler.openPaymentModal(orderData, {
        onSuccess: (response) => {
          // Combine Revolut's response with your backend order ID
          const verificationData = {
            ...response,
            order_id: createdOrder.order_id, // Include backend order ID
            public_id: createdOrder.public_id,
            payment_type: paymentType
          };
          handlePaymentVerification(verificationData, "Revolut", paymentType, callbacks);
        },
        onError: (error) => {
          console.error("Revolut payment error:", error);
          setPaymentLoading(false);
          tryAlternativeGateway(data, paymentType, callbacks);
        },
        onCancel: () => {
          setPaymentLoading(false);
          callbacks.onCancel?.();
          dispatch(
            openNotification({
              text: "Payment was cancelled",
              heading: "Payment Cancelled",
              type: "warning",
            })
          );
        },
      });
    } catch (error) {
      console.error("Error starting Revolut payment:", error);
      tryAlternativeGateway(data, paymentType, callbacks);
    }
  }, [props?.email, dispatch]);

  // Main payment handler router
  const startPaymentHandler = useCallback((data, paymentType, callbacks = {}) => {
    if (!currentGateway) {
      dispatch(
        openNotification({
          text: "Payment gateway not initialized. Please refresh the page.",
          heading: "Error!",
          type: "error",
        })
      );
      setPaymentLoading(false);
      callbacks.onError?.();
      return;
    }

    setPaymentLoading(true);

    if (currentGateway === "Razorpay") {
      startRazorpayHandler(data, paymentType, callbacks);
    } else if (currentGateway === "Revolut") {
      startRevolutHandler(data, paymentType, callbacks);
    }
  }, [currentGateway, startRazorpayHandler, startRevolutHandler, dispatch]);

  // Try alternative gateway if current fails
  const tryAlternativeGateway = useCallback(async (data, paymentType, callbacks = {}) => {
    // Clean up current gateway first
    if (currentGateway === "Revolut" && revolutInstance) {
      try {
        revolutPaymentHandler.destroy();
        setRevolutInstance(null);
      } catch (error) {
        console.error("Error destroying Revolut instance:", error);
      }
    }

    const availableGateways = paymentGatewayService.getAvailableGateways();
    const currentIndex = availableGateways.indexOf(currentGateway);
    const nextGateway = availableGateways[(currentIndex + 1) % availableGateways.length];

    if (nextGateway === currentGateway) {
      dispatch(
        openNotification({
          text: "All payment gateways failed. Please try again later.",
          heading: "Error!",
          type: "error",
        })
      );
      setPaymentLoading(false);
      callbacks.onError?.();
      return;
    }

    try {
      dispatch(
        openNotification({
          text: `Switching to alternative payment method...`,
          heading: "Please Wait",
          type: "info",
        })
      );

      // Load the new gateway script
      await paymentGatewayService.loadGatewayScript(nextGateway);
      
      // Set the new gateway
      setCurrentGateway(nextGateway);
      
      // Small delay to ensure SDK is fully loaded
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Retry payment with new gateway
      if (nextGateway === "Razorpay") {
        startRazorpayHandler(data, paymentType, callbacks);
      } else if (nextGateway === "Revolut") {
        startRevolutHandler(data, paymentType, callbacks);
      }
    } catch (error) {
      console.error("Failed to switch gateway:", error);
      dispatch(
        openNotification({
          text: "Failed to initialize alternative payment method.",
          heading: "Error!",
          type: "error",
        })
      );
      setPaymentLoading(false);
      callbacks.onError?.();
    }
  }, [currentGateway, revolutInstance, dispatch, startRazorpayHandler, startRevolutHandler]);

  // Unified payment verification handler
  const handlePaymentVerification = useCallback(async (
    response,
    gateway,
    paymentType,
    callbacks = {}
  ) => {
    setPaymentLoading(true);

    try {
      const verifyPayload = paymentGatewayService.prepareVerifyPayload(response, gateway);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_MERCURY_API_URL}/payment/verify/`,
        verifyPayload,
        { headers: { Authorization: `Bearer ${props?.token}` } }
      );

      setPaymentLoading(false);

      dispatch(
        openNotification({
          text: "Payment successful!",
          heading: "Success",
          type: "success",
        })
      );

      // Clean up payment instance after successful payment
      if (gateway === "Revolut" && revolutInstance) {
        revolutPaymentHandler.destroy();
        setRevolutInstance(null);
      }

      callbacks.onSuccess?.(res.data, paymentType);
    } catch (err) {
      setPaymentLoading(false);
      console.error("Payment verification error:", err);
      
      dispatch(
        openNotification({
          text: err?.response?.data?.message || "Payment verification failed",
          heading: "Error!",
          type: "error",
        })
      );

      callbacks.onError?.(err);
    }
  }, [dispatch, props?.token, revolutInstance]);

  // Initiate payment (full or lock-in)
  const initiatePayment = useCallback(async (paymentType, Cart, callbacks = {}) => {
    setPaymentLoading(true);

    try {
      const payload = paymentGatewayService.prepareInitiatePayload(
        { id: Cart?.id, type: paymentType },
        currentGateway
      );

      const { paymentInitiate } = await import('../services/sales/itinerary/Purchase');
      
      const response = await paymentInitiate.post("", payload, {
        headers: { Authorization: `Bearer ${props?.token}` },
      });

      if (response.data) {
        dispatch(setCart(response.data));
        
        const sale = response.data?.sales?.find(
          (sale) => sale.payment_type === paymentType && sale.status === "Created"
        );

        if (!sale || !sale.orders?.[0]) {
          setPaymentLoading(false);
          dispatch(
            openNotification({
              text: "Payment order not found. Please refresh and try again.",
              heading: "Error!",
              type: "error",
            })
          );
          callbacks.onError?.();
          return;
        }

        const paymentData = {
          amount: sale.remaining_amount || response.data.total_payable_amount,
          sales: [sale],
          discounted_cost: response.data.discounted_cost,
        };

        startPaymentHandler(paymentData, paymentType, callbacks);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      
      const errorMsg =
        error?.response?.data?.errors?.[0]?.message?.[0] ||
        error?.response?.data?.message ||
        "Something went wrong";
      
      dispatch(
        openNotification({
          text: errorMsg,
          heading: "Error!",
          type: "error",
        })
      );
      
      setPaymentLoading(false);
      callbacks.onError?.(error);
    }
  }, [currentGateway, dispatch, props?.token, startPaymentHandler]);

  // Initialize on mount
  useEffect(() => {
    initializePaymentGateway();

    return () => {
      if (!cleanupRef.current) {
        // Clean up any payment instances
        if (currentGateway === "Revolut") {
          revolutPaymentHandler.destroy();
          setRevolutInstance(null);
        }
        cleanupRef.current = true;
      }
    };
  }, [initializePaymentGateway]);

  return {
    currentGateway,
    gatewayLoadError,
    paymentLoading,
    isInitialized,
    initiatePayment,
    startPaymentHandler,
    setPaymentLoading,
  };
};

export default usePaymentGateway;