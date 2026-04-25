import React from "react";

const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-gray-600 font-medium">
          Loading your location...
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;