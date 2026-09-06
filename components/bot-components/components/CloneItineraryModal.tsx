// The clone-itinerary popup, centred over the page.
//
// Portalled to <body> rather than rendered in place: both callers sit inside
// scrolling, transformed containers (the chat panel's thread, and the fixed
// bottom bar), where an inline modal lands in that container's flow instead of
// over the page.
//
// Shared by ArchiveChatPanel's clone card and the bottom bar's "Get this trip!"
// so the two open the identical popup. The itinerary's own global clone drawer
// (ItineraryContainer) is not reused here: it only mounts when the viewer is
// signed in and is not the owner, which is never true for an archived
// itinerary viewed anonymously.

import React from "react";
import { createPortal } from "react-dom";
import useMediaQuery from "../../../hooks/useMedia";
import ModalWithBackdrop from "../../ui/ModalWithBackdrop";
import BottomModal from "../../ui/LowerModal";
import CloneItinerary from "../../CloneItinerary/Index";

interface CloneItineraryModalProps {
  show: boolean;
  onHide: () => void;
  /** Source itinerary for the clone. */
  itineraryId?: string;
}

const CloneItineraryModal: React.FC<CloneItineraryModalProps> = ({
  show,
  onHide,
  itineraryId,
}) => {
  const isDesktopViewport = useMediaQuery("(min-width:767px)");

  if (!show || typeof document === "undefined") return null;

  const body = (
    <CloneItinerary
      sourceItineraryId={itineraryId}
      showEndLocation
      // This modal is the V1-archive and /trips entry point, where the source
      // is a completed trip belonging to someone else: its start date is in the
      // past and its start city is theirs. Both fields open empty here.
      prefillStartDetails={false}
      onCancel={onHide}
    />
  );

  return createPortal(
    isDesktopViewport ? (
      <ModalWithBackdrop
        show={show}
        onHide={onHide}
        closeIcon={false}
        width="560px"
        borderRadius="20px"
        backdropStyle={{ zIndex: 3300 }}
      >
        {body}
      </ModalWithBackdrop>
    ) : (
      <BottomModal
        show={show}
        onHide={onHide}
        closeIcon={false}
        height="auto"
        borderRadius="20px 20px 0 0"
        isMobile
        backdropStyle={{ zIndex: 3300 }}
      >
        {body}
      </BottomModal>
    ),
    document.body,
  );
};

export default CloneItineraryModal;
