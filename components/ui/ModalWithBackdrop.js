import React from "react";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
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
  paddingX = "0px",
  paddingY = "0px",
}) => {
  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-[${paddingX}] py-[${paddingY}]`}
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
          paddingLeft: paddingX,
          paddingRight: paddingX,
          paddingTop: paddingY,
          paddingBottom: paddingY,
        }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
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
            <RxCross2
          style={{
            fontSize: "1.5rem",
            cursor: "pointer",
            zIndex: 999,
          }}
          />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default ModalWithBackdrop;
