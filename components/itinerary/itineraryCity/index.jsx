import { useEffect, useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import CitySummary from "./CitySummary";
import CityDaybyDay from "./CityDaybyDay";
import { getStars } from "./SlabElement";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { bookingDetails } from "../../../services/bookings/FetchAccommodation";
import { useRouter } from "next/router";
import Drawer from "../../ui/Drawer";
import HotelBookingDetails from "../../modals/accommodation/Overview/HotelBookingDetails";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";
import { logEvent } from "../../../services/ga/Index";
import { toast } from "react-toastify";
import BackArrow from "../../ui/BackArrow";
import { openNotification } from "../../../store/actions/notification";
import FullScreenGallery from "../../fullscreengallery/Index";
import Skeleton from "../../modals/ViewHotelDetails/Skeleton";
import media from "../../media";
import { TbArrowBack } from "react-icons/tb";

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
  let isPageWide = media("(min-width: 768px)");
  console.log("itineraryciy is:", props);
  const router = useRouter();
  const [viewMore, setViewMore] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const stay = useSelector((state) => state.Stays);
  const { itinerary_status, hotels_status } = useSelector(
    (state) => state.ItineraryStatus
  );
  const [images, setImages] = useState(null);
  const dispatch = useDispatch();

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
    
    const targetHotelId = hotelId || (stay?.[props?.index]?.id || multiHotelStays?.[0]?.id);
    
    await bookingDetails
      .get(
        `/${router?.query?.id}/bookings/accommodation/${targetHotelId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        dispatch(
          openNotification({
            type: "error",
            text: "unable to get detail",
            heading: "Error!",
          })
        );
        setShowDetails(false);
      });
    setLoading(false);
  };

  const handleStay = (e, label, value, clickType) => {
    console.log("cityindex5 is:", props?.city);
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

  console.log("STTTT", multiHotelStays);

  return (
    <div
      data-city-id={stay ? stay[props?.index]?.city_id : props?.city?.id}
      ref={(el) => (props.cityRefs.current[props.city.id] = el)}
      className="border-2 border-gray-200 rounded-t-lg flex flex-col w-full"
    >
      <div className="flex items-start justify-between p-3 rounded-t-lg bg-[#FEFAD8] border-b-2">
        <div className="space-y-1">
          <div className={`md:text-[18px] font-semibold`}>
            {props?.city?.city?.name}
            {" - "}
            {multiHotelDuration}{" "}
            {multiHotelDuration === 1 ? "Night" : "Nights"}
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
          ) : multiHotelStays && multiHotelStays.length > 0 && hotels_status === "SUCCESS" ? (
            <div className="flex flex-col gap-2">
              {multiHotelStays?.map((hotel, hotelIndex) => {
                return (
                  <div key={hotel.id} className="flex flex-col gap-1">
                    
                     
                      <div className="flex flex-col">
                        { hotel?.name &&<><div className="flex gap-2">
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
                          {/* ({hotel?.duration} {hotel?.duration === 1 ? "Night" : "Nights"}) */}
                        </div>
                        </div>
                        <div className="flex flex-row items-center">
                          {hotel?.rating && hotel?.rating !== 0
                            ? getStars(hotel?.rating)
                            : null}{" "}
                          <div className="text-[#7A7A7A] text-[12px] ml-1">
                            {hotel?.rating && hotel?.rating !== 0
                              ? hotel?.rating
                              : null}{" "}
                          </div>
                          {hotel?.user_ratings_total ? (
                            <div className="text-[#7A7A7A] text-[12px] ml-1 underline">
                              {hotel?.user_ratings_total} Google reviews
                            </div>
                          ) : null}
                        </div></>}
                      </div>
                  </div>
                );
              })}
            </div>
          ) : (
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
      
      <Drawer
        show={showDetails}
        anchor={"right"}
        backdrop
        className="font-lexend"
        onHide={() => setShowDetails(false)}
        width={"50%"}
        mobileWidth={"100%"}
      >
        {loading ? (
          <Skeleton />
        ) : (
          <Container>
            <BackContainer className=" font-lexend">
              <BackArrow handleClick={() => setShowDetails(false)} />
            </BackContainer>
            <HotelBookingDetails
              _setImagesHandler={_setImagesHandler}
              user_rating={props.city.hotels?.[0]?.rating}
              number_of_reviews={props.city.hotels?.[0]?.user_ratings_total}
              data={data}
              BookingButtonFun={() => {
                if (!localStorage.getItem("access_token")) {
                  props?.setShowLoginModal(true);
                  return;
                }
                const index = multiHotelStays.findIndex(h => h?.id === data?.id);
                props.handleClickAc(
                  index !== -1 ? index : props?.index,
                  props?.city,
                  props?.city?.city?.id,
                  props?.city?.id
                );
              }}
              images={
                data?.hotel_details?.images ? data?.hotel_details?.images : []
              }
              experience_filters={
                props.poi ? props.poi.experience_filters : null
              }
              name={
                props?.city?.hotels?.[0]?.name
                  ? props?.city?.hotels?.[0]?.name
                  : null
              }
              duration={
                props?.city?.hotels?.[0]?.duration
                  ? props?.city?.hotels?.[0]?.duration
                  : null
              }
              setShowDetails={setShowDetails}
              id={data?.id || props?.city?.hotels?.[0]?.id}
              setShowLoginModal={props?.setShowLoginModal}
            />
            {images ? (
              <FullScreenGallery
                mercury
                closeGalleryHandler={() => setImages(null)}
                images={images}
              ></FullScreenGallery>
            ) : null}
          </Container>
        )}
        {!isPageWide && (
          <FloatingView>
            <TbArrowBack
              style={{ height: "28px", width: "28px" }}
              cursor={"pointer"}
              onClick={() => setShowDetails(false)}
            />
          </FloatingView>
        )}
      </Drawer>
    </div>
  );
};

export default ItineraryCity;