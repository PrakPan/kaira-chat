import React, { useState, useRef, useEffect } from "react";
import { PiPulse } from "react-icons/pi";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface CustomChatProps {
  initialPrompt?: string | null;
  onSendMessage: (message: string) => Promise<void>;
  messages: Message[];
  isLoading?: boolean;
  userLocation?: string;
}

export const CustomChat: React.FC<CustomChatProps> = ({
  initialPrompt,
  onSendMessage,
  messages,
  isLoading = false,
  userLocation,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasProcessedInitialPrompt = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle initial prompt
  useEffect(() => {
    if (initialPrompt && !hasProcessedInitialPrompt.current) {
      hasProcessedInitialPrompt.current = true;
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isProcessing) return;

    setIsProcessing(true);
    setInputValue("");
    
    try {
      await onSendMessage(message);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center mb-6">
              <div className="w-full h-full bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-5xl">🧳</span>
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Planning a trip today?
            </h1>
            <p className="text-sm text-gray-500">
              I'm here to help you with anything related to travel
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-2">
                      {/* <Loader2 className="w-4 h-4 animate-spin" /> */}
                      <span className="text-sm">Thinking...</span>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <PiPulse/>
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 px-6 py-4 bg-white">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative flex items-end bg-white border border-gray-300 rounded-3xl shadow-sm hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything"
              rows={1}
              disabled={isProcessing}
              className="flex-1 px-5 py-3.5 bg-transparent text-gray-900 placeholder-gray-400 outline-none resize-none text-sm font-normal"
              style={{ maxHeight: "120px" }}
            />

            {/* Buttons */}
            <div className="flex items-center gap-1 pr-1.5 pb-1.5">
              {/* Attachment Button */}
              <button
                type="button"
                // className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isProcessing}
              >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M11 17H13V13H17V11H13V7H11V11H7V13H11V17ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="#07213A"/>
</svg>
              </button>

              {/* Voice Button */}
              <button
                type="button"
                // className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isProcessing}
              >
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M7 18V6H9V18H7ZM11 22V2H13V22H11ZM3 14V10H5V14H3ZM15 18V6H17V18H15ZM19 14V10H21V14H19Z" fill="#07213A"/>
</svg>
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isProcessing}
                // className="p-2.5 bg-yellow-400 hover:bg-yellow-500 rounded-full transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <PiPulse className="w-5 h-5 text-gray-900 animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M6.92 9.06965L3.09055 7.51838C2.95893 7.4671 2.86406 7.38886 2.80593 7.28369C2.74781 7.1785 2.71875 7.0708 2.71875 6.9606C2.71875 6.85041 2.75059 6.74232 2.81427 6.63633C2.87794 6.53036 2.97559 6.45172 3.10722 6.40043L12.2339 2.9831C12.3528 2.93315 12.468 2.92337 12.5796 2.95378C12.6911 2.98421 12.7874 3.03998 12.8686 3.1211C12.9497 3.20221 13.0054 3.29854 13.0359 3.41008C13.0663 3.52162 13.0564 3.63682 13.0063 3.75569L9.57557 12.8782C9.52541 13.007 9.44767 13.1035 9.34233 13.1679C9.23701 13.2323 9.12918 13.2645 9.01883 13.2645C8.90849 13.2645 8.80016 13.2342 8.69385 13.1737C8.58754 13.1132 8.50907 13.0174 8.45845 12.8863L6.92 9.06965Z" fill="black"/>
</svg>
                )}
              </button>
            </div>
          </div>
          
          
        </form>
      </div>
    </div>
  );
};