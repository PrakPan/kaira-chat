import { useEffect, useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

import CitySummary from "./CitySummary";
import CityDaybyDay from "./CityDaybyDay";
import { getStars } from "./SlabElement";
import Image from "next/image";
import { useSelector } from "react-redux";
import { bookingDetails } from "../../../services/bookings/FetchAccommodation";
import { useRouter } from "next/router";
import Drawer from "../../ui/Drawer";
import HotelBookingDetails from "../../modals/accommodation/Overview/HotelBookingDetails";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";
import { logEvent } from "../../../services/ga/Index";
import { toast } from "react-toastify";

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

const BackText = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const FloatingVContaineriew = styled.div`
  position: sticky;
  bottom: 10px;
  background: #f7e700;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 90%;
  z-index: 2;
  cursor: pointer;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 90%;
  margin: auto;
  text-align: center;
`;
const ItineraryCity = (props) => {
  const router = useRouter();
  const [viewMore, setViewMore] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [data, setData] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const stay = useSelector((state) => state.Stays);
  const { itinerary_status, hotels_status } = useSelector(
    (state) => state.ItineraryStatus
  );
  const fetchDetails = () => {
    setShowDetails(true);
    bookingDetails
      .get(
        `/${router?.query?.id}/bookings/accommodation/${props.city.hotels[0]?.id}/`
      )
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        props.openNotification({
          type: "error",
          text: "unable to get detail",
          heading: "Error!",
        });
        setShowDetails(false);
      });
  };
  const handleStay = (e, label, value, clickType) => {
    console.log("Props?.city", props?.city);
    e.stopPropagation();
    if (token)
      props?.handleClickAc(
        props?.index,
        props?.city,
        props?.city?.city?.id,
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

  //  console.log("STTTT",stay);

  return (
    <div
      data-city-id={stay ? stay[props?.index]?.city_id : props?.city?.id}
      ref={(el) => (props.cityRefs.current[props.city.id] = el)}
      className="border-2 border-gray-200 rounded-t-lg flex flex-col"
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
            {stay && stay?.length
              ? stay[props?.index]?.duration || props?.city?.duration
              : props?.city?.duration}{" "}
            {stay && stay?.length
              ? stay[props?.index]?.duration === 1 ||
                props?.city?.duration === 1
                ? "Night"
                : "Nights"
              : props?.city?.duration === 1
              ? "Night"
              : "Nights"}
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
          ) : stay &&
            stay[props?.index]?.name &&
            hotels_status === "SUCCESS" ? (
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
        <Container>
          <BackContainer className=" font-lexend">
            <IoMdClose
              className="hover-pointer"
              style={{ fontSize: "2rem" }}
              onClick={() => setShowDetails(false)}
            ></IoMdClose>
            <BackText>Back to Itinerary</BackText>
          </BackContainer>
          <HotelBookingDetails
            _setImagesHandler={props._setImagesHandler}
            user_rating={props.city.hotels[0]?.rating}
            number_of_reviews={props.city.hotels[0]?.user_ratings_total}
            data={data} //
            images={
              props?.city?.hotels[0]?.images
                ? props?.city?.hotels[0]?.images
                : []
            }
            experience_filters={props.poi ? props.poi.experience_filters : null}
            name={
              props?.city?.hotels[0]?.name ? props?.city?.hotels[0]?.name : null
            }
            duration={
              props?.city?.hotels[0]?.duration
                ? props?.city?.hotels[0]?.duration
                : null
            }
            setShowDetails={setShowDetails}
            id={props?.city?.hotels?.[0]?.id}
          />
        </Container>
      </Drawer>
    </div>
  );
};

export default ItineraryCity;
