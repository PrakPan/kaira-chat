import { useEffect, useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import CitySummary from "./CitySummary";
import CityDaybyDay from "./CityDaybyDay";
import { getStars } from "./SlabElement";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import HotelBookingDetails from "../../modals/accommodation/Overview/HotelBookingDetails";
import { logEvent } from "../../../services/ga/Index";
import media from "../../media";

const ItineraryCity = (props) => {
  const [viewMore, setViewMore] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const stay = useSelector((state) => state.Stays);
  const { itinerary_status, hotels_status } = useSelector(
    (state) => state.ItineraryStatus
  );

  const router=useRouter()
  const fetchDetails = () => {
    // setShowDetails(true);
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: "showHotelDetail",
          idx: props?.index,
          booking_id: stay[props?.index]?.id,
          city_id: props?.city?.city?.id,
        },
      },
      undefined,
      {
        scroll: false,
      }
    );
  };
  const handleStay = (e, label, value, clickType) => {
    e.stopPropagation();
    if (token)
      props?.handleClickAc(
        props?.index,
        props?.city,
        props?.city?.city?.id,
        props?.city?.id,
        clickType
      );
    else props?.setShowLoginModal(true);
    props?.setBookingId(props?.key);

    logEvent({
      action: "Hotel_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: label,
        event_value: value,
        event_action: "Stays",
      },
    });
  };

  useEffect(() => {
    if (props.index === 0) {
      setViewMore(true);
    }
  }, []);

  return (
    <div
      data-city-id={stay ? stay[props?.index]?.city_id : props?.city?.id}
      ref={(el) => (props.cityRefs.current[props.city.id] = el)}
      className="border-2 border-gray-200 rounded-t-lg flex flex-col w-full"
    >
      <div className="flex items-start justify-between p-3 rounded-t-lg bg-[#FEFAD8] border-b-2">
        <div className="space-y-1">
          <div className={`md:text-[18px] font-semibold`}>
            {stay && stay?.length
              ? stay[props?.index]?.city_name ||
                stay[props?.index]?.city ||
                props?.city?.city?.name
              : props?.city?.city?.name}
            {" - "}
            {!(multiHotelStays?.length > 1) ? (stay && stay?.length 
              ? stay[props?.index]?.duration || props?.city?.duration
              : props?.city?.duration) : multiHotelDuration}{" "}
            {!(multiHotelStays?.length > 1) ? (stay && stay?.length 
              ? stay[props?.index]?.duration === 1 ||
                props?.city?.duration === 1
                ? "Night"
                : "Nights"
              : props?.city?.duration === 1
              ? "Night"
              : "Nights") :  "Nights"}
          </div>

          {hotels_status === "PENDING" ? (
            <div className="flex flex-col animate-pulse">
              <div className="flex flex-col gap-1 p-3">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-300 h-5 w-5 rounded-full"></div>
                  <div className="bg-gray-300 h-4 w-24 rounded"></div>
                </div>
                <div className="flex flex-row items-center mt-2 gap-2">
                  <div className="bg-gray-300 h-3 w-16 rounded"></div>
                  <div className="bg-gray-300 h-3 w-12 rounded"></div>
                  <div className="bg-gray-300 h-3 w-32 rounded"></div>
                </div>
              </div>
            </div>
          ) :  stay &&
            stay[props?.index]?.name &&
            hotels_status === "SUCCESS" ? !(multiHotelStays?.length > 1) ? 
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Image
                  src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/Vector.png`}
                  height={22}
                  width={22}
                  className="object-contain"
                  alt="Hotel Icon"
                />
                <div
                  className="text-[14px] font-medium leading-0 underline  cursor-pointer hover:text-blue"
                  onClick={() => fetchDetails()}
                >
                  {stay[props?.index]?.name}
                </div>
              </div>
              <div className="flex flex-row items-center">
                {stay[props?.index] &&
                stay[props?.index]?.rating &&
                stay[props?.index]?.rating !== 0
                  ? getStars(stay[props?.index]?.rating)
                  : null}{" "}
                <div className="text-[#7A7A7A] text-[12px] ml-1">
                  {stay[props?.index] &&
                  stay[props?.index]?.rating &&
                  stay[props?.index]?.rating !== 0
                    ? stay[props?.index]?.rating
                    : null}{" "}
                </div>
                {stay[props?.index] &&
                stay[props?.index]?.user_ratings_total ? (
                  <div className="text-[#7A7A7A] text-[12px] ml-1 underline">
                    {stay[props?.index]?.user_ratings_total} Google reviews
                  </div>
                ) : null}
              </div>
            </div> :
             <div className="flex flex-col gap-1">
              {multiHotelStays?.map((hotel,index) => { 
              return (
              <div key ={index} className="flex items-center gap-2 ">
                <Image
                  src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/Vector.png`}
                  height={22}
                  width={22}
                  className="object-contain"
                  alt="Hotel Icon"
                />

                
                   <div className="flex flex-col">
                  <div
                  className="text-[14px] font-medium leading-0 underline  cursor-pointer hover:text-blue flex gap-2"
                  onClick={() => fetchDetails(hotel?.id)}
                >
                  {hotel?.name} <span className="flex gap-0"> {hotel?.star_category ? getStars(hotel?.star_category) : ""}</span>
                </div> 

                  </div>
                
              </div>)})}
            </div>
          
          
          : (
            <div
              className="text-blue cursor-pointer text-[14px] font-medium hover:underline"
              onClick={(e) =>
                handleStay(e, "Change", props.city.city.name, "Add")
              }
            >
              + Add Stay in {props?.city?.city?.name}
            </div>
          )}
        </div>

        <button
          onClick={() => setViewMore((prev) => !prev)}
          className="flex items-center text-sm font-semibold"
        >
          {viewMore ? (
            <RiArrowDropUpLine className="text-3xl" />
          ) : (
            <RiArrowDropDownLine className="text-3xl" />
          )}
        </button>
      </div>

      {itinerary_status === "SUCCESS" ? (
        viewMore ? (
          <>
            <CityDaybyDay
              mercuryItinerary={props?.mercuryItinerary}
              city={props.city}
              setItinerary={props?.setItinerary}
              setShowLoginModal={props?.setShowLoginModal}
              activityBookings={props?.activityBookings}
              setActivityBookings={props?.setActivityBookings}
              intracityBookings={props?.intracityBookings}
            />
          </>
        ) : (
          <CitySummary
            city={props.city}
            setViewMore={setViewMore}
            activityBookings={props?.activityBookings}
            setActivityBookings={props?.setActivityBookings}
            setItinerary={props?.setItinerary}
            setShowLoginModal={props?.setShowLoginModal}
            index={props?.index}
            intracityBookings={props?.intracityBookings}
            _updateFlightBookingHandler={props?._updateFlightBookingHandler}
            _updateTaxiBookingHandler={props?._updateTaxiBookingHandler}
            _updatePaymentHandler={props?._updatePaymentHandler}
            getPaymentHandler={props?.getPaymentHandler}
          />
        )
      ) : null}
    </div>
  );
};

export default ItineraryCity;