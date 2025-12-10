import { useEffect, useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import CitySummary from "./CitySummary";
import CityDaybyDay from "./CityDaybyDay";
import { getStars } from "./SlabElement";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { logEvent } from "../../../services/ga/Index";
import { toast } from "react-toastify";
import BackArrow from "../../ui/BackArrow";
import { openNotification } from "../../../store/actions/notification";
import FullScreenGallery from "../../fullscreengallery/Index";
import Skeleton from "../../modals/ViewHotelDetails/Skeleton";
import media from "../../media";
import { TbArrowBack } from "react-icons/tb";
import styled from "styled-components";
import { bookingDetails } from "../../../services/bookings/FetchAccommodation";
import useMediaQuery from "../../media";
import POIDetailsDrawer from "../../drawers/poiDetails/POIDetailsDrawer";
import TransferDrawer from "../../../containers/itinerary/TransferDrawer";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";
import { updateTransferBookings } from "../../../store/actions/transferBookingsStore";

const FloatingView = styled.div`
  position: sticky;
  bottom: 60px;
  left: 100%;
  background: black;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  z-index: 251;
  cursor: pointer;
`;

const Container = styled.div`
  padding: 0 0.75rem 0.75rem 0.75rem;
  @media screen and (min-width: 768px) {
    padding: 0 1.25rem 1.25rem 1.25rem;
  }
`;

const BackContainer = styled.div`
  margin: 0;
  display: flex;
  gap: 0.5rem;
  position: sticky;
  z-index: 1;
  background: white;
  top: 0;
  padding-block: 0.75rem;
  @media screen and (min-width: 768px) {
    padding-block: 1rem;
  }
`;

const ItineraryCity = (props) => {
  const [viewMore, setViewMore] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const stay = useSelector((state) => state.Stays);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { itinerary_status, hotels_status } = useSelector(
    (state) => state.ItineraryStatus
  );

  // State for POI drawer data
  const [dayByDay, setDayByDay] = useState(null);
  const [dayByDayIndex, setDayByDayIndex] = useState(0);

  // State for Sightseeing/Taxi drawer
  const [handleShowTaxi, setHandleShowTaxi] = useState(false);
  const [taxiData, setTaxiData] = useState(null);
  const [taxiLoading, setTaxiLoading] = useState(false);

  const transferBookings = useSelector(
    (state) => state.TransferBookings
  ).transferBookings;

  const isDesktop = useMediaQuery("(min-width:767px)");
  const router = useRouter();
  const itineraryDaybyDay = useSelector((state) => state.Itinerary);
  const dispatch = useDispatch();

  const [images, setImages] = useState(null);

  const {
    drawer,
    poi_id,
    type,
    dayIndex,
    index,
    itinerary_city_id,
    idx,
    date,
    bookingId,
    city_id,
  } = router?.query;

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

  // Initialize dayByDay data from city prop
  useEffect(() => {
    let dayByDayArray = [];
    var idx = 0;
    for (const daybyday of props.city.day_by_day) {
      for (const element of daybyday?.slab_elements) {
        if (element.element_type === "activity") {
          element.dayIndex = idx;
          dayByDayArray.push(element);
        }
      }
      idx += 1;
    }
    setDayByDay(dayByDayArray);
  }, [props.city]);

  // Update dayByDayIndex when poi_id changes
  useEffect(() => {
    if (drawer === "showPoiDetail" && 
        poi_id && 
        dayByDay && 
        dayByDay.length > 0 &&
        String(itinerary_city_id) === String(props.city.id)) {
      const foundIndex = dayByDay.findIndex((item) => {
        // For activities with bookings, match against booking.id
        if (item?.booking?.id) {
          return String(item.booking.id) === String(poi_id);
        }
        // For POIs or activities without bookings, match against poi or activity id
        return (
          String(item?.poi) === String(poi_id) || 
          String(item?.activity) === String(poi_id)
        );
      });
      
      if (foundIndex !== -1) {
        setDayByDayIndex(foundIndex);
      }
    }
  }, [drawer, poi_id, dayByDay, itinerary_city_id, props.city.id]);

  const fetchDetails = async (hotelId = null) => {
    setShowDetails(true);
    setLoading(true);
    
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

  const handleStay = (e, label, value, clickType, hotelId) => {
    e.stopPropagation();
    if (token) {
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

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    router.push(
      {
        pathname: `/itinerary/${router?.query?.id}`,
        query: {}, // remove "drawer"
      },
      undefined,
      { scroll: false }
    );
  };

  useEffect(() => {
    if (props.index === 0) {
      setViewMore(true);
    }
  }, []);

  // Handle delete for taxi/sightseeing booking
  const handleDeleteTaxi = async (val) => {
    if (!localStorage?.getItem("access_token")) {
      props?.setShowLoginModal(true);
      return;
    }
    const dataPassed = val != null ? val : taxiData;
    try {
      setTaxiLoading(true);
      const response = await axiosDeleteBooking.delete(
        `${router?.query?.id}/bookings/${
          dataPassed?.booking_type?.includes(",")
            ? `combo`
            : dataPassed?.booking_type?.toLowerCase()
        }/${dataPassed?.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 204) {
        dispatch(updateTransferBookings(dataPassed?.id));
        setTaxiLoading(false);
        props?.getPaymentHandler();

        setHandleShowTaxi(false);
        handleCloseDrawer();
        dispatch(
          openNotification({
            type: "success",
            text: `Taxi deleted successfully`,
            heading: "Success!",
          })
        );
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.errors?.[0]?.message?.[0] ||
        err.response?.data?.errors[0]?.detail ||
        err.message;
      dispatch(
        openNotification({
          type: "error",
          text: errorMsg,
          heading: "Error!",
        })
      );
      setTaxiLoading(false);
    }
  };

  // Activity data for POI drawer
  const activityData = {
    id: poi_id,
    type: type,
    dayIndex: dayIndex,
    index: index,
  };

  return (
    <div
      data-city-id={stay ? stay[props?.index]?.city_id : props?.city?.id}
      ref={(el) => (props.cityRefs.current[props.city.id] = el)}
      className="border-1 rounded-t-lg flex flex-col w-full border-color-light-grey"
    >
      <div className="flex items-start justify-between p-3 rounded-t-lg border-b border-color-light-grey">
        <div className="space-y-1 font-montserrat">
          <div className={`md:text-[18px] font-semibold`}>
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
                          className="text-[14px] font-medium leading-0 underline cursor-pointer hover:text-blue"
                          onClick={() => fetchDetails(hotel.id)}
                        >
                          {hotel?.name} 
                        </div>
                        </div>
                        <div className="flex flex-row items-center border-l pl-[8px] ">
                            <div className="text-[#000] text-[12px] ml-1 font-[500]">
                            {hotel?.rating && hotel?.rating !== 0
                              ? hotel?.rating
                              : null}{" "}
                          </div>
                          {hotel?.rating && hotel?.rating !== 0
                            ? <div className="flex items-center text-primary-stars">
                                              <Image src="/star.svg" width={16} height={16} alt="star" />
                              </div>
                            : null}{" "}
                        </div></>}
                      </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <button
              className="text-blue cursor-pointer text-[14px] font-medium hover:underline"
              onClick={(e) =>
                handleStay(e, "Add", props.city.city.name, "Add", null)
              }
            >
              + Add Stay in {props?.city?.city?.name}
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
              nextCity={props?.nextCity}
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
            nextCity={props?.nextCity}
          />
        )
      )}
      
      {/* <div className={`${isDesktop ? "pl-[34px] pr-[17px]" : "px-[10px]"}  pb-[24px]  bg-[#FBFBFB]`}>
       <div className="p-[10px] bg-white flex gap-[10px] items-center rounded-[8px] shadow-sm">
            <Image src="/checkout.png" alt="checkout" height={47} width={71}/>
            <div className="Body2M_14">This is your check out day in {props?.city?.city?.name}, take a {transferBookings?.intercity?.[`${props?.city?.id}:${props?.nextCity?.id || props?.nextCity?.gmaps_place_id}`]?.booking_type || "transfer"} to {props?.nextCity?.city?.name || itineraryDaybyDay?.end_city?.name}.</div>
          </div>
      </div> */}

      {/* POI Details Drawer - Only render for matching city */}
      {drawer === "showPoiDetail" && 
       String(itinerary_city_id) === String(props.city.id) &&
       dayByDay && 
       dayByDay.length > 0 &&
       dayByDay[dayByDayIndex] && (
        <POIDetailsDrawer
          itineraryDrawer
          show={true}
          handleCloseDrawer={handleCloseDrawer}
          slabIndex={dayByDayIndex}
          iconId={
            dayByDay[dayByDayIndex]?.booking?.id ||
            dayByDay[dayByDayIndex]?.poi || 
            dayByDay[dayByDayIndex]?.activity
          }
          name={dayByDay[dayByDayIndex]?.heading}
          image={dayByDay[dayByDayIndex]?.icon}
          text={dayByDay[dayByDayIndex]?.text}
          Topheading={"Select Our Point Of Interest"}
          activityData={activityData}
          showBookingDetail={true}
          setShowLoginModal={props?.setShowLoginModal}
          dayIndex={dayIndex}
          itinerary_city_id={props.city.id}
          cityID={props.city.city.id}
          cityName={props.city.city.name}
          removeDelete={false}
        />
      )}

      {/* Sightseeing/Taxi Drawer - Only render for matching city */}
      {drawer === "SightSeeing" && 
       String(itinerary_city_id) === String(props.city.id) &&
       bookingId && (
        <TransferDrawer
          show={true}
          setHandleShow={setHandleShowTaxi}
          bookingData={taxiData}
          booking_type={"Taxi"}
          booking_id={bookingId}
          loading={taxiLoading}
          handleDelete={handleDeleteTaxi}
          origin_itinerary_city_id={props?.city?.id || props?.city?.gmaps_place_id}
          destination_itinerary_city_id={props?.city?.id || props?.city?.gmaps_place_id}
          itinerary_city_id={props?.city?.id || props?.city?.gmaps_place_id}
          setShowDrawer={setHandleShowTaxi}
          _updateFlightBookingHandler={props?._updateFlightBookingHandler}
          _updatePaymentHandler={props?._updatePaymentHandler}
          getPaymentHandler={props?.getPaymentHandler}
          setShowLoginModal={props?.setShowLoginModal}
          setError={props?.setError}
          isIntracity={true}
          isSightseeing={true}
        />
      )}
    </div>
  );
};

export default ItineraryCity;