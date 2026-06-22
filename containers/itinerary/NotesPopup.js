import React, { useEffect, useState } from 'react';
import { getWithExpiry, setWithExpiry } from '../../services/localStorageUtils';
import useMediaQuery from '../../hooks/useMedia';

const FONT_SANS = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_SERIF = "'Instrument Serif', 'Times New Roman', serif";

const NotesPopup = ({ notes, itineraryId, onClose, isLoggedIn }) => {
  const isDesktop = useMediaQuery("(min-width:767px)");
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

  return (
    <div className="fixed inset-0 z-[1600] flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(11,18,32,0.35)", backdropFilter: "blur(1px)" }}
        onClick={handleClose}
      />

      <div
        className="relative w-full md:max-w-[31rem] md:w-full max-h-[78vh] md:max-h-[70vh] flex flex-col"
        style={{
          background: "#fafafa",
          borderRadius: isDesktop ? 20 : "20px 20px 0 0",
          overflow: "hidden",
          boxShadow: "0 12px 44px rgba(11,18,32,0.20)",
        }}
      >
        {/* yellow top strip — matches Settings / BotLoginModal */}
        <div
          style={{
            height: 6,
            flexShrink: 0,
            background: "linear-gradient(90deg,#FFE600,#F2D700)",
          }}
        />

        {/* mobile drag handle */}
        {!isDesktop && (
          <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
            <div style={{ width: 44, height: 4, borderRadius: 999, background: "#E0DCCD" }} />
          </div>
        )}

        {/* header */}
        <div className="flex items-start justify-between gap-3 px-4 pt-3 md:pt-5 flex-shrink-0">
          <div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: isDesktop ? 28 : 24,
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                color: "#0B1220",
              }}
            >
              Important{" "}
              <em
                style={{
                  fontFamily: FONT_SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  letterSpacing: "-0.015em",
                }}
              >
                notes
              </em>
            </div>
            <p style={{ fontFamily: FONT_SANS, fontSize: 13, color: "#5C5A55", marginTop: 4 }}>
              A few things to keep in mind for this trip.
            </p>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close popup"
            className="flex-shrink-0 grid place-items-center transition-colors"
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              border: "1px solid #E6E1D2",
              background: "#FFFFFF",
              color: "#5C5A55",
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* notes list */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-4 pb-2">
          <style jsx>{`
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <ul className="flex flex-col gap-2 p-0 m-0">
            {notes?.map((note, index) => (
              <li
                key={index}
                className="flex items-start gap-3"
                style={{
                  listStyle: "none",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid #E6E1D2",
                  background: "#FFFFFF",
                }}
              >
                <span
                  className="flex-shrink-0"
                  style={{
                    width: 7,
                    height: 7,
                    marginTop: 6,
                    borderRadius: 999,
                    background: "#2E9E44", 
                    boxShadow: "0 0 0 3px #E5F7E9"
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    color: "#2C2C2A",
                    flex: 1,
                  }}
                >
                  {note}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* footer */}
        <div className="px-4 pt-2 pb-4 flex-shrink-0">
          <button
            onClick={handleClose}
            className="w-full transition-opacity hover:opacity-90"
            style={{
              fontFamily: FONT_SANS,
              fontSize: 14,
              fontWeight: 500,
              color: "#FFFFFF",
              background: "#0F1B2D",
              padding: "12px 16px",
              borderRadius: 12,
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesPopup;
