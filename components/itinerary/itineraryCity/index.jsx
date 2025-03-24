import { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

import CitySummary from "./CitySummary";
import CityDaybyDay from "./CityDaybyDay";
import { MdOutlineStar } from "react-icons/md";
import { getStars } from "./SlabElement";
import Image from "next/image";
import { useSelector } from "react-redux";
import {
  bookingDetails,
  hotelDetails,
} from "../../../services/bookings/FetchAccommodation";
import { useRouter } from "next/router";
import Drawer from "../../ui/Drawer";
import HotelBookingDetails from "../../modals/accommodation/Overview/HotelBookingDetails";
import Overview from "../../modals/accommodation/Overview/Overview";
import AccommodationModal from "../../modals/accommodation/Index";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";

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
  const [bookingId, setBookingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [data,setData]=useState(null)
  const fetchDetails = () => {
    setLoading(true);

    bookingDetails
      .get(
        `/${router?.query?.id}/bookings/accommodation/${props.city.hotels[0]?.id}/`
      )
      .then((res) => {
        setData(res.data);
        setLoading(false);
        setShowDetails(true)
      })
      .catch((err) => {
        setLoading(false);
      });
  };  
  const handleStay = ()=>{
    props?.setBookingId(props?.idMapping);
    props?.setShowDetails(true);
  }

  return (
    <div
      data-city-id={props.city.id}
      ref={(el) => (props.cityRefs.current[props.city.id] = el)}
      className="border-2 border-gray-200 rounded-t-lg flex flex-col"
    >
      <div className="flex items-start justify-between p-3 rounded-t-lg bg-[#FEFAD8] border-b-2">
        <div className="space-y-1">
          <div className={`md:text-[18px] font-semibold`}>
            {props.city.city.name}
            {" - "}
            {props.city.duration}{" "}
            {props.city.duration === 1 ? "Night" : "Nights"}
          </div>

          {props.city?.hotels && props.city.hotels.length ? (
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
                  {props.city.hotels[0]?.name}
                </div>
              </div>
              <div className="flex flex-row items-center">
                {getStars(props.city.hotels[0]?.rating)}{" "}
                <div className="text-[#7A7A7A] text-[12px] ml-1">
                  {props.city.hotels[0]?.rating} ·{" "}
                </div>
                <div className="text-[#7A7A7A] text-[12px] ml-1 underline">
                  {props.city.hotels[0]?.user_ratings_total} Google reviews
                </div>
              </div>
            </div>
          ) : <div className="text-blue cursor-pointer text-[14px] font-medium" onClick={handleStay}>
         + Add Stay in {props?.city?.city?.name}
        </div>}
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

      {viewMore ? (
        <>
          <CityDaybyDay city={props.city} setItinerary={props?.setItinerary} />
        </>
      ) : (
        <CitySummary
          city={props.city}
          setViewMore={setViewMore}
          activityBookings={props?.activityBookings}
          setActivityBookings={props?.setActivityBookings}
        />
      )}
      <Drawer
        show={showDetails}
        anchor={"right"}
        backdrop
        className="font-lexend"
        onHide={() => setShowDetails(false)}
        width={"50%"}
      >
        {!loading && (
          <Container>
            <BackContainer className=" font-lexend">
              <IoMdClose
                className="hover-pointer"
                onClick={props.onHide}
                style={{ fontSize: "2rem" }}
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
              experience_filters={
                props.poi ? props.poi.experience_filters : null
              }
              name={
                props?.city?.hotels[0]?.name
                  ? props?.city?.hotels[0]?.name
                  : null
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
        )}
      </Drawer>
    </div>
  );
};

export default ItineraryCity;
