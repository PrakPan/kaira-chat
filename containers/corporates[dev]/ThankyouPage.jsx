import { useState } from "react";
import { useRouter } from "next/router";
import FullImg from "../../components/FullImage";
import media from "../../components/media";
import openTailoredModal from "../../services/openTailoredModal";
import { logEvent } from "../../services/ga/Index";
import TailoredFormMobileModal from "../../components/modals/TailoredFomrMobile";

export default function ThankyouPage(props) {
  let isPageWide = media("(min-width: 768px)");
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const router = useRouter();

  const handlePlanButton = () => {
    if (isPageWide) {
      setShowTailoredModal(true);
    } else {
      openTailoredModal(router, props.page_id, props.destination);
    }

    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: "Corporates Thank you page",
        event_category: "Button Click",
        event_label: "Plan Itinerary For Free!",
        event_action: "Banner",
      },
    });
  };

  return (
    <div className="mb-[100px]">
      <FullImg
        heightmobile={"30rem"}
        height={"44rem"}
        filter={"brightness(0.9)"}
        zIndex={-1}
        center={isPageWide ? false : true}
        url={
          isPageWide
            ? "media/corporates/corporates-thankyou.png"
            : "media/corporates/mobile-corporates-thankyou.png"
        }
      >
        <div className="text-white h-full">
          <div className="w-[90%] md:w-[60%] mx-auto gap-3 md:gap-6 pt-8 md:pt-[12%] flex flex-col">
            <div className="">
              <h1 className="md:text-[96px] md:font-[800] text-center">
                THANK YOU!
              </h1>
              <p className="text-center">
                We look forward to creating an unforgettable travel experience
                for you and your team!
              </p>
            </div>

            <p className="text-center">
              Did you know we also cater to individual travelers? Discover
              unique experiences and personalized trips on our B2C platform
              designed just for you. Whether it’s a solo adventure, a family
              vacation, or a getaway with friends, we’ve got you covered!
            </p>

            <button
              onClick={handlePlanButton}
              className="mx-auto px-[1rem] py-[0.7rem] font-[500] text-black bg-[#f7e700] border-[1px] rounded-[7px] border-black"
            >
              Plan Itinerary For Free!
            </button>
          </div>

          <TailoredFormMobileModal
            destinationType={"city-planner"}
            page_id={props.page_id}
            children_cities={props.children_cities}
            destination={props.destination}
            cities={props.cities}
            onHide={() => {
              setShowTailoredModal(false);
            }}
            show={showTailoredModal}
            eventDates={props.eventDates}
          />
        </div>
      </FullImg>
    </div>
  );
}
