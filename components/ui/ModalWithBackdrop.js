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
  showPhoneView = false, // New prop
}) => {
  if (!show) return null;

  // Calculate responsive width based on showPhoneView
  const getResponsiveWidth = () => {
    if (showPhoneView) {
      // For showPhoneView: 85% on mobile, 60% on desktop
      return {
        base: "85%",
        desktop: "32%",
      };
    }
    // Default behavior
    return {
      base: mobileWidth,
      desktop: width === "100%" ? "100%" : width,
    };
  };

  const responsiveWidth = getResponsiveWidth();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-[${paddingX}] py-[${paddingY}]`}
      style={backdropStyle}
      onClick={onHide} // close modal when clicking outside
    >
      <div
        className={`bg-white relative shadow-lg ${
          animation ? "transition-all duration-300 ease-in-out" : ""
        }`}
        style={{
          width: responsiveWidth.base,
          maxWidth: responsiveWidth.base,
          height,
          borderRadius,
          paddingLeft: paddingX,
          paddingRight: paddingX,
          paddingTop: paddingY,
          paddingBottom: paddingY,
        }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Desktop width override */}
        <style jsx>{`
          @media (min-width: 768px) {
            div {
              width: ${responsiveWidth.desktop} !important;
              max-width: ${responsiveWidth.desktop} !important;
            }
          }
        `}</style>

        {closeIcon && (
          <button
            onClick={onHide}
            style={{
              position: 'absolute',
              top: paddingY,
              right: paddingY,
            }}
             className="p-2 mt-1"
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