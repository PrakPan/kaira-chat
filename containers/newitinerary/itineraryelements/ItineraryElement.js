import styled from "styled-components";
import { FaHome } from "react-icons/fa";
import { Link } from "react-scroll";
import {
  TransparentButton,
  newDayContainerTextpadding,
} from "../../itinerary/New_Itenary_DBD/New_itenaryStyled";
import { MdDoneAll } from "react-icons/md";

const padding = {
  initialLeft: "60px",
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  padding: 0px 0px 0px 0px;
  color: #01202b;
`;

export const TInfoContainer = styled.div`
  @media screen and (min-width: 768px) {
    display: flex;
    flex-direction: row;
    & > div {
      padding-left: ${padding.initialLeft};
      width: 100%;
    }
  }
`;

const ItineraryElement = (props) => {
  function getUserSelectedByBookings(id) {
    if (props.booking && props.booking.length && id)
      for (let i = 0; i < props.booking.length; i++) {
        if (props.booking[i].id === id) {
          return props.booking[i].user_selected;
        }
      }
    return null;
  }

  const handleStayButtonClick = () => {
    logEvent({
      action: "Details_View",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: `${
          getUserSelectedByBookings(
            props?.data?.bookings &&
              props?.data?.bookings?.length &&
              props?.data?.bookings[0]?.id
              ? props.data.bookings[0].id
              : null
          )
            ? "Stay Added"
            : "Add Stay"
        }`,
        event_value: props?.heading,
        event_action: "Day by Day Itinerary",
      },
    });
  };

  return (
    <Container className="pt-3">
      <div className="flex flex-row ">
        <div className=" flex justify-center items-center ">
          <div className="w-[6.15rem] grid place-items-center">
            <FaHome className="text-black lg:text-[3.05rem]   text-[1.25rem]" />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: newDayContainerTextpadding.initialLeft,
          }}
        >
          <div className="flex flex-col">
            <div className="text-xl font-normal">{props.heading}</div>

            <Link
              to={
                getUserSelectedByBookings(
                  props?.data?.bookings && props?.data?.bookings.length
                    ? props.data.bookings[0].id
                    : null
                )
                  ? `${props.data.bookings[0].id}`
                  : "Stays"
              }
              offset={-35}
              onClick={handleStayButtonClick}
            >
              {props?.data &&
              props?.data?.bookings &&
              props?.data?.bookings.length ? (
                <>
                  {getUserSelectedByBookings(
                    props?.data?.bookings &&
                      props?.data?.bookings[0] &&
                      props?.data?.bookings[0] &&
                      props?.data?.bookings[0].id
                      ? props.data.bookings[0].id
                      : null
                  ) ? (
                    <TransparentButton>
                      <MdDoneAll
                        style={{
                          display: "inline",
                          marginRight: "0.35rem",
                        }}
                      />{" "}
                      Stay added
                    </TransparentButton>
                  ) : (
                    <TransparentButton>Add Stay</TransparentButton>
                  )}
                </>
              ) : (
                <></>
              )}
            </Link>

            <div>
              <div className="pt-1 line-clamp-3 font-normal text-sm mb-3">
                {props.text ? props.text : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ItineraryElement;
