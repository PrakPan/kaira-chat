import styled from "styled-components";
import { useState, useEffect } from "react";
// import Pin from './Pin';
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { TransportIconFetcher } from "../../../../helper/TransportIconFetcher";
import ImageLoader from "../../../../components/ImageLoader";
import { MdEdit } from "react-icons/md";
import TransferEditDrawer from "../../../../components/drawers/routeTransfer/TransferEditDrawer";
import routeAlternates from "../../../../services/itinerary/brief/routeAlternates";

const Container = styled.div`
  display: grid;
  grid-template-columns: 30px auto;
  min-height: 5rem;
  @media screen and (min-width: 768px) {
    min-height: ${(props) => (props.hidemidsection ? "4.5rem" : "8rem")};
  }
`;
// const Heading = styled.div`
//     font-weight: 600;
//     margin: 0 0 0 0.75rem;
//     line-height: 24px;
//     display: flex;
//     align-items: center;
// `;
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
  const [alternateRoutes, setAlternateRoutes] = useState([]);
  const [loadingAlternates, setLoadingAlternates] = useState(true);
  const [alternatesError, setAlternatesError] = useState(null);
  const [addOrEdit, setAddOrEdit] = useState(null);

  let hidemidsection = props.hidemidsection;
  if (props?.route && props?.route?.modes && props?.route?.modes.length)
    hidemidsection = false;
  else if (props?.bookings && props?.bookings.length) hidemidsection = false;
  else if (props?.route && props?.route?.transfers) hidemidsection = false;
  else hidemidsection = true;

  const handleTransferEdit = (e) => {
    setShowDrawer(true);
    setAddOrEdit(e.target.id);
    routeAlternates
      .get(`/?route_id=` + props?.route?.transfers?.id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data.transfers.length > 0) {
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
        if (err.response.status === 404) {
          setAlternatesError(
            "No route found, please get in touch with us to complete this booking!"
          );
        } else {
          setAlternatesError("There seems to be problem, please try again!");
        }
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
            (!props.bookings || props.bookings.length === 0) ? (
              <Text>
                {" "}
                <button
                  id="transferAdd"
                  onClick={handleTransferEdit}
                  className="text-blue-500 hover:underline"
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

                {!props?.plan?.round_trip_taxi_added &&
                  ((props.route?.modes && props.route?.modes?.length) ||
                    (props?.bookings && props?.bookings?.length)) && (
                    <div
                      id="transferEdit"
                      onClick={handleTransferEdit}
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
        itinerary_id={props?.itinerary_id}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        selectedTransferHeading={props?.route?.heading}
        origin={props.originCity}
        destination={props.destinationCity}
        alternateRoutes={alternateRoutes}
        loadingAlternates={loadingAlternates}
        alternatesError={alternatesError}
        day_slab_index={props?.route?.element_location?.day_slab_index}
        element_index={props?.route?.element_index}
        fetchData={props?.fetchData}
        getPaymentHandler={props?.getPaymentHandler}
        payment={props?.payment}
        setShowLoginModal={props?.setShowLoginModal}
        check_in={props?.route?.check_in}
        _GetInTouch={props._GetInTouch}
      />
    </Container>
  );
};

export default MidSection;
