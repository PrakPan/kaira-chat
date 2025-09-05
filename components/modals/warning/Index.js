import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FaX } from "react-icons/fa6";

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
  successMessage = "Operation completed successfully",
  loadingMessage = "Processing your request...",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningApiCalled, setWarningApiCalled] = useState(false);

  useEffect(() => {
    if (isOpen && !warningApiCalled) {
      handleInitialWarningRequest();
    }
  }, [isOpen]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setShowWarningModal(false);
      setWarningMessage("");
      setWarningApiCalled(false);
    }
  }, [isOpen]);

  const handleInitialWarningRequest = async () => {
    if (!warningApiCall || !requestData) {
      console.error("Warning API call or request data is missing");
      onError("Configuration error: Missing warning API call or request data");
      return;
    }

    setIsLoading(true);
    setWarningApiCalled(true);
    
    try {
      // Call the warning API first
        console.log("Calling warning API with:", requestData);
      console.log("Warning API function:", warningApiCall);
      const warningResponse = await warningApiCall(requestData);
      
      // Check if we should show warning based on show_warning field
      if (warningResponse?.data?.show_warning === true) {
        // Show warning modal with the warning message
        setWarningMessage(warningResponse.data.warning || "Please confirm this action.");
        setShowWarningModal(true);
        setIsLoading(false);
      } else {
        // Proceed directly with booking if show_warning is false
        await proceedWithBooking();
      }
      
    } catch (error) {
      setIsLoading(false);
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
      
      onError(errorMsg);
      onClose(); // Close modal on warning API failure
    }
  };

  const proceedWithBooking = async () => {
    if (!bookingApiCall || !requestData) {
      console.error("Booking API call or request data is missing");
      onError("Configuration error: Missing booking API call or request data");
      return;
    }

    try {
      setIsLoading(true);
      setShowWarningModal(false); // Hide warning modal if it was showing
      
      const response = await bookingApiCall(requestData);
      
      setIsLoading(false);
      onSuccess(response?.data, successMessage);
      onClose();
    } catch (error) {
      setIsLoading(false);
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
    }
  };

  const handleWarningConfirm = async () => {
    await proceedWithBooking();
  };

  const handleWarningCancel = () => {
    setShowWarningModal(false);
    onClose();
  };

  const handleCancel = () => {
    if (isLoading) {
      return; // Don't allow closing while loading
    }
    
    if (showWarningModal) {
      handleWarningCancel();
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed z-[1666] inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full max-w-lg md:mx-4 mb-0 md:mb-auto md:rounded-lg rounded-t-2xl md:rounded-b-lg relative transform transition-transform duration-300 ease-out animate-slide-up md:animate-none max-h-[90vh] md:max-h-none overflow-hidden">
        
        {/* Mobile handle bar */}
        <div className="md:hidden flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Close button - only show when not loading */}
        {!isLoading && (
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 md:top-4 md:right-4 p-2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
          >
            <FaX size={16} />
          </button>
        )}

        {/* Content */}
        <div className="px-6 pb-6 pt-2 md:pt-6 max-h-[calc(90vh-8rem)] md:max-h-none overflow-y-auto">
          
          {/* Header */}
          <h2 className="text-xl font-semibold mb-4 md:mb-6 pr-8">
            {showWarningModal ? "Warning Confirmation" : title}
          </h2>

          {/* Message */}
          <div className="text-gray-700 mb-6">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                {loadingMessage}
              </div>
            ) : showWarningModal ? (
              <div className="text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-4">
                {warningMessage}
              </div>
            ) : (
              message
            )}
          </div>

          {/* Buttons - Only show when there's a warning to confirm and not loading */}
          {!isLoading && showWarningModal && (
            <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 justify-end border-t-2 pt-4">
              <button
                onClick={handleWarningCancel}
                className="w-full md:w-auto px-6 py-2 md:py-2 text-gray-600 border rounded hover:bg-gray-50 transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleWarningConfirm}
                className="w-full md:w-auto px-6 py-2 md:py-2 bg-[#07213A] text-white rounded hover:bg-[#0a2942] transition-colors cursor-pointer text-center"
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Hook for using the modal
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