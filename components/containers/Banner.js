import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useStatsStripPinned } from "../../services/floatingStatsStrip";
import { setPendingSeed } from "../../services/heroChatHandoff";

// The floating "plan your trip" bar that appears once a marketing page is
// scrolled past its first screen.
//
// Rebuilt as the docked ask-bar from the cinematic theme pages
// (components/theme/cinematic/CinematicThemeLanding.tsx → AskKairaStrip): a
// translucent paper pill with a real free-text field, a yellow CTA and Kaira's
// avatar. The old version was a dark lozenge carrying a sentence and one
// button, so the two floating bars on the site looked like two different
// products.
//
// Every action lands on /chat. Anything typed is handed over through the same
// seed channel the hero and the theme pages use (module memory +
// sessionStorage + `?seed=`), so the chat opens on the reader's own words
// rather than a canned opener.

const INK = "#0b1220";
const BORDER = "#ececec";
const YELLOW = "#f7e700";

const Dock = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  ${(props) => (props.newYear ? "bottom: 16px;" : "bottom: 0;")}
  z-index: 998;
  display: flex;
  justify-content: center;
  padding: 0 16px calc(16px + env(safe-area-inset-bottom));
  pointer-events: none;
`;

const Pill = styled.div`
  pointer-events: auto;
  width: 100%;
  max-width: 720px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 999px;
  border: 1px solid ${BORDER};
  background: rgba(250, 250, 245, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 18px 44px -18px rgba(11, 18, 32, 0.35);

  @media screen and (min-width: 768px) {
    gap: 10px;
    padding: 10px;
  }
`;

const Field = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: "Inter", -apple-system, sans-serif;
  font-size: 13.5px;
  color: ${INK};
  padding: 0 4px;

  &::placeholder {
    color: #8a93a6;
  }

  @media screen and (min-width: 768px) {
    min-width: 90px;
    padding: 0 6px;
  }
`;

/* Yellow, because this is the one action on the bar. Ink text on yellow is the
   pairing the rest of the Kaira surfaces use for a primary CTA on paper.
   `position: relative; overflow: hidden` is what clips the sheen below. */
const Cta = styled.button`
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  border: none;
  cursor: pointer;
  border-radius: 999px;
  background: ${YELLOW};
  color: ${INK};
  font-family: "Inter", -apple-system, sans-serif;
  font-size: 13px;
  font-weight: 700;
  padding: 11px 16px;
  box-shadow: 0 8px 20px -10px rgba(247, 231, 0, 0.9);
  transition: transform 0.15s cubic-bezier(0.2, 0.7, 0.3, 1);

  &:hover {
    transform: translateY(-1px);
  }
  &:active {
    transform: none;
  }

  @media screen and (min-width: 768px) {
    font-size: 14px;
    padding: 14px 24px;
    min-width: 190px;
  }
`;

/* The askBar's slow shine, which keeps the button alive without animating its
   colour. `.ctl-sheen` itself is declared inside CinematicThemeLanding's own
   <style> block, so it does not exist on the pages this bar appears on — the
   class name alone was a no-op here. Same gradient and timing, declared where
   it is used. */
const Sheen = styled.span`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.28),
    transparent
  );
  background-size: 64px 100%;
  background-repeat: no-repeat;
  background-position: left center;
  animation: ttwBannerSheen 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;

  @keyframes ttwBannerSheen {
    0% {
      background-position: -80px center;
    }
    100% {
      background-position: calc(100% + 80px) center;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/* The "just ask" shortcut. Hidden on the narrowest screens so the field keeps a
   usable width — the CTA next to it goes to the same place. */
const Avatar = styled.button`
  position: relative;
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: none;

  img {
    width: 46px;
    height: 46px;
    border-radius: 999px;
    object-fit: cover;
    border: 2px solid #ffffff;
    box-shadow: 0 8px 20px -8px rgba(11, 18, 32, 0.35);
    display: block;
  }

  span {
    position: absolute;
    bottom: 1px;
    right: 1px;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #1f8a5a;
    border: 2px solid #ffffff;
  }

  @media screen and (min-width: 480px) {
    display: block;
  }
`;

const Banner = (props) => {
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(false);
  const [draft, setDraft] = useState("");
  // On phones the destination stats strip floats at the bottom until the page
  // scrolls down to its slot — this bar waits its turn so the two never stack.
  const statsStripPinned = useStatsStripPinned();

  useEffect(() => {
    const scrollhandler = () => {
      setShowBanner(window.pageYOffset > window.innerHeight / 2);
    };
    scrollhandler();
    window.addEventListener("scroll", scrollhandler, { passive: true });
    return () => window.removeEventListener("scroll", scrollhandler);
  }, []);

  const openChat = () => {
    const seed = draft.trim();
    // Same handoff as the hero and the theme pages: stash it so a cold /chat
    // load can still pick it up, and put it in the URL for the warm one.
    if (seed) setPendingSeed(seed);
    router.push(seed ? `/chat?seed=${encodeURIComponent(seed)}` : "/chat");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      openChat();
    }
  };

  if (!showBanner) return null;
  if (props.hideMobile && statsStripPinned) return null;

  // The destination gives the field its question — "Where in Bali?" reads as a
  // prompt to answer, where a bare placeholder reads as a search box.
  const placeholder = props.destinationName
    ? `Tell me about your ${props.destinationName} trip…`
    : "Tell me where you want to go…";

  return (
    <Dock newYear={props.newYear}>
      <Pill>
        <Field
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        <Cta type="button" onClick={openChat}>
          <Sheen aria-hidden="true" />
          {/* One text run, exactly as the askBar writes it (`{buildLabel} →`):
              the arrow sits at the label's own size and weight, a single space
              away. A separate element would take the button's flex `gap` and
              could be sized independently — which is what made it read as a
              different arrow. */}
          {`${draft.trim() ? "Send" : props.cta || "Start planning"} →`}
        </Cta>
        <Avatar type="button" onClick={openChat} aria-label="Chat with Kaira">
          <img src="/KairaInsta.jpg" alt="" width={46} height={46} />
          <span aria-hidden="true" />
        </Avatar>
      </Pill>
    </Dock>
  );
};

export default Banner;
