import React from 'react';

const NotesPopup = ({ notes, isVisible, onClose }) => {
  if (!isVisible || !notes) return null;

  // Split notes by comma and filter out empty strings
  const notesList = notes.split(',').map(note => note.trim()).filter(note => note);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-25" 
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mt-16 mr-4 border border-gray-200">
        {/* Header */}
        <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Important Notes
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close popup"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <ul className="space-y-3">
            {notesList.map((note, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700 text-sm leading-relaxed">{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesPopup;