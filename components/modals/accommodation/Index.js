import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";
import { TbArrowBack } from "react-icons/tb";
import media from "../../media";
import Overview from "./Overview/Overview";
import Drawer from "../../ui/Drawer";
import Skeleton from "./Skeleton";
import { openNotification } from "../../../store/actions/notification";
import {
  hotelDetails,
  bookingDetails,
} from "../../../services/bookings/FetchAccommodation";
import { useRouter } from "next/router";
import HotelBookingDetails from "./Overview/HotelBookingDetails";
import { updateAccommodationBooking } from "../../../services/bookings/UpdateBookings";

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

const POI = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const itineraryFilters = useSelector((state) => state.ItineraryFilters);
  const [drawerWidth, setDrawerWidth] = useState("50%");
  useEffect(() => {
    const handleResize = () => {
      setDrawerWidth(window.innerWidth <= 986 ? "100%" : "50%");
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (props.show) {
      fetchDetails();
    }
  }, [props.id, props.show, props.provider]);

  const fetchDetails = () => {
    setLoading(true);
    setError(false);

    if (props.mercury) {
      bookingDetails
        .get(`/${props.itineraryId}/bookings/accommodation/${props.id}/`)
        .then((res) => {
          setLoading(false);
          setData(res.data);
        })
        .catch((err) => {
          setLoading(false);
          setError(true);
        });
    } else {
      let check_in = props.check_in;
      let check_out = props.check_out;
      if (props.check_in.includes("/")) {
        check_in = props.check_in.split("/").reverse().join("-");
        check_out = props.check_out.split("/").reverse().join("-");
      }
      const requestData = {
        trace_id: props.traceId,
        hotel_id: `${props.id}`,
        check_in: new Date(check_in).toISOString().split("T")[0],
        check_out: new Date(check_out).toISOString().split("T")[0],
        currency: "INR",
        source: props.provider,
        occupancies: itineraryFilters.occupancies,
      };

      hotelDetails
        .post("", requestData)
        .then((res) => {
          setLoading(false);
          setData(res.data);
        })
        .catch((err) => {
          setLoading(false);
          setError(true);
        });
    }
  };

  const updateBooking = (recommendation_id, rates) => {
    props.setUpdateBookingState(true);
    let stayBookings=props.plan;
    const index = stayBookings.findIndex(item => item.id == props?.bookingId);

    const requestData = {
      rates: rates,
      itinerary_code: data?.itinerary_code,
      items: data?.items,
      recommendation_id: recommendation_id,
      trace_id: localStorage.getItem("trace_id"),
      itinerary_id: router?.query?.id,
      hotel_id: data?.id,
      source: props.provider,
      booking_id: props?.bookingId,
      city_id:props.plan[index].city_id
    };


    updateAccommodationBooking
    .post(`${router?.query?.id}/bookings/accommodation/`, requestData)
    .then((response) => {
      props._updateStayBookingHandler([response.data]);
      props.setUpdateBookingState(false);
  
      setTimeout(() => {
        props.getPaymentHandler();
      }, 1000);
  
      props.openNotification({
        type: "success",
        text: "Hotel added successfully.",
        heading: "Success!",
      });
  
      try {
        stayBookings[index] = {
          city_id: props.plan[index].city_id,
          city_name: props.plan[index].city_name,
          ...response?.data,
          source:response?.data?.images?.[0]?.source
        };
        props.setStayBookings(stayBookings);
      } catch (error) {
        console.error("Error updating stay bookings:", error);
      }
    })
    .catch((err) => {
      props.setUpdateBookingState(false);
      props.openNotification({
        type: "error",
        text: "Something went wrong! Please try after some time.",
        heading: "Error!",
      });
    });
  
  };


  return (
    <Drawer
      show={props.show}
      anchor={"right"}
      backdrop
      className="font-lexend"
      onHide={() => props.handleCloseDrawer}
      width={drawerWidth}
    >
      {!loading ? (
        <Container>
          <BackContainer className=" font-lexend">
            <IoMdClose
              className="hover-pointer"
              onClick={props.onHide}
              style={{ fontSize: "2rem" }}
            ></IoMdClose>
            <BackText>Back to Itinerary</BackText>
          </BackContainer>
          {!error ? (
            <div>
              {" "}
              {props.mercury ? (
                <HotelBookingDetails
                  _setImagesHandler={props._setImagesHandler}
                  user_rating={props.user_rating}
                  currentBooking={props.currentBooking}
                  number_of_reviews={props.number_of_reviews}
                  data={data}
                  images={
                    data?.hotel_details?.images ? data.hotel_details.images : []
                  }
                  experience_filters={
                    props.poi ? props.poi.experience_filters : null
                  }
                  name={props.poi ? props.poi.name : null}
                  duration={props.poi ? props.poi.ideal_duration_hours : null}
                  BookingButton={props.BookingButton}
                  BookingButtonFun={props.BookingButtonFun}
                  payment={props.payment}
                  updateBooking={updateBooking}
                  handleClick={props?.handleClick}
                  setShowDetails={props?.onHide}
                  id={props?.id}
                />
              ) : (
                <Overview
                  _setImagesHandler={props._setImagesHandler}
                  user_rating={props.user_rating}
                  currentBooking={props.currentBooking}
                  number_of_reviews={props.number_of_reviews}
                  data={data}
                  images={data?.images ? data.images : []}
                  experience_filters={
                    props.poi ? props.poi.experience_filters : null
                  }
                  name={props.poi ? props.poi.name : null}
                  duration={props.poi ? props.poi.ideal_duration_hours : null}
                  BookingButton={props.BookingButton}
                  BookingButtonFun={props.BookingButtonFun}
                  payment={props.payment}
                  updateBooking={updateBooking}
                  bookingId={props?.bookingId}
                ></Overview>
              )}
            </div>
          ) : (
            <ErrorContainer>
              Oops! There seems to be a problem, please try again later!
            </ErrorContainer>
          )}
          {!isPageWide && (
            <FloatingView>
              <TbArrowBack
                style={{ height: "28px", width: "28px" }}
                cursor={"pointer"}
                onClick={props.onHide}
              />
            </FloatingView>
          )}
        </Container>
      ) : (
        <Skeleton onHide={props.onHide} />
      )}
    </Drawer>
  );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
    itineraryId: state.ItineraryId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(POI);
