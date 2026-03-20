import React, { useState } from "react";
import { MessageInputBox } from "../MessageInputBox";

interface ChatWelcomeScreenProps {
  onSubmit?: (message: string) => void;
  onChatStart?: () => void;
}

const ChatWelcomeScreen: React.FC<ChatWelcomeScreenProps> = ({
  onSubmit,
  onChatStart,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    const val = inputValue.trim();
    if (!val) return;
    onSubmit?.(val);
    onChatStart?.();
    setInputValue("");
  };

  const handleChipClick = (prompt: string) => {
    onSubmit?.(prompt);
    onChatStart?.();
  };

  const promptChips = [
    {
      label: "✦  Plan a Bali trip, ₹1.2L for 2",
      prompt:
        "Plan a 7-day Bali trip for 2 people. Budget ₹1.2 lakh. Include beaches, temples, and at least one villa stay.",
    },
     {
      label: "✦  Surprise me — 4 days, ₹80K",
      prompt:
        "Surprise me with an offbeat trip. 4 days, budget ₹80,000. I like experiences over touristy places.",
    },
    {
      label: "✦  Rajasthan desert camp, 4 nights",
      prompt:
        "Plan a 4-night Rajasthan trip. Desert camp in Jaisalmer, camel safari at golden hour, heritage hotel stay.",
    },
    {
      label: "✦  Best beaches in India this April",
      prompt:
        "What are the best beaches in India to visit in April? I prefer fewer crowds. Suggest itinerary options.",
    },
   
  ];

  return (
    <div
      className="flex flex-col items-center justify-center h-full bg-white px-8 pb-12"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        .chip-welcome {
          transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.15s ease;
        }
        .chip-welcome:hover {
          background: #fffbeb;
          border-color: #fbbf24;
          color: #92400e;
          transform: translateY(-1px);
        }
        .chip-welcome:active {
          transform: translateY(0);
        }
      `}</style>

      {/* Avatar */}
      <div className="w-28 h-28 rounded-full flex items-center justify-center mb-1">
        <img
          src="/assets/chatbot/chatbot-avaatar.svg"
          alt="Avatar"
          height="300px"
          width="300px"
        />
      </div>

      {/* Heading */}
      <h1
        className="text-gray-700 mb-2 text-center font-montserrat leading-tight"
        style={{
          fontSize: 26,
          fontWeight: 600,
          lineHeight: "34px",
          letterSpacing: "-0.4px",
        }}
      >
        Your next trip is one conversation away
      </h1>

      {/* Subtitle */}
      <p
        className="text-center mb-5"
        style={{ fontSize: 15, color: "#6e757a", lineHeight: "25px" }}
      >
        Tell me where you want to go — I'll handle the rest.
      </p>

      {/* Prompt chips */}
      <div className="flex flex-wrap gap-2 justify-center mb-6 max-w-lg max-ph:hidden">
        {promptChips.map((chip) => (
          <button
            key={chip.label}
            onClick={() => handleChipClick(chip.prompt)}
            className="chip-welcome px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 text-[13px] font-medium"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="w-full max-w-lg">
        <MessageInputBox
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          rotatePlaceholders={[
            "Try: Plan a 7-day Bali trip for 2, budget ₹1.2L",
            "Try: Best hill stations near Bangalore this April",
            "Try: Plan my Spain trip — La Tomatina festival",
            "Try: Surprise me — 4 days, ₹80K, I like offbeat places",
          ]}
          showAttach={true}
        />
      </div>
    </div>
  );
};

export default ChatWelcomeScreen;