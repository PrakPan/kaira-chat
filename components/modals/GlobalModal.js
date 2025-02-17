import React, { useState } from 'react';

const GlobalModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1003]">
      <div className="bg-white p-6 rounded-lg max-h-[90vh] max-w-[90vw] overflow-auto">
        <div className="flex justify-end">
          <button 
            className="text-black text-xl" 
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default GlobalModal;
