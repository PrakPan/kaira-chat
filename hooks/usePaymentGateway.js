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

      // If Revolut is loaded, initialize it
      if (gateway === "Revolut") {
        const revolutKey = process.env.NEXT_PUBLIC_REVOLUT_PUBLIC_KEY;
        if (revolutKey) {
          await revolutPaymentHandler.initialize(revolutKey);
        } else {
          console.warn('Revolut public key not found in environment variables');
        }
      }

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

  // Revolut payment handler
  const startRevolutHandler = useCallback(async (data, paymentType, callbacks = {}) => {
    try {
      if (!revolutPaymentHandler.isInitialized()) {
        const revolutKey = process.env.NEXT_PUBLIC_REVOLUT_PUBLIC_KEY;
        await revolutPaymentHandler.initialize(revolutKey);
      }

      console.log("OOORD",data);

      const createdOrder = data?.sales
  ?.flatMap(sale => sale.orders || [])
  ?.find(order => order.status === "Created");


      const orderData = {
        // revolut_token: data?.sales[0]?.orders[0]?.revolut_token,
        public_id: createdOrder?.public_id, 
        customer_email: props?.email,
      };

      await revolutPaymentHandler.openPaymentModal(orderData, {
        onSuccess: (response) => {
          handlePaymentVerification(response, "Revolut", paymentType, callbacks);
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

    if (currentGateway === "Razorpay") {
      startRazorpayHandler(data, paymentType, callbacks);
    } else if (currentGateway === "Revolut") {
      startRevolutHandler(data, paymentType, callbacks);
    }
  }, [currentGateway, startRazorpayHandler, startRevolutHandler, dispatch]);

  // Try alternative gateway if current fails
  const tryAlternativeGateway = useCallback(async (data, paymentType, callbacks = {}) => {
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

      await paymentGatewayService.loadGatewayScript(nextGateway);
      
      if (nextGateway === "Revolut") {
        const revolutKey = process.env.NEXT_PUBLIC_REVOLUT_PUBLIC_KEY;
        await revolutPaymentHandler.initialize(revolutKey);
      }
      
      setCurrentGateway(nextGateway);
      
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
  }, [currentGateway, dispatch, startRazorpayHandler, startRevolutHandler]);

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
  }, [dispatch, props?.token]);

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
      if (!cleanupRef.current && currentGateway === "Revolut") {
        revolutPaymentHandler.destroy();
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