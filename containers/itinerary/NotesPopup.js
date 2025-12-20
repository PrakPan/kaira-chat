import React, { useEffect, useState } from 'react';
import { getWithExpiry, setWithExpiry } from '../../services/localStorageUtils';

const NotesPopup = ({ notes, itineraryId, onClose, isLoggedIn }) => {
  const [isVisible, setIsVisible] = useState(false);

  const getStorageKey = () => `notes_dismissed_${itineraryId}`;

  useEffect(() => {
    if (!isLoggedIn || !notes || !notes.length || !itineraryId) return;

    const storageKey = getStorageKey();
    const isDismissed = getWithExpiry(storageKey);
    
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, [notes, itineraryId, isLoggedIn]);

  const handleClose = () => {
    const storageKey = getStorageKey();
    setWithExpiry(storageKey, "true", 24 * 60 * 60 * 1000);

    
    setIsVisible(false);
    
    if (onClose) onClose();
  };

  // Don't render if user is not logged in or other conditions not met
  if (!isLoggedIn || !isVisible || !notes || !notes.length) return null;

  console.log("Notes", notes);

  return (
   <div className="fixed inset-0 z-[1600] flex items-end md:items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-25" 
        onClick={handleClose}
      />
      
      <div className="relative bg-white w-full md:max-w-[31rem] md:w-full md:rounded-lg shadow-xl border-t md:border border-gray-200 max-h-[40vh] md:max-h-[40vh] flex flex-col md:rounded-t-lg">
        {/* Header */}
        <div className="bg-blue-50 border-b border-gray-200 md:rounded-t-lg flex-shrink-0">
          <div className="flex items-center justify-between p-2 relative">
           
            <div className="w-12 h-1 bg-gray-300 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 md:hidden"></div>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-2 md:mt-0 flex-1">
              Important Notes!
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close popup"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

       
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
          <style jsx>{`
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <ul className="p-0">
            {notes?.map((note, index) => (
              <li key={index} className="flex items-start gap-3 py-1">
                <div className="flex-shrink-0 w-1.5 h-1.5 bg-black rounded-full mt-2"></div>
                <span className="text-gray-700 text-sm leading-relaxed flex-1">{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-2 flex justify-end border-t border-gray-200 bg-gray-50 md:rounded-b-lg flex-shrink-0">
          <button
            onClick={handleClose}
            className="w-fit bg-[#07213A] text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesPopup;
