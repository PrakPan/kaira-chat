import React from "react";

const BottomModal = ({
  show,
  onHide,
  closeIcon = true,
  height = "60%", 
  width = "100%",
  borderRadius = "16px 16px 0 0", 
  animation = true,
  backdropStyle = {},
  children,
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm"
      style={backdropStyle}
      onClick={onHide}
    >
      <div
        className={`bg-white relative shadow-lg w-full max-h-[90vh] overflow-y-auto ${
          animation
            ? "transition-all duration-300 ease-in-out transform translate-y-0"
            : ""
        }`}
        style={{
          height,
          maxWidth: width,
          borderRadius,
        }}
        onClick={(e) => e.stopPropagation()} 
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

export default BottomModal;
