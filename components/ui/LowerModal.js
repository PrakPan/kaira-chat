import React from "react";
import Image from "next/image";
const BottomModal = ({
  show,
  onHide,
  closeIcon = true,
  height = "60%", 
  width = "100%",
  borderRadius = "0 0", 
  animation = true,
  backdropStyle = {},
  children,
  paddingX = "0px",
  paddingY = "0px",
}) => {
  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm`}
      style={backdropStyle}
      onClick={onHide}
    >
      <div
        className={`bg-white relative shadow-lg w-full max-h-[90vh] overflow-y-auto px-[${paddingX}] py-[${paddingY}] ${
          animation
            ? "transition-all duration-300 ease-in-out transform translate-y-0"
            : ""
        }`}
        style={{
          height,
          maxWidth: width,
          borderRadius,
          paddingLeft: paddingX,
          paddingRight: paddingX,
          paddingTop: paddingY,
          paddingBottom: paddingY,
        }}
        onClick={(e) => e.stopPropagation()} 
      >
        {closeIcon && (
          <button
            onClick={onHide}
            style={{
              position: 'absolute',
              top: paddingY,
              right: paddingY,
            }}
          >
            <div className="p-[3.75px]"><Image src="/close.svg" width={10.5} height={10.5} /></div>
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default BottomModal;
