import styled from "styled-components";
import { useState } from "react";
import { TransportIconFetcher } from "../../../../helper/TransportIconFetcher";
import { MdEdit } from "react-icons/md";
import TransferEditDrawer from "../../../../components/drawers/routeTransfer/TransferEditDrawer";
import routeAlternates from "../../../../services/itinerary/brief/routeAlternates";
import axiosRoundTripInstance from "../../../../services/itinerary/brief/roundTripSuggestion";
import { logEvent } from "../../../../services/ga/Index";
import { connect } from "react-redux";

const Container = styled.div`
  display: grid;
  grid-template-columns: 30px auto;
  min-height: 5rem;
  @media screen and (min-width: 768px) {
    min-height: ${(props) => (props.hidemidsection ? "4.5rem" : "8rem")};
  }
`;

const Line = styled.hr`
  /* background-image: linear-gradient(90deg,transparent,transparent 20%,#fff 50%,#fff 100%),linear-gradient(87deg,#0d6efd,#00fff0,#d4ff00,#ff7000,#ff0000); */
  background-image: linear-gradient(90deg, transparent 50%, #fff 60%, #fff 100%),
    ${(props) =>
      props.pinColour
        ? `linear-gradient(87deg, ${props.pinColour},${props.pinColour}, #000)`
        : `linear-gradient(87deg,  #f7e700,#0d6efd)`};

  background-size: 12px 3px, 100% 3px;

  color: #c80000;
  -webkit-transform: rotate(90deg);
  position: absolute;
  width: 5rem;
  height: 1.7px;
  top: 23px;
  right: -22px;

  border: 2px;
  opacity: initial;

  @media screen and (min-width: 768px) {
    width: ${(props) => (props.hidemidsection ? "6rem" : "8rem")};
    height: 1.7px;
    top: ${(props) => (props.hidemidsection ? "22px" : "46px")};
    right: ${(props) => (props.hidemidsection ? "-31px" : "-46px")};
  }
  /* border-style: dashed;
  border-width: 1.4px;
  position: absolute;
  left: 50%;


  border-color: ${(props) => (props.pinColour ? props.pinColour : "black")};
  min-height: 10vw;
  height: 100%;
  margin: 0rem 0 0rem 0rem; */
`;

const Text = styled.div`
  color: #4d4d4d;
  font-style: normal;
  font-weight: 300;
  font-size: 18px;
  line-height: 28px;
  display: flex;
  align-items: center;
  margin: 0rem 0 0rem 1rem;
`;

const MidSection = (props) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [alternateRoutes, setAlternateRoutes] = useState({});
  const [roundTripSuggestions, setRoundTripSuggestions] = useState(null);
  const [multiCitySuggestions, setMultiCitySuggestions] = useState(null);
  const [loadingAlternates, setLoadingAlternates] = useState(true);
  const [alternatesError, setAlternatesError] = useState(null);
  const [addOrEdit, setAddOrEdit] = useState(null);

  let hidemidsection = props.hidemidsection;
  if (props?.route && props?.route?.modes && props?.route?.modes.length)
    hidemidsection = false;
  else if (props?.bookings && props?.bookings.length) hidemidsection = false;
  else if (props?.route && props?.route?.transfers) hidemidsection = false;
  else hidemidsection = true;

  const roundTripSuggestion = () => {
    setLoadingAlternates(true);
    axiosRoundTripInstance
      .get(`?itinerary_id=${props?.ItineraryId}`)
      .then((response) => {
        const results = response.data;

        for (let i = 0; i < results.length; i++) {
          if (
            results[i].success &&
            results[i].transfer_type === "Intercity round-trip"
          ) {
            setRoundTripSuggestions(results[i]);
          } else if (
            results[i].success &&
            results[i].transfer_type === "Multicity"
          ) {
            setMultiCitySuggestions(results[i]);
          }
        }
        setLoadingAlternates(false);
      })
      .catch((err) => {
        console.log("[ERROR][TransferEdit]: ", err);
        setLoadingAlternates(false);
      });
  };

  const handleTransferEdit = (e, label) => {
    setShowDrawer(true);
    setAddOrEdit(e.target.id);
    roundTripSuggestion();
    routeAlternates
      .get(
        `/?route_id=${props?.route?.transfers?.id}&pax=${
          props?.plan?.number_of_adults + props?.plan?.number_of_children
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 200 && response.data.routes.length > 0) {
          const data = response.data;
          setAlternateRoutes(data);
        } else {
          setAlternatesError(
            "No route found, please get in touch with us to complete this booking!"
          );
        }
        setLoadingAlternates(false);
      })
      .catch((err) => {
        setLoadingAlternates(false);
        setAlternatesError(
          "No route found, please get in touch with us to complete this booking!"
        );
      });

    logEvent({
      action: "Transfer_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: label,
        event_action: "Route",
      },
    });
  };

  return (
    <Container className="font-lexend" hidemidsection={hidemidsection}>
      <div style={{ position: "relative" }}>
        <Line pinColour={props.pinColour} hidemidsection={hidemidsection} />
      </div>
      {!hidemidsection && (
        <>
          {props.version == "v2" ? (
            props.route?.transfers &&
            props.route?.transfers?.id &&
            props.route?.transfers?.id !== "" &&
            (!props.bookings || props.bookings.length === 0) ? (
              <Text>
                {" "}
                <button
                  id="transferAdd"
                  onClick={(e) => handleTransferEdit(e, "Add Transfer")}
                  className="text-blue hover:underline"
                >
                  + Add Transfer
                </button>{" "}
              </Text>
            ) : (
              <Text>
                {props.route?.modes && props.route?.modes.length ? (
                  <TransportIconFetcher
                    TransportMode={props.route?.modes[0]}
                    Instyle={{
                      fontSize:
                        props.route?.modes[0] === "Bus" ? "1.2rem" : "1.4rem",
                      marginRight: "0.8rem",
                      color: "#4d4d4d",
                    }}
                  />
                ) : props.bookings &&
                  props.bookings.length &&
                  props.bookings[0].booking_type ? (
                  <TransportIconFetcher
                    TransportMode={props.bookings[0].booking_type}
                    Instyle={{
                      fontSize:
                        props.bookings[0].booking_type === "Bus"
                          ? "1.2rem"
                          : "1.4rem",

                      marginRight: "0.8rem",
                      color: "#4d4d4d",
                    }}
                  />
                ) : (
                  <></>
                )}

                {props.bookings && props.bookings.length ? (
                  props?.bookings?.map((element, index) => (
                    <div className="flex flex-row" key={index}>
                      <div className="flex flex-row pr-0">
                        {element.booking_type}
                        {index !== props?.bookings.length - 1 && (
                          <span className="pr-2">,</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : props.route &&
                  props.route.modes &&
                  props.route.modes.length ? (
                  props.route.modes.map((element, index) => (
                    <div className="flex flex-row" key={index}>
                      <div className="flex flex-row pr-0">
                        {element}
                        {index !== props.route.modes.length - 1 && (
                          <span className="pr-2">,</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <></>
                )}

                {props.route?.modes &&
                props.route?.modes.length &&
                props.duration ? (
                  <div className="inline-flex items-center gap-2">
                    <div>: {props.duration}</div>
                  </div>
                ) : (
                  <></>
                )}

                {props?.route?.transfers &&
                  props?.route?.transfers?.id &&
                  props?.route?.transfers?.id !== "" &&
                  !props?.plan?.round_trip_taxi_added &&
                  ((props?.route?.modes && props?.route?.modes?.length) ||
                    (props?.bookings && props?.bookings?.length)) && (
                    <div
                      id="transferEdit"
                      onClick={(e) => handleTransferEdit(e, "Edit Transfer")}
                      className="cursor-pointer min-w-max text-lg w-4 h-4 pl-3 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90"
                    >
                      <MdEdit className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500" />
                    </div>
                  )}
              </Text>
            )
          ) : (
            <Text>
              {props.modes && (
                <TransportIconFetcher
                  TransportMode={props.modes}
                  Instyle={{
                    fontSize: props.modes === "Bus" ? "1.2rem" : "1.4rem",
                    marginRight: "0.8rem",
                    color: "#4d4d4d",
                  }}
                />
              )}
              {props.modes ? `${props.modes} :` : null} {props.duration}
            </Text>
          )}
        </>
      )}

      <TransferEditDrawer
        addOrEdit={addOrEdit}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        selectedTransferHeading={props?.route?.heading}
        origin={props.originCity}
        destination={props.destinationCity}
        alternateRoutes={alternateRoutes}
        roundTripSuggestions={roundTripSuggestions}
        multiCitySuggestions={multiCitySuggestions}
        loadingAlternates={loadingAlternates}
        alternatesError={alternatesError}
        day_slab_index={props?.route?.element_location?.day_slab_index}
        element_index={props?.route?.element_index}
        fetchData={props?.fetchData}
        setShowLoginModal={props?.setShowLoginModal}
        check_in={props?.route?.check_in}
        _GetInTouch={props._GetInTouch}
      />
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    ItineraryId: state.ItineraryId,
  };
};

export default connect(mapStateToPros)(MidSection);
