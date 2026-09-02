// The right-hand panel for an archived V1 itinerary.
//
// These itineraries predate the chat service — there is no thread behind them,
// so mounting the real ChatKitPanel makes it try to start a session and fail
// ("Session start failed: Not Found"). This is the static stand-in: the same
// header and composer shell, one clone CTA, and nothing that talks to the chat
// backend.
//
// Deliberately a separate component rather than a flag inside ChatKitPanel:
// that file drives every live conversation, and its session bootstrap runs from
// hooks that can't be conditionally skipped. Branching at the mount point keeps
// the live chat completely untouched.

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ItineraryCloneCta } from "./MessageBubble";
import { MessageInputBox } from "./MessageInputBox";
import CloneItinerary from "../../CloneItinerary/Index";
import BotLoginModal from "./BotLoginModal";

interface ArchiveChatPanelProps {
  /** Source itinerary for the clone — the archived itinerary being viewed. */
  itineraryId?: string;
}

const ArchiveChatPanel: React.FC<ArchiveChatPanelProps> = ({ itineraryId }) => {
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const token = useSelector((state: any) => state?.auth?.token);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#ECEAEA]">
        <img
          src="/kaira.png"
          alt=""
          aria-hidden="true"
          className="w-7 h-7 rounded-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <span className="ttw-type-h4 font-normal text-[#262626]">
          Chat with Kaira - Your AI Trip Planner
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        <p className="ttw-type-small text-[#7A7A7A] mb-4">
          This is a saved itinerary from an earlier trip, so there's no
          conversation attached to it. Make it yours to start planning.
        </p>

        <ItineraryCloneCta
          onRequestLogin={() => setShowLoginModal(true)}
          onCreateVersion={() => setShowCloneModal(true)}
        />
      </div>

      <div className="px-3 pb-3">
        <MessageInputBox
          value=""
          onChange={() => {}}
          onSubmit={() => {}}
          disabled
          placeholder="Clone this itinerary to start planning"
        />
      </div>

      {showCloneModal && (
        <CloneItinerary
          sourceItineraryId={itineraryId}
          showEndLocation
          onCancel={() => setShowCloneModal(false)}
        />
      )}

      <BotLoginModal
        show={showLoginModal && !token}
        onhide={() => setShowLoginModal(false)}
        itinary_id={itineraryId}
      />
    </div>
  );
};

export default ArchiveChatPanel;
