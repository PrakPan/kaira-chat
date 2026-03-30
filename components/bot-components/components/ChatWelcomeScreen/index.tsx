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
  // Remove: onChatStart?.();
  setInputValue("");
};

  const handleChipClick = (prompt: string) => {
    onSubmit?.(prompt);
    // onChatStart?.();
  };

  const promptChips = [
    {
      icon: "✈️",
      label: "Plan a Bali Trip",
      sublabel: "₹1.2L for 2",
      prompt:
        "Plan a 7-day Bali trip for 2 people. Budget ₹1.2 lakh. Include beaches, temples, and at least one villa stay.",
    },
    {
      icon: "🎲",
      label: "Surprise Me",
      sublabel: "4 Days, ₹80K",
      prompt:
        "Surprise me with an offbeat trip. 4 days, budget ₹80,000. I like experiences over touristy places.",
    },
    {
      icon: "🏕️",
      label: "Rajasthan Desert Camp",
      sublabel: "2 nights",
      prompt:
        "Plan a 4-night Rajasthan trip. Desert camp in Jaisalmer, camel safari at golden hour, heritage hotel stay.",
    },
    {
      icon: "🏖️",
      label: "Best Beach in India this April",
      sublabel: "",
      prompt:
        "What are the best beaches in India to visit in April? I prefer fewer crowds. Suggest itinerary options.",
    },
  ];

  return (
    <div
      className="flex flex-col items-center justify-center h-full bg-white px-8"
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
        .welcome-chip:active {
          transform: translateY(0);
        }
      `}</style>

      {/* Avatar */}
      <img
        src="/KairaInsta.png"
        alt="Kaira"
        width="112"
        height="112"
        className="mb-4 rounded-full"
      />

      {/* Heading */}
      <h1
        className="text-center font-semibold mb-2"
        style={{ fontSize: 24, lineHeight: "30px", letterSpacing: "-0.3px" }}
      >
        Your next trip is one conversation away
      </h1>

      {/* Subtitle */}
      <p className="text-center text-[#6E757A] mb-6 text-md leading-relaxed">
        Tell me where you want to go — I'll handle the rest.
      </p>

      {/* Prompt chips — full-width rows matching screenshot */}
      <div className="w-full max-w-sm flex flex-col gap-3 mb-8">
        {promptChips.map((chip) => (
          <button
            key={chip.label}
            onClick={() => handleChipClick(chip.prompt)}
            className="welcome-chip w-full flex items-center gap-3 p-[10px] rounded-xl border-[1px] bg-white text-left"
          >
            <span className="text-lg">{chip.icon}</span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm md:text-[14px] font-medium">{chip.label}</span>
              {chip.sublabel && (
                <span className="text-xs md:text-sm  text-gray-400 mt-0.5">{chip.sublabel}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="w-full max-w-[32rem]">
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
      </div>
    </div>
  );
};

export default ChatWelcomeScreen;