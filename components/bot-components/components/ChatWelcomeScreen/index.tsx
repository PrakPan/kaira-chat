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

  const quickPrompts = [
    "🏖️ Beach vacation ideas",
    "🗺️ Weekend road trip",
    "🏔️ Mountain hiking trip",
    "🌍 Budget travel tips",
  ];

  return (
    <div
      className="flex flex-col items-center justify-center h-full bg-white px-8 pb-12"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
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
        Planning a trip today?
      </h1>

      {/* Subtitle */}
      <p
        className="text-center mb-6"
        style={{ fontSize: 15, color: "#6e757a", lineHeight: "25px" }}
      >
        I'm here to help you with anything related to travel!
      </p>

      {/* Quick prompt chips */}
      {/* <div className="flex flex-wrap gap-2 justify-center mb-6 max-w-sm">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => {
              onSubmit?.(prompt.slice(3)); // strip emoji prefix
              onChatStart?.();
            }}
            className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 text-[13px] hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-150"
          >
            {prompt}
          </button>
        ))}
      </div> */}

      {/* Input */}
      <div className="w-full max-w-lg">
        <MessageInputBox
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          placeholder="Ask me anything"
          showAttach={true}
        />
      </div>
    </div>
  );
};

export default ChatWelcomeScreen;