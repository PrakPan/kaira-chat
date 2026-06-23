import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

const FONT_SANS = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_SERIF = "'Instrument Serif', 'Times New Roman', serif";


// Generic API Modal Component
const GenericAPIModal = ({
  isOpen,
  onClose,
  title,
  message,
  warningApiCall,
  bookingApiCall,
  requestData,
  onSuccess,
  onError,
  onCancel,
  successMessage = "Operation completed successfully",
  loadingMessage = "Processing your request...",
}) => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningApiCalled, setWarningApiCalled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const warningApiCalledRef = useRef(false);
useEffect(() => {
  if (isOpen && !warningApiCalledRef.current && !warningApiCalled && warningApiCall && requestData) {
    handleInitialWarningRequest();
  }
}, [isOpen, warningApiCall, requestData, warningApiCalled]);


  // Reset states when modal closes
 useEffect(() => {
  if (!isOpen) {
    setShowWarningModal(false);
    setWarningMessage("");
    warningApiCalledRef.current = false; 
  }
}, [isOpen]);

  const handleInitialWarningRequest = async () => {

    if (isProcessing || warningApiCalledRef.current || !warningApiCall || !requestData) {
    return;
  }

  warningApiCalledRef.current = true;
  setIsProcessing(true);


    setWarningApiCalled(true);
    
    try {
      // Call the warning API without showing any loader
      console.log("Calling warning API with:", requestData);
      console.log("Warning API function:", warningApiCall);
      const warningResponse = await warningApiCall(requestData);
      
      // Check if we should show warning based on show_warning field
      if (warningResponse?.data?.show_warning === true) {
        // Show warning modal with the warning message
        setWarningMessage(warningResponse.data.warning || "Please confirm this action.");
        setShowWarningModal(true);
      } else {
        // Proceed directly with booking if show_warning is false
        await proceedWithBooking();
      }
      
    } catch (error) {
      console.error("Warning API failed:", error);
      
      // Extract error message with better error handling
      let errorMsg = "Warning check failed. Please try again.";
      
      if (error?.response?.data) {
        if (error.response.data.errors?.[0]?.message?.[0]) {
          errorMsg = error.response.data.errors[0].message[0];
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      // Show error as notification and close modal
      onError(errorMsg);
      onClose(); 
    }finally {
  setIsProcessing(false); // RESET FLAG
}
  };

  const proceedWithBooking = async () => {
    if (isProcessing || !bookingApiCall || !requestData) {
      return;
    }

    setIsProcessing(true); 

    try {
     
      setShowWarningModal(false); // Hide warning modal if it was showing
      
      const response = await bookingApiCall(requestData);
      
   
      onSuccess(response?.data, successMessage);
      onClose();
    } catch (error) {
      console.error("Booking API failed:", error);
      
      // Extract error message with better error handling
      let errorMsg = "Booking failed. Please try again.";
      
      if (error?.response?.data) {
        if (error.response.data.errors?.[0]?.message?.[0]) {
          errorMsg = error.response.data.errors[0].message[0];
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      onError(errorMsg);
      onClose();
    }finally {
      setIsProcessing(false); // RESET FLAG
    }
  };

  const handleWarningConfirm = async () => {
    if (isProcessing) return;
    await proceedWithBooking();
  };

 const handleWarningCancel = () => {
  setShowWarningModal(false);
  if (onCancel) {
    onCancel();
  }
  onClose();
};

  const handleCancel = () => {
    
    
    if (showWarningModal) {
      handleWarningCancel();
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;


  return ReactDOM.createPortal(
    <div className="fixed z-[1666] inset-0 flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(11,18,32,0.35)",
          backdropFilter: "blur(1px)",
        }}
        onClick={handleCancel}
      />

      <div
        className="relative w-full max-w-lg md:mx-4 mb-0 md:mb-auto flex flex-col max-h-[90vh] md:max-h-none overflow-hidden rounded-t-[20px] md:rounded-[20px] transform transition-transform duration-300 ease-out animate-slide-up md:animate-none"
        style={{
          background: "#fafafa",
          boxShadow: "0 12px 44px rgba(11,18,32,0.20)",
        }}
      >
        {/* yellow top strip */}
        <div
          style={{
            height: 6,
            flexShrink: 0,
            background: "linear-gradient(90deg,#FFE600,#F2D700)",
          }}
        />

        {/* mobile drag handle */}
        <div className="md:hidden flex justify-center pt-2 pb-1 flex-shrink-0">
          <div
            style={{
              width: 44,
              height: 4,
              borderRadius: 999,
              background: "#E0DCCD",
            }}
          />
        </div>

        {/* Show warning modal content */}
        {showWarningModal && (
          <>
            {/* header */}
            <div className="flex items-start justify-between gap-3 px-5 pt-3 md:pt-5 flex-shrink-0">
              <div>
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 22,
                    fontWeight: 500,
                    lineHeight: 1.1,
                    letterSpacing: "-0.01em",
                    color: "#0B1220",
                  }}
                >
                  Dates change{" "}
                  <em
                    style={{
                      fontFamily: FONT_SERIF,
                      fontStyle: "italic",
                      fontWeight: 400,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    warning
                  </em>
                </div>
                <p
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 13,
                    color: "#5C5A55",
                    marginTop: 4,
                  }}
                >
                  Please review this change before confirming.
                </p>
              </div>

              <button
                onClick={handleCancel}
                aria-label="Close"
                className="flex-shrink-0 grid place-items-center transition-colors"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  border: "1px solid #E6E1D2",
                  background: "#FFFFFF",
                  color: "#5C5A55",
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* message */}
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-2">
              <div
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  color: "#2C2C2A",
                  border: "1px solid #E6E1D2",
                  background: "#FFFFFF",
                  borderRadius: 12,
                  padding: "12px 14px",
                }}
              >
                {warningMessage}
              </div>
            </div>

            {/* footer */}
            <div className="px-5 pt-2 pb-4 flex-shrink-0 flex flex-col-reverse md:flex-row gap-3 md:justify-end">
              <button
                onClick={handleWarningCancel}
                className="w-full md:w-auto transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#5C5A55",
                  background: "#FFFFFF",
                  border: "1px solid #E6E1D2",
                  padding: "12px 20px",
                  borderRadius: 12,
                }}
              >
                Cancel
              </button>
              <button
                disabled={isProcessing}
                onClick={handleWarningConfirm}
                className="w-full md:w-auto transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#FFFFFF",
                  background: "#0F1B2D",
                  padding: "12px 20px",
                  borderRadius: 12,
                }}
              >
                {isProcessing ? "Processing..." : "Confirm"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export const useGenericAPIModal = () => {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    warningApiCall: null,
    bookingApiCall: null,
    requestData: null,
    onSuccess: () => {},
    onError: () => {},
    onCancel: () => {},
    successMessage: "",
    loadingMessage: "",
  });

  const openModal = (config) => {
    setModalConfig({
      ...config,
      isOpen: true,
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({
      ...prev,
      isOpen: false,
    }));
  };

  const ModalComponent = () => (
    <GenericAPIModal
      {...modalConfig}
      onClose={closeModal}
    />
  );

  return {
    openModal,
    closeModal,
    ModalComponent,
    isOpen: modalConfig.isOpen,
  };
};

export default GenericAPIModal;