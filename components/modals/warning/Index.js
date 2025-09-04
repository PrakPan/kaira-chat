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

  useEffect(() => {
    if (isOpen) {
      handleInitialRequest();
    }
  }, [isOpen]);

  const handleInitialRequest = async () => {
    setIsLoading(true);
    
    try {
      // Always call the warning API first
      const warningResponse = await warningApiCall(requestData);
      
      // Check if we should show warning based on show_warning field
      if (warningResponse.data.show_warning === true) {
        // Show warning modal with the warning message
        setWarningMessage(warningResponse.data.warning || "Please confirm this action.");
        setShowWarningModal(true);
        setIsLoading(false);
      } else {
        // Proceed directly with booking if show_warning is false
        await proceedWithBooking(requestData);
      }
      
    } catch (error) {
      setIsLoading(false);
      const errorMsg = error?.response?.data?.errors?.[0]?.message?.[0] || 
                     error.message || 
                     "An error occurred. Please try again.";
      onError(errorMsg);
    }
  };

  const proceedWithBooking = async (data) => {
    try {
      setIsLoading(true);
      const response = await bookingApiCall(data);
      setIsLoading(false);
      onSuccess(response.data, successMessage);
      onClose();
    } catch (error) {
      setIsLoading(false);
      const errorMsg = error?.response?.data?.errors?.[0]?.message?.[0] || 
                     error.message || 
                     "Booking failed. Please try again.";
      onError(errorMsg);
    }
  };

  const handleWarningConfirm = async () => {
    setShowWarningModal(false);
    await proceedWithBooking(requestData);
  };

  const handleWarningCancel = () => {
    setShowWarningModal(false);
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
    <div className="fixed z-[1666] inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full max-w-lg md:mx-4 mb-0 md:mb-auto md:rounded-lg rounded-t-2xl md:rounded-b-lg relative transform transition-transform duration-300 ease-out animate-slide-up md:animate-none max-h-[90vh] md:max-h-none overflow-hidden">
        
        {/* Mobile handle bar */}
        <div className="md:hidden flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Close button */}
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 md:top-4 md:right-4 p-2 text-gray-400 hover:text-gray-600 cursor-pointer z-10 disabled:opacity-50"
        >
          <FaX size={16} />
        </button>

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
              warningMessage
            ) : (
              message
            )}
          </div>

          {/* Buttons - Only show if not loading and there's a warning to confirm */}
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