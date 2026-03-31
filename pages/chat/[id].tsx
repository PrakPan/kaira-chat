import { useRouter } from "next/router";
import BotApp from "../../components/bot-components/BotApp";

const ChatSessionPage = () => {
  const router = useRouter();

  if (!router.isReady) return null; // wait for hydration

  const sessionId = router.query.id as string;
  return <BotApp sessionId={sessionId} />;
};

export default ChatSessionPage;