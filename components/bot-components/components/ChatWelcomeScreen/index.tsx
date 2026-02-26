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

  return (
    <div
      className="flex flex-col items-center justify-center h-full bg-white px-8 pb-12"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Avatar */}
      <div className="w-28 h-28 rounded-full mb-5 flex items-center justify-center">
        <img src="/assets/chatbot/chatbot-avaatar.svg" alt="Avatar" height="300px" width="300px" />
      </div>

      {/* Heading */}
      <h1
        className="text-gray-700 mb-2 text-center font-montserrat leading-6 "
        style={{ fontSize: 26, fontWeight: 600, lineHeight: "34px", letterSpacing: "-0.4px" }}
      >
        Planning a trip today?
      </h1>

      {/* Subtitle */}
      <p
        className="text-center mb-8"
        style={{ fontSize: 16, color: "#6e757a", lineHeight: "25px" }}
      >
        I'm here to help you with anything related to travel!
      </p>

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