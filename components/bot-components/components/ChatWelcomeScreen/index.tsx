import React, { useState } from "react";
import { MessageInputBox } from "../MessageInputBox";

interface ChatWelcomeScreenProps {
  onSubmit?: (message: string) => void;
  onChatStart?: () => void;
}

const ChatWelcomeScreen: React.FC<ChatWelcomeScreenProps> = ({ onSubmit, onChatStart }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    const val = inputValue.trim();
    if (!val) return;
    onSubmit?.(val);
    setInputValue("");
  };

  const handleChipClick = (prompt: string) => {
    onSubmit?.(prompt);
  };

  const promptChips = [
    {
      icon: "✈️",
      label: "Plan a Bali Trip",
      sublabel: "₹1.2L for 2",
      prompt: "Plan a 7-day Bali trip for 2 people. Budget ₹1.2 lakh. Include beaches, temples, and at least one villa stay.",
    },
    {
      icon: "🎲",
      label: "Surprise Me",
      sublabel: "4 Days, ₹80K",
      prompt: "Surprise me with an offbeat trip. 4 days, budget ₹80,000. I like experiences over touristy places.",
    },
    {
      icon: "🏕️",
      label: "Rajasthan Desert Camp",
      sublabel: "2 nights",
      prompt: "Plan a 4-night Rajasthan trip. Desert camp in Jaisalmer, camel safari at golden hour, heritage hotel stay.",
    },
    {
      icon: "🏖️",
      label: "Best Beach in India this April",
      sublabel: "",
      prompt: "What are the best beaches in India to visit in April? I prefer fewer crowds. Suggest itinerary options.",
    },
  ];

  const inputBox = (
    <MessageInputBox
      value={inputValue}
      onChange={setInputValue}
      onSubmit={handleSubmit}
      rotatePlaceholders={[
        "Try:  Plan a Bali Trip",
        "Try:  Best hill stations near Bangalore",
        "Try:  La Tomatina trip from India",
        "Try:  Surprise me — 4 days, ₹80K",
      ]}
      showAttach={true}
    />
  );

  return (
    <div
      className="flex flex-col h-full bg-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        .welcome-chip {
          transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
        }
        .welcome-chip:hover {
          background: #fffbeb;
          border-color: #fbbf24;
          transform: translateY(-1px);
        }
        .welcome-chip:active { transform: translateY(0); }
      `}</style>

      {/* Scrollable content — top-aligned on mobile, centered on desktop */}
      <div
        className="flex-1 overflow-y-auto flex flex-col items-center w-full px-6 py-6 md:justify-center"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Avatar */}
        <img
          src="/KairaInsta.png"
          alt="Kaira"
          className="mb-4 rounded-full w-20 h-20 md:w-28 md:h-28 object-cover flex-shrink-0"
        />

        {/* Heading */}
        <h1
          className="text-center font-semibold mb-2 text-[20px] md:text-[24px]"
          style={{ lineHeight: "1.3", letterSpacing: "-0.3px" }}
        >
          Your next trip is one conversation away
        </h1>

        {/* Subtitle */}
        <p className="text-center text-[#6E757A] mb-5 text-sm md:text-md leading-relaxed">
          Tell me where you want to go — I'll handle the rest.
        </p>

        {/* Prompt chips — 2-col grid on mobile, 1-col on desktop */}
        <div className="w-full max-w-sm grid grid-cols-2 md:grid-cols-1 gap-2.5 mb-4 md:mb-6">
          {promptChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => handleChipClick(chip.prompt)}
              className="welcome-chip flex flex-col md:flex-row items-start md:items-center gap-1.5 md:gap-3 p-3 md:p-[10px] rounded-xl border-[0.9px] bg-white text-left"
            >
              <span className="text-xl md:text-lg flex-shrink-0">{chip.icon}</span>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-sm font-semibold md:font-medium text-gray-900 line-clamp-2 md:truncate">{chip.label}</span>
                {chip.sublabel && (
                  <span className="text-xs text-gray-400 mt-0.5">{chip.sublabel}</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Input — desktop only inside scroll area (vertically centered with content) */}
        <div className="hidden md:block w-full max-w-[32rem]">
          {inputBox}
        </div>
      </div>

      {/* Input — mobile only, pinned at bottom */}
      <div className="md:hidden flex-shrink-0 px-4 pb-4 pt-2 bg-white">
        {inputBox}
      </div>
    </div>
  );
};

export default ChatWelcomeScreen;
