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
import fetchaccommodations, {
  hotelDetails,
} from "../../../services/bookings/FetchAccommodation";
import { useRouter } from "next/router";
import HotelBookingDetails from "./Overview/HotelBookingDetails";
import { updateAccommodationBooking } from "../../../services/bookings/UpdateBookings";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";
import BackArrow from "../../ui/BackArrow";
import zIndex from "@mui/material/styles/zIndex";

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
  z-index: 900;
  cursor: pointer;
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

const ViewHotelDetails = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const { drawer, booking_id, idx, city_id } = router.query;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState("50%");
  const dispatch = useDispatch();
  const CallPaymentInfo = useSelector((state) => state.CallPaymentInfo);
  useEffect(() => {
    const handleResize = () => {
      setDrawerWidth(window.innerWidth <= 986 ? "100%" : "50%");
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (props.show && drawer!=="showHotelDetail") {
      console.log(
        "booking id is:",
        booking_id,
        "props booking id is 2:",
        props?.id
      );
      fetchDetails();
    }
  }, [props.id, props.show, props.provider]);

  const fetchDetails = () => {
    console.log(
      "booking id is:",
      booking_id,
      "props booking id is 2:",
      props?.id
    );
    setLoading(true);
    setError(false);

    if (props?.mercury) {
      const requestData = {
        trace_id: props?.traceId,
        check_in: (props?.check_in).split("/").join("-"),
        check_out: (props?.check_out).split("/").join("-"),
        hotel_id: props?.id,
        occupancies: props?.occupancies?.map((item) => {
          return {
            num_adults: item.adults,
            child_ages: item.childAges,
          };
        }),
        source: props?.source,
        currency: "INR",
        city_id:props?.city_id
      };
      hotelDetails
        .post("", requestData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((res) => {
          setLoading(false);
          setData(res.data);
        })
        .catch((err) => {
          setLoading(false);
          setError(true);
        });
    } else {
      setLoading(true);
      setError(false);
      if (props.check_in.includes("/")) {
        check_in = props.check_in.split("/").reverse().join("-");
        check_out = props.check_out.split("/").reverse().join("-");
      }
      let paramsObj = {
        accommodation_id: props.id,
        show_rooms: true,
      };
      if (
        // props.currentBooking &&
        // props.currentBooking.source &&
        props.source == "Agoda"
      ) {
        paramsObj.source = "Agoda";
      }
      fetchaccommodations
        .get("", {
          params: paramsObj,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((res) => {
          setLoading(false);
          setData(res.data);
        })
        .catch((error) => {
          setLoading(false);
          setError(true);
          props.openNotification({
            type: "error",
            text: "There seems to be a problem, please try again!",
            heading: "Error!",
          });
        });
    }
  };

  const index = props.plan.findIndex((item) => item.itinerary_city_id == props?.itinerary_city_id);

  const updateBooking = (recommendation_id, rates) => {
    props.setUpdateBookingState(true);
    let stayBookings = props.plan;
    const index = stayBookings.findIndex((item) => item.itinerary_city_id == props?.itinerary_city_id);
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
      itinerary_city: props?.itinerary_city_id,
      city_id: props.plan[index].city_id,
    };

    updateAccommodationBooking
      .post(`${router?.query?.id}/bookings/accommodation/`, requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        props._updateStayBookingHandler([response.data]);
        props.setUpdateBookingState(false);
        dispatch(SetCallPaymentInfo(!CallPaymentInfo));
        setTimeout(() => {
          props.getPaymentHandler();
        }, 1000);

        props.openNotification({
          type: "success",
          text: "Hotel added successfully.",
          heading: "Success!",
        });
        props?.onHide();


        try {
          stayBookings[index] = {
            city_id: props.plan[index].city_id,
            city_name: props.plan[index].city_name,
            ...response?.data,
            source: response?.data?.images?.[0]?.source,
            itinerary_city_id: props?.itinerary_city_id,
          };
          props.setStayBookings(stayBookings);
          props.openNotification({
            type: "success",
            text: `${data?.name} added to itinerary Successfully`,
            heading: "Success!",
          });
          props?.handleClose();
          props?.onHide();
          // router.push(
          //   {
          //     pathname: `/itinerary/${router.query.id}`,
          //     query: {}, // remove "drawer"
          //   },
          //   undefined,
          //   { scroll: false }
          // );
        } catch (error) {
          props.openNotification({
            type: "error",
            text: `${error.response?.data?.errors[0]?.message[0]}`,
            heading: "Error!",
          });
        }
      })
      .catch((err) => {
        props.setUpdateBookingState(false);
        props.openNotification({
          type: "error",
          text: `${err.response?.data?.errors[0]?.message[0]}`,
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
      onHide={props.onHide}
      style={{zIndex:1252}}
      width={"50vw"}
      mobileWidth={"100vw"}
    >
      {!loading ? (
        <Container>
          <BackContainer className=" font-lexend">
            <BackArrow handleClick={props.onHide} />
          </BackContainer>
          {!error ? (
            <div>
              {" "}
              {props.mercury ? (
                <HotelBookingDetails
                  _setImagesHandler={props._setImagesHandler}
                  user_rating={props.user_rating}
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
                  handleClick={props?.handleClick}
                  setShowDetails={props?.setShowDetails}
                  id={props?.id}
                  setShowLoginModal={props.setShowLoginModal}
                  onHide={props?.onHide}
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
        </Container>
      ) : (
        <Skeleton onHide={props.onHide} />
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

export default connect(mapStateToPros, mapDispatchToProps)(ViewHotelDetails);
