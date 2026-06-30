import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Modal from "../ui/Modal";
import media from "../media";
import TailoredForm from "../tailoredform/Index";
import NewTrip from "../../containers/new-trip";
import BotApp from "../bot-components/BotApp";

const TailoredFormMobileModal = (props) => {
  let isPageWide = media("(min-width: 768px)");
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
