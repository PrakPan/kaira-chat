import Image from "next/image";
import { SocialShareDesktop } from "../containers/itinerary/booking1/SocialShare";
import { useState } from "react";
import useMediaQuery from "../hooks/useMedia";
import ModalWithBackdrop from "./ui/ModalWithBackdrop";
import Settings from "./settings/Index";
import BottomModal from "./ui/LowerModal";
import { MERCURY_HOST } from "../services/constants";
import axios from "axios";
import { useRouter } from "next/router";
import setItineraryStatus from "../store/actions/itineraryStatus";
import { axiosGetItineraryStatus } from "../services/itinerary/daybyday/preview";
import { useDispatch, useSelector } from "react-redux";
import { setCloneItineraryDrawer } from "../store/actions/cloneItinerary";


export default function TravelPartnerContact(props) {
  const [share, setShare] = useState(false);
  const isDesktop = useMediaQuery("(min-width:767px)");
  
  const router = useRouter();
  const {id} = useSelector(state=>state.auth);
  const itinerary_id = router.query.id;
  

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <button
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
          onClick={() => {
            Promise.resolve(
              axios.get(
                `${MERCURY_HOST}/api/v1/itinerary/${itinerary_id}/bookings/hotels/?fields=no_of_hotels`
              )
            )
              .then((res) => {
                props?.setIsHotelsPresent(res.data.no_of_hotels > 0);
              })
              .catch((err) => {
                props?.setIsHotelsPresent(false);
              })
              .finally(() => {
                // if(id != props?.itinerary?.customer){

                //   dispatch(setCloneItineraryDrawer(true));
                // }
                // else 
                  props?.setShowSettings(true);


              });
          }}
        >
          <Image
            src={"/settings.svg"}
            height={22}
            width={22}
            className=" text-gray-600"
          />
        </button>
        {isDesktop && (
          <>
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
              <>
                <div
                  className="fixed inset-0 bg-black/40 z-[1999] backdrop-blur-[1px]"
                  onClick={() => setShare(false)}
                />
                <SocialShareDesktop
                  social_title={props?.itinerary?.social_title}
                  social_description={props?.social_description}
                  itineraryName={props?.itinerary?.name}
                  itineraryImage={props?.itinerary?.images?.[0]}
                  share={share}
                  setShare={setShare}
                />
              </>
            )}
          </>
        )}
      </div>
      
    </div>
  );
}
