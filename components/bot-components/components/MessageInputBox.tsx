import React, { useRef, useEffect, useState } from "react";

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6.92 9.06965L3.09055 7.51838C2.95893 7.4671 2.86406 7.38886 2.80593 7.28369C2.74781 7.1785 2.71875 7.0708 2.71875 6.9606C2.71875 6.85041 2.75059 6.74232 2.81427 6.63633C2.87794 6.53036 2.97559 6.45172 3.10722 6.40043L12.2339 2.9831C12.3528 2.93315 12.468 2.92337 12.5796 2.95378C12.6911 2.98421 12.7874 3.03998 12.8686 3.1211C12.9497 3.20221 13.0054 3.29854 13.0359 3.41008C13.0663 3.52162 13.0564 3.63682 13.0063 3.75569L9.57557 12.8782C9.52541 13.007 9.44767 13.1035 9.34233 13.1679C9.23701 13.2323 9.12918 13.2645 9.01883 13.2645C8.90849 13.2645 8.80016 13.2342 8.69385 13.1737C8.58754 13.1132 8.50907 13.0174 8.45845 12.8863L6.92 9.06965Z" fill="black"/>
  </svg>
);

const WaveformIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M7 18V6H9V18H7ZM11 22V2H13V22H11ZM3 14V10H5V14H3ZM15 18V6H17V18H15ZM19 14V10H21V14H19Z" fill="#07213A"/>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M9 15H11V11H15V9H11V5H9V9H5V11H9V15ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="#07213A"/>
  </svg>
);

const StopIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

interface MessageInputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Show the + attach button (default: true) */
  showAttach?: boolean;
  rotatePlaceholders?: string[];
}

export const MessageInputBox: React.FC<MessageInputBoxProps> = ({
  value,
  onChange,
  onSubmit,
  onStop,
  isStreaming = false,
  disabled = false,
  placeholder = "Ask me anything",
  showAttach = true,
  rotatePlaceholders = [],
  
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

const [placeholderIdx, setPlaceholderIdx] = useState(0);
const [fadingOut, setFadingOut] = useState(false);

useEffect(() => {
  if (!rotatePlaceholders?.length) return;
  const interval = setInterval(() => {
    setFadingOut(true);
    setTimeout(() => {
      setPlaceholderIdx((i) => (i + 1) % rotatePlaceholders.length);
      setFadingOut(false);
    }, 400); // fade-out duration
  }, 3000);
  return () => clearInterval(interval);
}, [rotatePlaceholders]);

const activePlaceholder =
  rotatePlaceholders?.length
    ? rotatePlaceholders[placeholderIdx]
    : placeholder;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  const canSend = value.trim().length > 0 && !isStreaming;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSubmit();
    }
  };

  

  return (
    <div
      style={{
        borderRadius: 14,
        border: "1.5px solid #e5e7eb",
        background: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        padding: "14px 14px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Placeholder */}
    <div style={{ position: "relative" }}>
  <style>{`
    @keyframes slideUpIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    @keyframes slideUpOut {
      from { opacity: 1; transform: translateY(0);     }
      to   { opacity: 0; transform: translateY(-10px); }
    }
    .ph-slide-in  { animation: slideUpIn  0.35s ease forwards; }
    .ph-slide-out { animation: slideUpOut 0.35s ease forwards; }
  `}</style>

  <textarea
    ref={textareaRef}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={handleKeyDown}
    disabled={disabled && !isStreaming}
    placeholder=""                       
    rows={1}
    className="w-full bg-transparent resize-none outline-none"
    style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: 16,
      color: "#111827",
      lineHeight: "22px",
      minHeight: 24,
      maxHeight: 120,
      border: "none",
      padding: 0,
      marginBottom: 8,
    }}
  />

  {/* Animated placeholder overlay — hidden once user types */}
  {!value && (
    <span
      key={placeholderIdx}             
      className={fadingOut ? "ph-slide-out" : "ph-slide-in"}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        userSelect: "none",
        fontFamily: "'Inter', sans-serif",
        fontSize: 16,
        lineHeight: "22px",
        color: "#9ca3af",               
        whiteSpace: "nowrap",
        overflow: "hidden",
        maxWidth: "100%",
      }}
    >
      {activePlaceholder}
    </span>
  )}
</div>

      {/* Bottom action row */}
      <div className="flex items-center justify-between">
        {/* Left: attach */}
        {showAttach ? (
          <button
            type="button"
            className="flex items-center justify-center transition-colors hover:bg-gray-100 rounded-full"
            title="Attach"
          >
            <PlusIcon />
          </button>
        ) : (
          <div />
        )}

        {/* Right: waveform + send/stop */}
        <div className="flex items-center gap-2"> 
          <button 
            type="button" 
            className="flex items-center justify-center" 
            title="Voice input"  
          > 
            <WaveformIcon /> 
          </button>

          {isStreaming ? ( 
            <button 
              type="button" 
              onClick={onStop} 
              title="Stop generating" 
              className="flex items-center justify-center transition-all" 
              style={{
                width: 32, 
                height: 32, 
                borderRadius: "50%",
                background: "#1c1917",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              <StopIcon />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              disabled={!canSend}
              title="Send"
              className="flex items-center justify-center transition-all"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#FFD602",
                color: "#1c1917",
                border: "none",
                cursor: canSend ? "pointer" : "not-allowed",
                // opacity: canSend ? 1 : 0.5,
                boxShadow: canSend ? "0 2px 8px rgba(251,191,36,0.35)" : "none",
              }}
            >
              <SendIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};