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
import { setItineraryStatus } from "../store/actions/itineraryStatus";

const divideTravellers = (val) => {
  let distribution = [];

  let tempadults = val.number_of_adults;
  let tempChildren = val.number_of_children;
  let tempInfants = val.number_of_infants;
  while (tempadults != 0) {
    if (tempadults >= 2) {
      distribution.push({ adults: 2, children: 0 });
      tempadults -= 2;
    } else {
      distribution.push({ adults: tempadults, children: 0 });
      tempadults = 0;
    }
  }

  let childIdx = 0;

  while (tempChildren != 0) {
    if (!distribution[childIdx % distribution.length].children) {
      distribution[childIdx % distribution.length].children = 0;
    }
    distribution[childIdx % distribution.length].children += 1;
    tempChildren -= 1;
    if (!distribution[childIdx % distribution.length].childAges) {
      distribution[childIdx % distribution.length].childAges = [];
    }
    distribution[childIdx % distribution.length].childAges.push(10);
    childIdx += 1;
  }

  while (tempInfants != 0) {
    if (!distribution[childIdx % distribution.length].children) {
      distribution[childIdx % distribution.length].children = 0;
    }
    distribution[childIdx % distribution.length].children += 1;
    tempInfants -= 1;
    if (!distribution[childIdx % distribution.length].childAges) {
      distribution[childIdx % distribution.length].childAges = [];
    }
    distribution[childIdx % distribution.length].childAges.push(1);
    childIdx += 1;
  }

  return distribution;
};

const mergePassengers=(data)=>{
  const number_of_adults=data.room_configuration.reduce((acc,curr)=>acc+curr.adults,0)
  const number_of_children=data.room_configuration.reduce((acc,curr)=>acc+curr.children,0)
  const number_of_infants=data.room_configuration.reduce((acc,curr)=>acc+curr.infants,0)
  return {
    numberOfAdults:number_of_adults,
    numberOfChildren:number_of_children,
    numberOfInfants:number_of_infants,
  }
}


export default function TravelPartnerContact(props) {
  const [share, setShare] = useState(false);
  const isDesktop = useMediaQuery("(min-width:767px)");
  const [showSettings, setShowSettings] = useState(false);
  const [isHotelsPresent,setIsHotelsPresent]=useState(true);
  const router = useRouter();
  const itinerary_id = router.query.id;

  const fetchItineraryStatus = async (itineraryId = router.query.id) => {
    try {
      const res = await axiosGetItineraryStatus.get(`/${itineraryId}/status/`);
      const status = res.data?.celery;
      dispatch(
        setItineraryStatus("pricing_status", status?.PRICING || "PENDING")
      );
      dispatch(
        setItineraryStatus("transfers_status", status?.TRANSFERS || "PENDING")
      );
      dispatch(
        setItineraryStatus("hotels_status", status?.HOTELS || "PENDING")
      );
      dispatch(
        setItineraryStatus("itinerary_status", status?.ITINERARY || "PENDING")
      );
      fetchItinerary();
    } catch (err) {
      console.error("[ERROR]: axiosGetItineraryStatus: ", err.message);
    }
  };

  const handleApply=async(data)=>{
    try {
      const req=data
      console.log("req is: ",req)
      if(req.add_hotels==true){
        req.passengers=mergePassengers(req.room_configuration)
      }
      else{
        req.room_configuration=divideTravellers(req.passengers)
      }
      const res = await axios.post(`${MERCURY_HOST}//api/v1/itinerary/${itinerary_id}/itinerary-edit/`,req,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      fetchItineraryStatus();
    } catch (err) {
      console.log("error is:",err)
    }
  }
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <button
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
          onClick={() => {
            Promise.resolve(axios.get(`${MERCURY_HOST}/api/v1/itinerary/${itinerary_id}/bookings/hotels/?fields=no_of_hotels`)).then((res) => {
              setIsHotelsPresent(res.data.no_of_hotels > 0);
            }).catch((err) => {
              setIsHotelsPresent(false);
            }).finally(() => {
              setShowSettings(true)
            })
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
        <Settings setShowSettings={setShowSettings} isHotelsPresent={isHotelsPresent} handleApply={handleApply}/>
      </ModalWithBackdrop>:
      <BottomModal
        show={showSettings == true}
        onHide={() => setShowSettings(false)}
        width="100%"
        height="max-content"
        paddingX="16px"
        paddingY="31px"
      >
        <Settings setShowSettings={setShowSettings} isHotelsPresent={isHotelsPresent} handleApply={handleApply}/>
      </BottomModal>
      }
    </div>
  );
}
