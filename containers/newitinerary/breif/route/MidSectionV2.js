import styled from "styled-components";
import { useState } from "react";
import { TransportIconFetcher } from "../../../../helper/TransportIconFetcher";
import { MdEdit } from "react-icons/md";
import TransferEditDrawer from "../../../../components/drawers/routeTransfer/TransferEditDrawer";
import { logEvent } from "../../../../services/ga/Index";
import { connect, useSelector } from "react-redux";
import TaxiModal from "../../../../components/modals/taxis/Index";
import FlightModal from "../../../../components/modals/flights/Index";
import { useEffect } from "react";
import TransferSkeleton from "../../../../components/itinerary/Skeleton/TransferSkeleton";
import { HiOutlineRefresh } from "react-icons/hi";
import { useRouter } from "next/router";

const Container = styled.div`
  display: grid;
  grid-template-columns: 30px auto;
  min-height: 5rem;
  width: fit-content;
  padding-top: 0.3rem;
  padding-bottom: 1.3rem;
  @media screen and (min-width: 768px) {
    min-height: ${(props) => (props.hidemidsection ? "4.5rem" : "8rem")};
  }
`;

const Line2 = styled.hr`
  background-image:
    linear-gradient(90deg, transparent 50%, #fff 60%, #fff 100%),
    ${(props) =>
      props.pinColour
        ? `linear-gradient(87deg, ${props.pinColour},${props.pinColour}, #000)`
        : `linear-gradient(87deg,  #f7e700,#0d6efd)`};

  background-size:
    12px 3px,
    100% 3px;
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
    width: 8rem;
    height: 1.7px;
    top: 46px;
    right: -46px;
  }
`;

const Line = styled.hr`
  background-image:
    linear-gradient(90deg, transparent 50%, #fff 60%, #fff 100%),
    ${(props) =>
      props.pinColour
        ? `linear-gradient(87deg, ${props.pinColour},${props.pinColour}, #000)`
        : `linear-gradient(87deg,  #f7e700,#0d6efd)`};

  background-size:
    8px 3px,
    100% 3px;

  color: #c80000;
  -webkit-transform: rotate(90deg);
  position: absolute;

  height: 1px;

  border: 2px;

  width: ${(props) => (props.Transfers ? `19rem` : `9rem`)};

  top: ${(props) => (props.Transfers ? `128px` : `23px`)};
  right: ${(props) => (props.Transfers ? `-134px` : `-55px`)};
  opacity: initial;
  z-index: -1;
  @media screen and (min-width: 768px) {
    width: 8.3rem;
    height: 1px;
    top: 34px;
    right: -49px;
  }
`;

const Text = styled.div`
  color: #4d4d4d;
  font-style: normal;
  font-weight: 300;
  font-size: 18px;
  line-height: 3.5rem;
  display: flex;
  align-items: center;
  margin: 1.5rem;
`;

const MidSectionV2 = (props) => {
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState(
    props.Bookings
      ? props?.bookings[0]
      : {
          id: null,
          name: null,
        }
  );
  const { transfers_status } = useSelector((state) => state.ItineraryStatus);
  const isPageWide = window.matchMedia("(min-width: 768px)")?.matches;

  const handleAddTransfer = () => {
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: "editTransfer",
          bookingId: props?.cityTransferBookings?.id,
          oItineraryCity:
            props?.oCityData?.id || props?.oCityData?.gmaps_place_id,
          dItineraryCity:
            props?.dCityData?.id ||
            props?.dCityData?.gmaps_place_id ||
            props?.dCityData?.gmaps_place_id,
        },
      },
      undefined,
      {
        scroll: false,
      }
    );
  };

  useEffect(() => {
    if (props.cityTransferBookings && props.flightBookings) {
      let booking = null;
      if (props.bookings) {
        const allBookings = [
          ...props.flightBookings,
          ...props.cityTransferBookings,
        ];

        booking = allBookings.find(
          (book) => book.id === props?.bookings[0]?.id
        );
      }
      if (booking) {
        setSelectedBooking({
          ...selectedBooking,
          name: booking["name"],
          costings_breakdown: booking["transfer_details"],
          cost: booking["price"],
          itinerary_id: booking["itinerary_id"],
          itinerary_name: booking["itinerary_name"],
          tailored_id: booking["tailored_itinerary"],
          id: booking["id"],
          check_in: booking["check_in"],
          check_out: booking["check_out"],
          pax: {
            number_of_adults: booking["number_of_adults"],
            number_of_children: booking["number_of_children"],
            number_of_infants: booking["number_of_infants"],
          },
          city: booking["city"],
          taxi_type: booking["taxi_type"],
          transfer_type: booking["transfer_type"],
          // destination_city: booking["destination_address"]["shortName"] ? booking["destination_address"]["shortName"] : null,
          destination_city: booking?.destination_address?.shortName
            ? booking["destination_address"]["shortName"]
            : null,
          origin_iata: booking["origin_city_iata_code"],
          destination_iata: booking["destination_city_iata_code"],
          origin: booking["source_address"],
          destination: booking["destination_address"],
        });
      }
    }
  }, [props.flightBookings, props.cityTransferBookings]);

  let hidemidsection = props.hidemidsection;
  if (props?.route && props?.route?.modes && props?.route?.modes.length)
    hidemidsection = false;
  else if (props?.bookings && props?.bookings.length) hidemidsection = false;
  else if (props?.route && props?.route?.transfers) hidemidsection = false;
  else hidemidsection = true;

  const [isHovered, setIsHovered] = useState(false);
  const popupStyle = {
    display: isHovered ? "block" : "none",
    backgroundColor: "#2b2b2a",
    border: "1px solid #e5e7eb",
    borderRadius: "0.45rem",
    padding: "5px 10px",
    marginTop: "5px",
    marginLeft: "5px",
  };

  return (
    <Container className={``} hidemidsection={hidemidsection}>
      <div style={{ position: "relative" }}>
        <Line pinColour={props.pinColour} hidemidsection={hidemidsection} />
      </div>

      {hidemidsection &&
        (transfers_status === "PENDING" ? (
          <TransferSkeleton />
        ) : (
          <>
            {props.version == "v2" ? (
              <Text>
                {props.cityTransferBookings &&
                props.cityTransferBookings?.id ? (
                  <></>
                ) : (
                  <button
                    onClick={handleAddTransfer}
                    className="text-[14px] font-[600] leading-[54px] text-blue hover:underline"
                  >
                    + Add Transfer
                  </button>
                )}

                {props.cityTransferBookings && props.cityTransferBookings?.id
                 ? (
                  <div
                    className={`inline-flex items-center gap-2 ${
                      !isPageWide ? "w-max" : ""
                    }`}
                  >
                    <div className="text-base text-[#01202B]">
                      {" "}
                      {props.modes} {props.cityTransferBookings?.duration ? ": " + props.cityTransferBookings?.duration : ''}
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {props.cityTransferBookings && props.cityTransferBookings?.id && (
                    <div
                      id="transferEdit"
                      onClick={(e) => {
                        handleAddTransfer();
                        setIsHovered(false);
                      }}
                      className="cursor-pointer min-w-max text-lg w-4 h-4 pl-3 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90 relative"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <HiOutlineRefresh className="transition-transform text-blue" />
                      <div
                        style={popupStyle}
                        className="z-50 absolute -bottom-140 left-1/2 -translate-x-1/2 text-sm text-center flex flex-col gap-2 bg-[#2b2b2a]"
                      >
                        <div className="relative">
                          <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-0 h-0 border-[10px] border-solid border-transparent border-b-red"></span>
                          <span className="absolute -top-[21px] left-1/2 -translate-x-1/2 w-0 h-0 border-[10px] border-solid border-transparent border-b-[#2b2b2a]"></span>

                          <div className="text-nowrap font-normal text-white text-sm">
                            Change
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </Text>
            ) : (
              <div className="font-normal text-base text-[#01202B]">
                {props.modes ? `${props.modes} :` : null} {props.duration}
              </div>
            )}
          </>
        ))}

    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    ItineraryId: state.ItineraryId,
    flightBookings: state.Bookings.flightBookings,
    _bookings: state.Bookings,
  };
};

export default connect(mapStateToPros)(MidSectionV2);
