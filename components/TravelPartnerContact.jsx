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
        {/* <button
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
        </button> */}
        {isDesktop && (
          <>
            <button
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white hover:bg-gray-200"
              onClick={() => setShare(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="none">
  <path d="M1.5 15.75C1.0875 15.75 0.734375 15.6031 0.440625 15.3094C0.146875 15.0156 0 14.6625 0 14.25V6.75C0 6.3375 0.146875 5.98438 0.440625 5.69063C0.734375 5.39688 1.0875 5.25 1.5 5.25H3.75V6.75H1.5V14.25H10.5V6.75H8.25V5.25H10.5C10.9125 5.25 11.2656 5.39688 11.5594 5.69063C11.8531 5.98438 12 6.3375 12 6.75V14.25C12 14.6625 11.8531 15.0156 11.5594 15.3094C11.2656 15.6031 10.9125 15.75 10.5 15.75H1.5ZM5.25 11.25V2.86875L4.05 4.06875L3 3L6 0L9 3L7.95 4.06875L6.75 2.86875V11.25H5.25Z" fill="#1F1F1F"/>
</svg>
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
