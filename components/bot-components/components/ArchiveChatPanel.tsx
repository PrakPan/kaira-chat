// The right-hand panel for an archived V1 itinerary.
//
// These itineraries predate the chat service — there is no thread behind them,
// so mounting the real ChatKitPanel makes it try to start a session and fail
// ("Session start failed: Not Found"). This is the static stand-in.
//
// Deliberately a separate component rather than a flag inside ChatKitPanel:
// that file drives every live conversation, and its session bootstrap runs from
// hooks that can't be conditionally skipped. Branching at the mount point keeps
// the live chat completely untouched.
//
// The markup and the `kp-*` rules below are lifted from ChatKitPanel so the two
// panels are visually identical — same avatar, header, message bubble and
// composer. Only the content differs: one clone message, and nothing to send.

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ItineraryCloneCta } from "./MessageBubble";
import { MessageInputBox } from "./MessageInputBox";
import CloneItineraryModal from "./CloneItineraryModal";
import BotLoginModal from "./BotLoginModal";

interface ArchiveChatPanelProps {
  /** Source itinerary for the clone — the archived itinerary being viewed. */
  itineraryId?: string;
}

// Trimmed from ChatKitPanel's stylesheet: only the header and bubble rules this
// panel actually uses. Kept byte-identical to the originals so the two headers
// line up pixel for pixel.
const ARCHIVE_PANEL_CSS = `
  .kp-header {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 20px;
    border-bottom: 1px solid #ececec;
    background: #fff;
    flex-shrink: 0;
  }
  .kp-header-ava {
    position: relative;
    width: 38px; height: 38px;
    border-radius: 50%;
    background: linear-gradient(180deg, #a8d2f5, #7ab8e8);
    overflow: hidden;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(11,18,32,0.12);
    flex-shrink: 0;
  }
  .kp-header-ava img { width: 100%; height: 100%; object-fit: cover; }
  .kp-header-ava .kp-dot {
    position: absolute;
    bottom: 1px; right: 1px;
    width: 11px; height: 11px;
    background: #4ade80;
    border: 2px solid #fff;
    border-radius: 50%;
  }
  .kp-header-info { flex: 1; min-width: 0; }
  .kp-header-name {
    font-size: 14px; font-weight: 700; color: #0b1220; line-height: 1.2;
  }
  .kp-header-status {
    font-size: 11px; color: #1f8a5a; font-weight: 600;
    display: flex; align-items: center; gap: 5px; margin-top: 1px;
  }
  /* The composer sits in an unruled tray: no top border, no drop shadow on
     the pill (see MessageInputBox .kp-row) — the padding and the pill's own
     outline are all that separate it from the thread. */
  .kp-composer-wrap {
    padding: 10px 10px 10px;
    background: #fff;
  }
  @media (max-width: 768px) {
    .kp-composer-wrap {
      padding: 10px 12px 12px;
    }
  }
`;

const ArchiveChatPanel: React.FC<ArchiveChatPanelProps> = ({ itineraryId }) => {
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const token = useSelector((state: any) => state?.auth?.token);

  return (
    <div className="kp-root flex flex-col h-full min-h-0 bg-white max-h-[100dvh] border-[0.5px] border-l-[#e5e5e5] overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: ARCHIVE_PANEL_CSS }} />

      <div className="kp-header">
        <div className="kp-header-ava">
          <img src="/KairaInsta.png" alt="Kaira" />
          <span className="kp-dot" />
        </div>
        <div className="kp-header-info">
          <div className="kp-header-name">
            Kaira
            <span className="font-normal hidden md:inline text-[#445069]">
              {" "}
              · Your AI Trip Planner
            </span>
          </div>
          <div className="kp-header-status">
            <span>online · ~2s reply</span>
          </div>
        </div>
      </div>

      {/* The same card the live chat shows on someone else's itinerary — Kaira
          avatar, "SHARED · ITINERARY", "Make this trip yours." and the login /
          clone CTA. Reused rather than restyled so the two panels are identical.
          It hides itself when the itinerary has no owner, which is why the
          adapter fills `customer_name` in from the archive's title. */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        <ItineraryCloneCta
          onRequestLogin={() => setShowLoginModal(true)}
          onCreateVersion={() => setShowCloneModal(true)}
        />
      </div>

      {/* Same tray and pill as the live composer — it is the same component in
          the same wrapper, only locked. `showAttach` keeps the "+" so the pill
          holds its full shape instead of collapsing to a lone placeholder. */}
      <div className="kp-composer-wrap flex-shrink-0 relative">
        <div className="mx-auto">
          <MessageInputBox
            value=""
            onChange={() => {}}
            onSubmit={() => {}}
            disabled
            showAttach
            placeholder="Clone this itinerary to start planning"
          />
        </div>
      </div>

      {/* Same popup the bottom bar's "Get this trip!" opens. */}
      <CloneItineraryModal
        show={showCloneModal}
        onHide={() => setShowCloneModal(false)}
        itineraryId={itineraryId}
      />

      <BotLoginModal
        show={showLoginModal && !token}
        onhide={() => setShowLoginModal(false)}
        itinary_id={itineraryId}
      />
    </div>
  );
};

export default ArchiveChatPanel;
