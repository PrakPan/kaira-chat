// services/payment/paymentGatewayService.js

const PAYMENT_GATEWAYS = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_PAYMENT_GATEWAYS
  ? JSON.parse(process.env.NEXT_PUBLIC_PAYMENT_GATEWAYS)
  : ["Razorpay", "Revolut"];

const DEFAULT_GATEWAY = process.env.NEXT_PUBLIC_DEFAULT_GATEWAY || "Razorpay";

// Create a functional service using closures
const createPaymentGatewayService = () => {
  let availableGateways = PAYMENT_GATEWAYS;
  let currentGateway = DEFAULT_GATEWAY;
  let loadedScripts = {};

  // Load payment gateway script dynamically
  const loadGatewayScript = (gateway) => {
    if (typeof window === 'undefined') {
      return Promise.reject(new Error('Window not available'));
    }

    if (loadedScripts[gateway]) {
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      
      if (gateway === "Razorpay") {
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
      } else if (gateway === "Revolut") {
        // Use production or sandbox based on environment
        const isProduction = process.env.NEXT_PUBLIC_REVOLUT_ENV === 'production';
        script.src =
        //  isProduction 
        //   ?
        //  "https://merchant.revolut.com/embed.js"

          "https://sandbox-merchant.revolut.com/embed.js";
      }

      script.async = true;
      
      script.onload = () => {
        loadedScripts[gateway] = true;
        console.log(`${gateway} script loaded successfully`);
        resolve(true);
      };

      script.onerror = (error) => {
        console.error(`Failed to load ${gateway} script:`, error);
        reject(new Error(`Failed to load ${gateway} payment gateway`));
      };

      // Check if script already exists
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingScript) {
        loadedScripts[gateway] = true;
        resolve(true);
        return;
      }

      document.body.appendChild(script);
    });
  };

  // Try to load gateway with fallback
  const loadGatewayWithFallback = async (preferredGateway = null) => {
    const gatewayToTry = preferredGateway || currentGateway;
    const gatewaysToTry = [
      gatewayToTry,
      ...availableGateways.filter(g => g !== gatewayToTry)
    ];

    for (const gateway of gatewaysToTry) {
      try {
        await loadGatewayScript(gateway);
        currentGateway = gateway;
        return gateway;
      } catch (error) {
        console.error(`Failed to load ${gateway}, trying next gateway...`,error.message);
        continue;
      }
    }

    throw new Error("All payment gateways failed to load");
  };

  // Get current active gateway
  const getCurrentGateway = () => currentGateway;

  // Set current gateway
  const setCurrentGateway = (gateway) => {
    currentGateway = gateway;
  };

  // Check if gateway is loaded
  const isGatewayLoaded = (gateway) => loadedScripts[gateway] || false;

  // Get available gateways
  const getAvailableGateways = () => availableGateways;

  // Prepare payment payload based on gateway
  const prepareInitiatePayload = (paymentInfo, gateway) => {
    return {
      payment_information_id: paymentInfo.id,
      payment_type: paymentInfo.type,
      gateway: gateway
    };
  };

  // Prepare verification payload based on gateway
  const prepareVerifyPayload = (response, gateway) => {
    if (gateway === "Razorpay") {
      return {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        order_id: response.order_id
      };
    } else if (gateway === "Revolut") {
      return {
        revolut_order_id: response.revolut_order_id,
        public_id: response.public_id,
        order_id: response.order_id || response.metadata?.order_id,
        payment_type: response.payment_type || response.metadata?.payment_type
      };
    }
    return response;
  };

  return {
    loadGatewayScript,
    loadGatewayWithFallback,
    getCurrentGateway,
    setCurrentGateway,
    isGatewayLoaded,
    getAvailableGateways,
    prepareInitiatePayload,
    prepareVerifyPayload
  };
};

// Create singleton instance
let serviceInstance = null;

const getPaymentGatewayService = () => {
  if (!serviceInstance) {
    serviceInstance = createPaymentGatewayService();
  }
  return serviceInstance;
};

export default getPaymentGatewayService();