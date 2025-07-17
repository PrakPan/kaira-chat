import styled from "styled-components";
import { format, parseISO } from "date-fns";
import { MdModeEdit } from "react-icons/md";
import useMediaQuery from "../../../components/media";
import { connect } from "react-redux";
import { logEvent } from "../../../services/ga/Index";
import UpdateItineraryDates from "../../itinerary/booking1/UpdateItineraryDates";
import setItineraryStatus from "../../../store/actions/itineraryStatus";
import { axiosGetItineraryStatus } from "../../../services/itinerary/daybyday/preview";
import { useRouter } from "next/router";
import { useState } from "react";

const Container = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  max-width: 100vw;
  overflow-x: auto;
  grid-gap: 1rem;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  @media screen and (min-width: 768px) {
    grid-template-columns: max-content max-content max-content max-content max-content max-content;
    grid-column-gap: 2.5rem;
  }
`;

const Heading = styled.p`
  font-size: 15px;
  font-weight: 400;
  color: #7a7a7a;
  margin: 0;
`;

const Text = styled.p`
  font-size: 15px;
  font-weight: 500;
  margin: 0;
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
  const isDesktop = useMediaQuery("(min-width:768px)");
  const router = useRouter();
  const [showEditDate,setShowEditDate] = useState(false)

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
  }

    const fetchItineraryStatus = async (itineraryId = router.query.id) => {
        try {
          const res = await axiosGetItineraryStatus.get(`/${itineraryId}/status/`);
          const status = res.data?.celery;
          dispatch(
            setItineraryStatus("pricing_status", status?.PRICING || "PENDING")
          );
          dispatch(
            setItineraryStatus("transfers_status", status?.TRANSFERS || "PENDING")
          );
          dispatch(
            setItineraryStatus("hotels_status", status?.HOTELS || "PENDING")
          );
          dispatch(
            setItineraryStatus("itinerary_status", status?.ITINERARY || "PENDING")
          );
          fetchItinerary();
        } catch (err) {
          console.error("[ERROR]: axiosGetItineraryStatus: ", err.message);
        }
      };
    
      const fetchItinerary = async () => {
        props?.resetRef();
        // setWaitingForStatusUpdate(true);
        props.fetchData(true);
      };
  

  return (
    <Container className="font-lexend">
      {props?.group_type !== null ? (
        <div style={{ width: "max-content" }}>
          <Heading>Group Type</Heading>
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
        <div style={{ width: "max-content" }}>
          <Heading>Budget</Heading>
          <Text>{props.budget}</Text>
        </div>
      ) : null}

      {props.travellerType != null ? (
        <div
          style={{ width: "max-content" }}
          className="flex flex-row items-center gap-4"
        >
          {props.tripsPage ? (
            <div>
              <Heading className="flex flex-row gap-2 items-center">
                Dates
              </Heading>
              <Text>{props.duration}</Text>
            </div>
          ) : (
             <div>
              <Heading className="flex flex-row gap-2 items-center">
                Dates ({props.duration})
              </Heading>
              {props.start_date && (
                <Text>
                  {convertDFormat(props.start_date)} -{" "}
                  {convertDFormat(props.end_date)}
                </Text>
              )}
            </div>
          )}

          {/* {(!props.plan?.is_released_for_customer &&
          props.plan?.itinerary_status !== "ITINERARY_PREPARED" &&
          props?.routes &&
          props.routes.length > 0) || props?.mercuryItinerary ? (
            isDesktop ? (
              <button
                onClick={handleEditDates}
                className="text-sm border-2 border-black rounded-lg px-4 py-2 hover:bg-black hover:text-white transition ease-in-out duration-500"
              >
                Edit Dates
              </button>
            ) : (
              <MdModeEdit
                onClick={handleEditDates}
                className="text-lg cursor-pointer hover:text-yellow-400"
              />
            )
          ) : null} */}
        </div>
      ) : null}
       
       {/* <div style={{ position: "relative", overflow: "visible", zIndex: 1500 }}>

       {showEditDate && <UpdateItineraryDates
                 itinerary={props?.itinerary}
        token={props.token}
        onUpdateSuccess={fetchItineraryStatus}
        convertDFormat={convertDFormat}
        tripsPage={false}
        setShowEditDate={setShowEditDate}
      />}

      </div>
      <div>
        <button
            onClick={()=>{setShowEditDate(true);}}
            className="font-semibold text-sm px-4 py-2 border-2 border-black rounded-lg hover:text-white hover:bg-black transform ease-in-out duration-300"
          >
            Edit Dates
          </button>
      </div> */}
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
