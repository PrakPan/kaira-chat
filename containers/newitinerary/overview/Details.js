import styled from "styled-components";
import { format, parseISO } from "date-fns";
import { MdModeEdit } from "react-icons/md";
import useMediaQuery from "../../../components/media";
import { connect, useDispatch } from "react-redux";
import { logEvent } from "../../../services/ga/Index";
import UpdateItineraryDates from "../../itinerary/booking1/UpdateItineraryDates";
import setItineraryStatus from "../../../store/actions/itineraryStatus";
import { axiosGetItineraryStatus } from "../../../services/itinerary/daybyday/preview";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaPen } from "react-icons/fa";
import { useChatContext } from "../../../components/Chatbot/context/ChatContext";

const Container = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  max-width: 100vw;
  overflow-x: auto;
  white-space: nowrap;
  align-items: start;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  @media screen and (min-width: 768px) {
    grid-template-columns: max-content max-content max-content max-content max-content max-content;
  }
`;

const Heading = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  margin-bottom: 4px;
  color: #6e757a;
`;

const Text = styled.p`
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px;
  margin: 0;
`;

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: max-content;
  min-width: max-content;
`;

const DateRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  flex-wrap: nowrap;
  font-size: 14px;
  font-weight: 600;
`;

const convertDFormat = (dt) => {
  if (dt) {
    const date = parseISO(dt);
    const formattedDate = format(date, "MMM dd, yyyy");
    return formattedDate;
  }
  return "";
};

const Details = (props) => {
  // console.log("profil",props?.itinerary)
  // console.log("profil",props?.itinerary)
  const isDesktop = useMediaQuery("(min-width:768px)");
  const router = useRouter();
  const dispatch = useDispatch();
  const [showEditDate, setShowEditDate] = useState(false);
  const { resetSession } = useChatContext();

  function handleEditDates() {
    props.setEditRoute("editDates");

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Edit Dates",
        event_action: "Edit Route Dates",
      },
    });

    if (props.handleEditRouteClick) {
      props.handleEditRouteClick();
    }
  }

  // const fetchItineraryStatus = async (itineraryId = router.query.id) => {
  //   console.log("I'm inside Details")
  //     try {
  //       const res = await axiosGetItineraryStatus.get(`/${itineraryId}/status/`);
  //       const status = res.data?.celery;
  //       dispatch(
  //         setItineraryStatus("pricing_status", status?.PRICING || "PENDING")
  //       );
  //       dispatch(
  //         setItineraryStatus("transfers_status", status?.TRANSFERS || "PENDING")
  //       );
  //       dispatch(
  //         setItineraryStatus("hotels_status", status?.HOTELS || "PENDING")
  //       );
  //       dispatch(
  //         setItineraryStatus("itinerary_status", status?.ITINERARY || "PENDING")
  //       );
  //       fetchItinerary();
  //     } catch (err) {
  //       console.error("[ERROR]: axiosGetItineraryStatus: ", err.message);
  //     }
  //   };

  const fetchItinerary = async () => {
    try {
      if (props?.resetRef) {
        await props.resetRef();
      }

      if (props.fetchData) {
        await props.fetchData(true);
      }

      if (resetSession) {
        await resetSession();
      }
    } catch (error) {
      console.error("Error in fetchItinerary:", error);
    }
  };

  return (
    <Container>
      {props?.group_type !== null ? (
        <div className="pr-[24px]" style={{ width: "max-content" }}>
          <Heading>Traveller Type</Heading>
          <Text className="flex flex-row gap-2">
            {props.group_type}
            {props.number_of_adults ||
            props.number_of_children ||
            props.number_of_infants ? (
              <span>
                (
                {props.number_of_adults
                  ? props.number_of_adults > 1
                    ? props.number_of_adults + " Adults"
                    : props.number_of_adults + " Adult"
                  : null}
                {props.number_of_children
                  ? `, ${props.number_of_children} Children`
                  : null}
                {props.number_of_infants
                  ? props.number_of_infants > 1
                    ? `, ${props.number_of_infants} Infants`
                    : `, ${props.number_of_infants} Infant`
                  : null}
                )
              </span>
            ) : null}
          </Text>
        </div>
      ) : null}

      {props?.budget ? (
        <div
          className="pr-[24px] pl-[24px] border-l  min-h-full"
          style={{ width: "max-content" }}
        >
          <Heading>Budget</Heading>
          <Text>{props.budget}</Text>
        </div>
      ) : null}

      {props.travellerType != null ? (
        <div className="border-l min-h-full pl-[24px] pr-[24px]">
          <DateContainer>
            {props.tripsPage || props?.v1 ? (
              <div>
                <Heading className="flex flex-row gap-2 items-center md:overflow-visible">
                  Dates
                </Heading>
                <Text>{props.duration}</Text>
              </div>
            ) : (
              <div>
                <Heading className="flex flex-row gap-2 items-center">
                  Date of Travelling
                </Heading>
                <DateRow>
                  <UpdateItineraryDates
                    itinerary={props?.itinerary}
                    token={props.token}
                    onUpdateSuccess={fetchItinerary}
                    convertDFormat={convertDFormat}
                    tripsPage={false}
                    setShowEditDate={setShowEditDate}
                    showEditDate={showEditDate}
                    duration={props?.duration}
                    resetRef={props?.resetRef}
                  />
                </DateRow>
              </div>
            )}
          </DateContainer>
        </div>
      ) : null}
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    routes: state.ItineraryRoutes,
    plan: state.Plan,
    tripsPage: state.TripsPage,
  };
};

export default connect(mapStateToPros)(Details);
