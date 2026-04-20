// pages/chat/[id].tsx

import { useEffect } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";

const ChatSessionPage = ({ checkAuthState }: { checkAuthState: () => void }) => {
  const router = useRouter();

  useEffect(() => {
    checkAuthState();
  }, []);

  if (!router.isReady) return null;

  const sessionId = router.query.id as string;
  return <BotApp sessionId={sessionId} />;
};

// ← Remove getStaticPaths and getStaticProps entirely

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(ChatSessionPage);