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
import { CheckCircle } from "@mui/icons-material";

const points = [
  "100% customized plans, no pre-set packages.",
  "Stays & experiences that match your style — whether it’s budget hostels or boutique villas.",
  "Trusted local partners & verified vendors.",
  "Emergency support and WhatsApp assistance on-ground.",
  "Sustainable, responsible travel — no animal shows, no tourist traps.",
];

export default function OverviewThailand(props) {
  let isPageWide = media("(min-width: 768px)");
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const router = useRouter();

  const handlePlanButton = () => {
    // if (isPageWide) {
     setShowTailoredModal(true);
    // } else {
    //   if (props?.type) {
    //     openTailoredModal(router, props.page_id, props.destination, props.type);
    //   } else {
    //     openTailoredModal(router, props.page_id, props.destination, props.type);
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

      <div className="flex flex-row gap-6 justify-between w-full hidden-mobile">
        <div className=" md:pt-0  flex flex-col gap-3">
          <PrimaryHeading
            className={`${
              props?.slug === "icc-champions-trophy-2025" ? "mt-5" : ""
            }`}
          >
            {props.heading}
          </PrimaryHeading>
          <div className="flex flex-col gap-3 justify-start">
            <p className="text-gray-700 mb-6">
              From hidden islands to vibrant street markets, we craft seamless
              Thai journeys that blend culture, comfort, and adventure—exactly
              the way you like it.
            </p>
            <ul className="space-y-4">
              {points.map((point, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="text-yellow-400 mt-1" size={20} />
                  <span className="text-gray-800">{point}</span>
                </li>
              ))}
            </ul>
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

        <div className="flex flex-col gap-6 justify-between w-full hidden-desktop">
        <div className=" md:pt-0  flex flex-col gap-3">
          <PrimaryHeading
            className={`${
              props?.slug === "icc-champions-trophy-2025" ? "mt-5" : ""
            }`}
          >
            {props.heading}
          </PrimaryHeading>
           <div className="px-2 md:px-0">
          <ImageLoader
            url={props.image}
            width={isPageWide ? 560 : 290}
            height={isPageWide ? 536 : 300}
            borderRadius={8}
          />
        </div>
          <div className="flex flex-col gap-3 justify-start">
            <p className="text-gray-700 mb-6">
              From hidden islands to vibrant street markets, we craft seamless
              Thai journeys that blend culture, comfort, and adventure—exactly
              the way you like it.
            </p>
            <ul className="space-y-4">
              {points.map((point, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="text-yellow-400 mt-1" size={20} />
                  <span className="text-gray-800">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
