import { useChatContext } from "../context/ChatContext";

const useChat = () => {
  const context = useChatContext();
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export default useChat;
