import React from "react";

const ModalWithBackdrop = ({
  show,
  onHide,
  closeIcon = true,
  width = "auto",
  height = "auto",
  borderRadius = "8px",
  animation = true,
  backdropStyle = {},
  children,
  mobileWidth = "90%",
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      style={backdropStyle}
      onClick={onHide} // close modal when clicking outside
    >
      <div
        className={`bg-white relative shadow-lg ${
          animation ? "transition-all duration-300 ease-in-out transform scale-100" : ""
        }`}
        style={{
          width: width === "100%" ? "100%" : width,
          maxWidth: mobileWidth,
          height,
          borderRadius,
        }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {closeIcon && (
          <button
            onClick={onHide}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold"
          >
            &times;
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default ModalWithBackdrop;
