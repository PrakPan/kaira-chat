// pages/chat/[id].tsx

import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { connect, useSelector } from "react-redux";
import BotApp from "../../components/bot-components/BotApp";
import * as authaction from "../../store/actions/auth";

const ChatSessionPage = ({ checkAuthState }: { checkAuthState: () => void }) => {
  const router = useRouter();
  const itineraryName = useSelector(
    (state: any) => state.Itinerary?.name,
  );

  useEffect(() => {
    checkAuthState();
  }, []);

  if (!router.isReady) return null;

  const sessionId = router.query.id as string;
  const fromTailored = router.query.source === "tailored";
  const title = itineraryName
    ? `${itineraryName} | The Tarzan Way`
    : "The Tarzan Way";

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {/*
        No `key={sessionId}` here on purpose. BotApp switches sessions in place
        (thread-select / itinerary-creation change the URL via history.pushState,
        which Next's router doesn't observe). Keying on router.query.id made the
        first drawer CTA after a switch remount BotApp — the CTA's router.push is
        the moment Next reconciles the stale id, flipping the key — which showed
        up as a drawer flash + full data refetch. BotApp now handles browser
        back/forward between sessions itself (see its popstate effect).
      */}
      <BotApp
        sessionId={sessionId}
        fromTailored={fromTailored}
      />
    </>
  );
};

// ← Remove getStaticPaths and getStaticProps entirely

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(ChatSessionPage);