import Image from "next/image";
import { SocialShareDesktop } from "../containers/itinerary/booking1/SocialShare";
import { useState } from "react";
import useMediaQuery from "../hooks/useMedia";
import ModalWithBackdrop from "./ui/ModalWithBackdrop";
import Settings from "./settings/Index";
import BottomModal from "./ui/LowerModal";

export default function TravelPartnerContact(props) {
  const [share, setShare] = useState(false);
  const isDesktop = useMediaQuery("(min-width:767px)");
  const [showSettings, setShowSettings] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <button
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
          onClick={() => setShowSettings(true)}
        >
          <Image
            src={"/settings.svg"}
            height={22}
            width={22}
            className=" text-gray-600"
          />
        </button>
        {isDesktop && (
          <div className="relative">
            <button
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
              onClick={() => setShare(true)}
            >
              <Image
                src="/share.svg"
                height={22}
                width={22}
                className="text-gray-600"
              />
            </button>
            {share && (
              <div>
                <SocialShareDesktop
                  social_title={props?.itinerary?.social_title}
                  social_description={props?.social_description}
                  itineraryName={props?.itinerary?.name}
                  itineraryImage={props?.itinerary?.images?.[0]}
                  share={share}
                  setShare={setShare}
                />
              </div>
            )}
          </div>
        )}
      </div>
      {isDesktop ?<ModalWithBackdrop
        centered
        show={showSettings == true}
        mobileWidth="100%"
        backdrop
        closeIcon={true}
        onHide={() => setShowSettings(false)}
        borderRadius={"12px"}
        animation={false}
        backdropStyle={{
          backgroundColor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(1px)",
        }} // <- add this
        paddingX="20px"
        paddingY="20px"
      >
        <Settings setShowSettings={setShowSettings}/>
      </ModalWithBackdrop>:
      <BottomModal
        show={showSettings == true}
        onHide={() => setShowSettings(false)}
        width="100%"
        height="max-content"
        paddingX="16px"
        paddingY="31px"
      >
        <Settings />
      </BottomModal>
      }
    </div>
  );
}
