import Button from "../../components/ui/button/Index";
import ImageLoader from "../../components/ImageLoader";
import media from "../../components/media";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import openTailoredModal from "../../services/openTailoredModal";
import TailoredFormMobileModal from "../../components/modals/TailoredFomrMobile";
import { logEvent } from "../../services/ga/Index";
import PrimaryHeading from "../../components/heading/PrimaryHeading";
import SecondaryHeading from "../../components/heading/Secondary";

export default function Overview(props) {
  let isPageWide = media("(min-width: 768px)");
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const router = useRouter();

  const handlePlanButton = () => {
    // if (isPageWide) {
      setShowTailoredModal(true);
    // } else {
    //   if(props?.type){
    //     openTailoredModal(router, props.page_id, props.destination,props.type);
    //   }
    //   else{
    //     openTailoredModal(router, props.page_id, props.destination,props.type);
    //   }

    // }

    // router.push("/new-trip");

    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: props.page ? props.page : "",
        event_category: "Button Click",
        event_label: "Plan Itinerary For Free!",
        event_action: "Banner",
      },
    });
  };

  return (
    <div className="relative mt-5 py-5 mx-3 flex flex-col gap-4 md:flex-row md:items-center">
      {(props.slug === "honeymoon-2025" || props.slug === "perfect-proposals-2025") && (
        <div className="-z-10 absolute -top-[3rem] md:-top-[5rem] -right-3 overflow-hidden">
          <Image
            src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/tilted-heart.png`}
            className="object-fill"
            alt="Tilted Hearts"
            height={200}
            width={200}
            style={{ transform: "rotate(45deg)" }}
          />
        </div>
      )}

{props.slug === "icc-champions-trophy-2025" && (
        <div className="-z-10 absolute -top-[3rem] md:-top-[2rem] -left-10 overflow-hidden">
          <Image
            src={`https://d31aoa0ehgvjdi.cloudfront.net/media/event/image 19.png`}
            className="object-fill"
            alt="Tilted Hearts"
            height={200}
            width={200}
          />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 justify-between w-full">
        <div className=" md:pt-0  flex flex-col gap-3">
          <PrimaryHeading className={`${props?.slug === "icc-champions-trophy-2025" ? "mt-5" : ""}`}>{props.heading}</PrimaryHeading>
          <div className="flex flex-col gap-3 justify-start">
            <SecondaryHeading className="">{props.text}</SecondaryHeading>

            <div>
              <Button
                padding={isPageWide ? "0.75rem 1rem" : "0.5rem 0.75rem"}
                fontSize={isPageWide ? "18px" : "15px"}
                fontWeight={isPageWide ? "300" : "300"}
                bgColor="#f7e700"
                borderRadius="7px"
                color="black"
                borderWidth="1px"
                onclick={handlePlanButton}
                margin="3vh 0 1vh 0"
              >
                {props.slug === "honeymoon-2025"
                  ? "Plan Your Honeymoon!" 
                  : props.slug === "icc-champions-trophy-2025" ?  "Book Now!": "+ Plan Your Trip Now!"}
              </Button>
            </div>

            {props.slug === "honeymoon-2025" && (
              <div className="relative">
                <div
                  className="-z-10 absolute -left-[5rem] -top-[10rem] w-[18rem] h-[18rem]"
                  style={{ transform: "rotate(-12deg)" }}
                >
                  <Image
                    src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/tilted-heart.png`}
                    className="object-fill"
                    alt="Tilted Hearts"
                    height={200}
                    width={200}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-2 md:px-0">
          <ImageLoader
            url={props.image}
            width={isPageWide ? 560 : 290}
            height={isPageWide ? 536 : 300}
            borderRadius={8}
          />
        </div>
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
  );
}
