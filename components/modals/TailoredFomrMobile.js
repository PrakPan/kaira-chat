import React, { useEffect } from "react";
import { useRouter } from "next/router";

// NOTE: the imports for the commented-out fallback below (Modal, media,
// TailoredForm, NewTrip, BotApp) were removed deliberately. This component
// returns null and only redirects, so those imports were dead — but they are
// static, so webpack still pulled their whole closure (BotApp -> ChatKitPanel
// -> TransferEditDrawer -> ItineraryContainer -> newitinerary, 603 modules /
// ~5.9 MB of source) into the shared chunk that EVERY marketing page loads.
// If the fallback is ever restored, re-add the imports as dynamic() so the
// chat/itinerary tree stays out of the homepage bundle.

const TailoredFormMobileModal = (props) => {
  const router = useRouter();

  // New behaviour: every "Plan with Kaira" CTA that opened this modal now routes
  // to the Chat-with-Kaira page with an empty in-chat intake form. When a parent
  // flips `show` true, navigate there and close the modal instead of rendering
  // the old tailored form.
  useEffect(() => {
    if (props.show) {
      props.onHide?.();
      router.push("/chat?intake=1");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show]);

  return null;

  // ── Old behaviour: open the tailored form (NewTrip) inside a modal. Kept
  //    (commented) for fallback. ──────────────────────────────────────────────
  // return (
  //   <Modal
  //     height={"100%"}
  //     borderRadius={"12px"}
  //     show={props.show}
  //     backdrop={true}
  //     className="booking-modal"
  //     size="lg"
  //     onHide={props.onHide}
  //     animation={false}
  //     width={isPageWide ? "100%" : "100%"}
  //     overflow="overflow: hidden"
  //   >
  //     <div className="flex justify-center items-center h-full">
  //     <div className="w-full h-full">
  //       <NewTrip onHide={props?.onHide}/>
  //       {/* <TailoredForm
  //         tailoredFormModal
  //         destinationType={props.destinationType}
  //         page_id={props.page_id}
  //         type={props?.type}
  //         children_cities={props.children_cities}
  //         destination={props.destination}
  //         cities={props.cities}
  //         onHide={props.onHide}
  //         eventDates={props.eventDates}
  //       ></TailoredForm> */}
  //        {/* <BotApp/> */}
  //     </div>
  //     </div>
  //   </Modal>
  // );
};

export default TailoredFormMobileModal;
