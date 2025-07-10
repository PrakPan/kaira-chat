import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { TbArrowBack } from "react-icons/tb";
import media from "../../media";
import { openNotification } from "../../../store/actions/notification";
import fetchaccommodations, {
  bookingDetails,
} from "../../../services/bookings/FetchAccommodation";
import { useRouter } from "next/router";
import HotelBookingDetails from "./Overview/HotelBookingDetails";
import { updateAccommodationBooking } from "../../../services/bookings/UpdateBookings";
import { ToastContainer } from "react-toastify";
import { ToastContainer } from "react-toastify";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";
import OverviewParam from "./Overview/OverviewParam";
import { setShowHotelDrawer } from "../../../store/actions/ui";
import OverviewParam from "./Overview/OverviewParam";
import { setShowHotelDrawer } from "../../../store/actions/ui";
const Container = styled.div`
  padding: 0 0.75rem 0.75rem 0.75rem;
  @media screen and (min-width: 768px) {
    padding: 0 1.25rem 1.25rem 1.25rem;
  }
`;

const FloatingView = styled.div`
  position: sticky;
  bottom: 10px;
  background: black;
  color: white;
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

const POI = (props) => {
  console.log("poi hotel props are:", props);
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState("50%");
  const dispatch = useDispatch();
  const CallPaymentInfo = useSelector((state) => state.CallPaymentInfo);

  const { drawer, booking_id, idx, city_id } = router.query;
  const { drawer, booking_id, idx, city_id } = router.query;

  useEffect(() => {
    const handleResize = () => {
      setDrawerWidth(window.innerWidth <= 986 ? "100%" : "50%");
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (props.show && booking_id == props?.id) {
      console.log(
        "booking id is:",
        booking_id,
        "props booking id is:",
        props?.id
      );
      fetchDetails();
    }
  }, [props.id, props.show, props.provider]);

  const fetchDetails = () => {
    setLoading(true);
    setError(false);

    if (!props?.mercury) {
      setLoading(true);
      setError(false);
      let check_in = props.check_in;
      let check_out = props.check_out;
      if (props.check_in.includes("/")) {
        check_in = props.check_in.split("/").reverse().join("-");
        check_out = props.check_out.split("/").reverse().join("-");
      }
      let paramsObj = {
        accommodation_id: props.id,
        show_rooms: true,
      };
      if (
        props.currentBooking &&
        props.currentBooking.source &&
        props.currentBooking.source == "Agoda"
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

  const updateBooking = (recommendation_id, rates) => {
    props.setUpdateBookingState(true);
    let stayBookings = props.plan;
    const index = stayBookings.findIndex((item) => item.id == props?.bookingId);
    try {
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
        itinerary_city: props?.itineraryId,
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

          try {
            stayBookings[index] = {
              city_id: props.plan[index].city_id,
              city_name: props.plan[index].city_name,
              ...response?.data,
              source: response?.data?.images?.[0]?.source,
            };
            props.setStayBookings(stayBookings);
            props.openNotification({
              type: "success",
              text: "Hotel added successfully.",
              heading: "Success!",
            });
          } catch (error) {
            const errorMsg =
              error?.response?.data?.errors?.[0]?.message?.[0] || error.message;
            props.openNotification({
              type: "error",
              text:
                errorMsg || "Something went wrong! Please try after some time.",
              heading: "Error!",
            });
            console.error("Error updating stay bookings:", error);
          }
        })
        .catch((err) => {
          props.setUpdateBookingState(false);
          const errorMsg =
            err?.response?.data?.errors?.[0]?.message?.[0] || err.message;
          props.openNotification({
            type: "error",
            text:
              errorMsg || "Something went wrong! Please try after some time.",
            heading: "Error!",
          });
        });
    } catch (error) {
      props.openNotification({
        type: "error",
        text: `${error.response?.data?.errors[0]?.message[0]}`,
        heading: "Error!",
      });
    }
  };

  // ) : (
  //   <ErrorContainer>
  //     Oops! There seems to be a problem, please try again later!
  //   </ErrorContainer>
  // )}
  return (
    <>
      <Container>
        <div>
          {" "}
          {props.mercury ? (
            <>
              <HotelBookingDetails
                showDetails={props?.show}
                BookingButtonFun={() => {
                  props?.handleClickAc(
                    props?.index,
                    props?.booking,
                    props?.city_id
                  );
                }}
                setShowDetails={props.setShowDetails}
                id={props?.id}
                setShowLoginModal={props?.setShowLoginModal}
                onHide={props?.onHide}
              />
            </>
          ) : (
            <>
              {props?.show ? (
                <OverviewParam
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
                  BookingButtonFun={() => {
                    props?.handleClickAc(
                      props?.index,
                      props?.booking,
                      props?.city_id
                    );
                  }}
                  payment={props.payment}
                  updateBooking={updateBooking}
                  bookingId={props?.bookingId}
                  onHide={props.onHide}
                  show={props.show}
                ></OverviewParam>
              ) : null}
            </>
          )}
        </div>

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
      <ToastContainer />
    </>
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
