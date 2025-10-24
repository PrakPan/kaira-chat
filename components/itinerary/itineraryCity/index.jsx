import { useEffect, useState } from "react";
import CitySummary from "./CitySummary";
import CityDaybyDay from "./CityDaybyDay";
import { getStars } from "./SlabElement";
import Image from "next/image";
import {  useSelector } from "react-redux";
import { useRouter } from "next/router";
import { logEvent } from "../../../services/ga/Index";
import styled from "styled-components";
import useMediaQuery from "../../media";

const ItineraryCity = (props) => {
  const [viewMore, setViewMore] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const stay = useSelector((state) => state.Stays);
  const [loading,setLoading] = useState(false);
  const [showDetails,setShowDetails] =  useState(false);
  const { itinerary_status, hotels_status } = useSelector(
    (state) => state.ItineraryStatus
  );
  const isDesktop = useMediaQuery("(min-width:767px)");

  const router=useRouter()
 
  const [images, setImages] = useState(null);

  // Use cityHotels and totalDuration from props instead of calculating locally
  const multiHotelStays = props.cityHotels || stay?.filter(hotel => {
    return hotel?.itinerary_city_id === props?.itinerary_city_id;
  });

  const multiHotelDuration = props.totalDuration || multiHotelStays?.reduce(
    (accumulator, currentValue) => accumulator + currentValue?.duration,
    0,
  ) || 0;

  const _setImagesHandler = (images) => {
    setImages(images);
  };

  const fetchDetails = async (hotelId = null) => {
    setShowDetails(true);
    setLoading(true);
    console.log("Hii I'm there")


    
    const targetHotelId = hotelId || (stay?.[props?.index]?.id || multiHotelStays?.[0]?.id);

    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: "showHotelDetail",
          idx: props?.index,
          booking_id: targetHotelId,
          city_id: props?.city?.city?.id,
        },
      },
      undefined,
      {
        scroll: false,
      }
    );
    
    setLoading(false);
  };

  const handleStay = (e, label, value, clickType,hotelId) => {
    e.stopPropagation();
    if (token){
      const index = multiHotelStays.findIndex(h => h?.id === hotelId);
      props?.handleClickAc(
         index !== -1 ? index : props?.index,
        props?.city,
        props?.city?.city?.id,
        props?.city?.id,
        clickType
      );
    }
    else props?.setShowLoginModal(true);

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
      className="border-1 rounded-t-lg flex flex-col w-full  border-[#E5E5E5] border-[1px]"
    >
      <div className="px-[16px] py-[12px] flex items-start justify-between rounded-t-lg border-b-[1px] border-[#E5E5E5]  ">
        <div className="space-y-1 ">
          <div className={`${!isDesktop?"Body1M_16":"Heading3SB"}`}>
            {props?.city?.city?.name}
            {" - "}
            {multiHotelDuration}{" "}
            {multiHotelDuration > 1 ? "Nights" : "Night"}  {props?.city?.duration === 0 ? "(Transit City)" : ""}
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
          ) : multiHotelStays && multiHotelStays.length > 0 && hotels_status === "SUCCESS" && multiHotelStays?.[0]?.id  ? (
            <div className="flex flex-col gap-2">
              {multiHotelStays?.map((hotel, hotelIndex) => {
                return (
                  <div key={hotel.id} className="flex flex-col gap-1">
                    
                     
                      <div className="flex flex-row">
                        { hotel?.name &&<><div className="flex gap-2 pr-[8px] ">
                         <Image
                        src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/Vector.png`}
                        height={22}
                        width={22}
                        className="object-contain"
                        alt="Hotel Icon"
                      />
                        <div
                          className={`${!isDesktop?"Body3M_12":"Body2R_14"} cursor-pointer hover:underline`}
                          onClick={() => fetchDetails(hotel.id)}
                        >
                          {hotel?.name} 
                          {/* ({hotel?.duration} {hotel?.duration === 1 ? "Night" : "Nights"}) */}
                        </div>
                        </div>
                        <div className="flex flex-row items-center border-l pl-[8px] ">
                            <span className="text-primary-stars flex">{hotel?.rating && hotel?.rating !== 0
                            ? getStars(hotel?.rating)
                            : null} </span>
                            <div className=" text-[12px] ml-1 font-[500]">
                            {hotel?.rating && hotel?.rating !== 0
                              ? hotel?.rating
                              : null}{" "}
                          </div>
                        
                        </div></>}
                      </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <button
            className={`${!isDesktop?"Body3M_12":"Body2R_14"} text-blue cursor-pointer hover:underline`}
              onClick={(e) =>
                handleStay(e, "Add", props.city.city.name, "Add",null)
              }
            >
              + Add a Stay in {props?.city?.city?.name}
            </button>
          )}
        </div>

        <button
          onClick={() => setViewMore((prev) => !prev)}
          className="flex items-center text-sm font-semibold"
        >
        </button>
      </div>

      {(
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
      )}
    </div>
  );
};

export default ItineraryCity;