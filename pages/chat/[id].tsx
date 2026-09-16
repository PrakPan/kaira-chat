// pages/chat/[id].tsx

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { connect, useSelector } from "react-redux";
import { BotAppSessionClient as BotApp } from "../../components/bot-components/BotAppClient";
import BotAppSkeleton from "../../components/bot-components/components/BotAppSkeleton";
import * as authaction from "../../store/actions/auth";

const ChatSessionPage = ({ checkAuthState }: { checkAuthState: () => void }) => {
  const router = useRouter();
  const itineraryName = useSelector(
    (state: any) => state.Itinerary?.name,
  );

  useEffect(() => {
    checkAuthState();
  }, []);

  // `router.isReady` is NOT a signal that `router.query.id` is populated here.
  // _app has getInitialProps, so the static export ships `appGip: true` with
  // `query: {}` — Next marks the router ready on the very first client render
  // and only fills `id` (and `source`) via its catch-up navigation afterwards.
  // Gating on isReady let BotApp mount with `sessionId` undefined: it ran the
  // bare-/chat path (fresh intake form in the chat, no reload skeletons), then
  // the real id arrived and the restore landed on top of that half-built state
  // — an empty itinerary shell beside "Where to next?". `next dev` fills the
  // query up front, so this only reproduces on the deployed export.
  //
  // So read both from the live URL after mount (after, not during render, so
  // the client's first render still matches the prerendered skeleton) and
  // don't mount BotApp until the session id is known.
  const [fromUrl, setFromUrl] = useState<{
    id: string | null;
    source: string | null;
  } | null>(null);
  useEffect(() => {
    const id =
      window.location.pathname.match(/^\/chat\/([^/?#]+)/)?.[1] ?? null;
    const source = new URLSearchParams(window.location.search).get("source");
    setFromUrl({ id: id ? decodeURIComponent(id) : null, source });
  }, []);

  const queryId =
    typeof router.query.id === "string" && router.query.id !== "[id]"
      ? router.query.id
      : undefined;
  const sessionId = queryId ?? fromUrl?.id ?? undefined;

  if (!sessionId) return <BotAppSkeleton />;

  const source =
    typeof router.query.source === "string"
      ? router.query.source
      : fromUrl?.source;
  const fromTailored = source === "tailored";
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