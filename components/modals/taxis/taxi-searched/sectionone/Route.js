import React, { useState } from "react";
import styled from "styled-components";
import media from "../../../../media";
import ImageLoader from "../../../../ImageLoader";
import SectionFour from "../SectionFour";
import { PulseLoader } from "react-spinners";
import { getIndianPrice } from "../../../../../services/getIndianPrice";
import { axiosTaxiBooking } from "../../../../../services/bookings/UpdateTaxiGozo";
import { useDispatch, useSelector } from "react-redux";
import { openNotification } from "../../../../../store/actions/notification";
import {
  updateAirportTransferBooking,
  updateSingleTransferBooking,
} from "../../../../../store/actions/transferBookingsStore";
import { useGenericAPIModal } from "../../../warning/Index";
import ReactDOM from "react-dom";
import { FaX } from "react-icons/fa6";
import Accordion, {
  AccordionDetails,
  AccordionSummary,
} from "../../../../ui/Accordion";
import { updateFlightBookingWarning } from "../../../../../services/bookings/UpdateBookings";


const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RouteContainer = styled.div`
  display: flex;

  @media screen and (min-width: 768px) {
  }
`;

const Heading = styled.p`
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 0.2rem 0;
  line-height: 1;
`;

const Location = styled.p`
  font-size: 13px;
  font-weight: 400;
  margin: 0;
`;

const IconHeading = styled.p`
  font-size: 13px;
  font-weight: 700;
  margin: 0;
  line-height: 1;
`;

const Text = styled.p`
  font-size: 13px;
  font-weight: 300;
  margin: 0;
  letter-spacing: 1px;
  color: rgba(91, 89, 89, 1);
`;

const ModelText = styled.div`
  font-size: 0.8rem;
  color: #888080;
  font-weight: 300;
  margin: 0 0 0.5rem 0;
`;

const Cost = styled.p`
  font-weight: 800;
  font-size: 1rem;
  line-height: 1;
  margin: 0;

  @media screen and (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const TaxiHeading = styled.p`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 0.2rem 0;
  line-height: 1.2;
`;

const Section = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const itineraryId = useSelector((state) => state.ItineraryId);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [pendingBookingData, setPendingBookingData] = useState(null);
  const [isProcessingWarning, setIsProcessingWarning] = useState(false);
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [open, setOpen] = useState(false);

  const isValidUUID = (uuid) => {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  };

  const handleCancel = () => {
    setIsChecked(false);
    setLoading(false);
    setShowWarningModal(false);
    setWarningMessage("");
    setPendingBookingData(null);
    setIsProcessingWarning(false);
    setIsProcessingBooking(false);

    if (props.onTaxiDeselect) {
      props.onTaxiDeselect();
    }
  };



  const handleUpdate = async () => {

    setIsChecked(true);
    if (props.handleTaxiSelect) {
      props.handleTaxiSelect({
        trace_id: props.data.trace_id,
        result_index: props.data.result_index,
      });
      return;
    }

    setLoading(true);

    if (props?.handleAirportTaxiSelect) {
      await props.handleAirportTaxiSelect(props.data);
      setLoading(false);
      return;
    }

    const requestData = {
      booking_id: props?.booking_id,
      source: props.data.source,
      trace_id: props.data.trace_id,
      result_index: props.data.result_index,
      source_itinerary_city: props?.origin_itinerary_city_id,
      destination_itinerary_city: props?.destination_itinerary_city_id,
      edge: props?.edge,
    };

    setIsProcessingWarning(true);

    try {
      // Call warning API
      const warningResponse = await updateFlightBookingWarning.post(
        `${itineraryId || props.selectedBooking.itinerary_id}/transfers/taxi/warning/`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      );

      if (warningResponse?.data?.show_warning === true) {
        // Show warning modal
        setWarningMessage(warningResponse.data.warning || "Please confirm this action.");
        setPendingBookingData(requestData);
        setShowWarningModal(true);
        setIsProcessingWarning(false);
      } else {
        // Proceed directly with booking
        setIsProcessingWarning(false);
        await handleBookingConfirm(requestData);
      }
    } catch (error) {
      setIsProcessingWarning(false);
      setLoading(false);
      console.error("Warning API failed:", error);

      let errorMsg = "Warning check failed. Please try again.";
      if (error?.response?.data) {
        if (error.response.data.errors?.[0]?.message?.[0]) {
          errorMsg = error.response.data.errors[0].message[0];
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      dispatch(
        openNotification({
          type: "error",
          text: errorMsg,
          heading: "Error!",
        })
      );
      props.setHideBookingModal();
    }
  };

  const handleBookingConfirm = async (requestData) => {
    setIsProcessingBooking(true);

    try {
      const response = await axiosTaxiBooking.post(
        `${itineraryId || props.selectedBooking.itinerary_id}/bookings/taxi/`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setLoading(false);
      setIsProcessingBooking(false);

      dispatch(
        openNotification({
          type: "success",
          text: "Taxi changed successfully.",
          heading: "Success!",
        })
      );

      if (!props?.airportBooking) {
        dispatch(
          updateSingleTransferBooking(
            `${props?.origin_itinerary_city_id}:${props?.destination_itinerary_city_id}`,
            response.data
          )
        );
        trackTransferBookingAdd(itineraryId || props.selectedBooking.itinerary_id,`${props?.origin_itinerary_city_id}:${props?.destination_itinerary_city_id}`,intercity?.[`${props?.origin_itinerary_city_id}:${props?.destination_itinerary_city_id}`],response.data,response.data?.transfer_details?.trips?.[0]?.origin?.address,response.data?.transfer_details?.trips?.[0]?.destination?.address)
      } else {
        dispatch(updateAirportTransferBooking(`${props?.cityId}`, response.data));
        trackTransferBookingAdd(itineraryId || props.selectedBooking.itinerary_id,`${props?.cityId}`,airport?.[`${props?.cityId}`],response.data,response.data?.transfer_details?.trips?.[0]?.origin?.address,response.data?.transfer_details?.trips?.[0]?.destination?.address)
      }

      // props._updateTaxiBookingHandler([response.data]);
      props.getPaymentHandler();
      props.setHideBookingModal();

      if (response.data?.is_refresh_needed) {
        const url = new URL(window.location);
        const drawerParams = ['drawer', 'booking_id', 'flight_modal', 'modal', 'edit'];
        drawerParams.forEach(param => {
          url.searchParams.delete(param);
        });

        window.history.replaceState({}, '', url.toString());
        setTimeout(() => {
          window.location.reload();
        }, 200);
      }

    } catch (error) {
      setLoading(false);
      setIsProcessingBooking(false);
      console.error("Booking API failed:", error);

      const errorMsg = error?.response?.data?.errors?.[0]?.message?.[0] || error.message;
      dispatch(
        openNotification({
          type: "error",
          text: errorMsg || "There seems to be a problem, please try again after some time!",
          heading: "Error!",
        })
      );
      props.setHideBookingModal();
    }
  };

  const handleWarningConfirm = async () => {
    if (pendingBookingData && !isProcessingBooking) {
      setShowWarningModal(false);
      await handleBookingConfirm(pendingBookingData);
      setPendingBookingData(null);
    }
  };

  const handleWarningCancel = () => {
    setIsChecked(false);
    setShowWarningModal(false);
    setWarningMessage("");
    setPendingBookingData(null);
    setLoading(false);
    setIsProcessingWarning(false);
    setIsProcessingBooking(false);

    if (props.onTaxiDeselect) {
      props.onTaxiDeselect();
    }
  };

  let bagCapacity = 0;
  if (props.data?.taxi_category?.bag_capacity)
    bagCapacity += props.data.taxi_category.bag_capacity;


  if (props.data)
    return (
      <div className="flex flex-col rounded-3xl border-sm border-solid border-text-disabled p-md  hover:bg-text-smoothwhite relative mt-md">
        {showWarningModal && ReactDOM.createPortal((
          <div className="fixed z-[1666] inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center">
            <div className="bg-white w-full max-w-lg md:mx-4 mb-0 md:mb-auto md:rounded-lg rounded-t-2xl md:rounded-b-lg relative transform transition-transform duration-300 ease-out animate-slide-up md:animate-none max-h-[90vh] md:max-h-none overflow-hidden">

              <div className="md:hidden flex justify-center py-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>

              {!isProcessingBooking && (
                <button
                  onClick={handleWarningCancel}
                  className="absolute top-4 right-4 md:top-4 md:right-4 p-2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
                >
                  <FaX size={16} />
                </button>
              )}

              <div className="px-6 pb-6 pt-2 md:pt-6 max-h-[calc(90vh-8rem)] md:max-h-none overflow-y-auto">
                <h2 className="text-xl font-semibold mb-1 pr-8">
                  Taxi Update Warning!
                </h2>

                <div className="text-gray-700 mb-6">
                  <div className="rounded-lg p-2">
                    {warningMessage}
                  </div>
                </div>

                <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 justify-end border-t-2 pt-4">
                  <button
                    onClick={handleWarningCancel}
                    disabled={isProcessingBooking}
                    className="w-full md:w-auto px-6 py-2 md:py-2 text-gray-600 border rounded hover:bg-gray-50 transition-colors cursor-pointer text-center disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isProcessingBooking}
                    onClick={handleWarningConfirm}
                    className="w-full md:w-auto px-6 py-2 md:py-2 bg-[#07213A] text-white rounded hover:bg-[#0a2942] transition-colors cursor-pointer text-center disabled:opacity-50"
                  >
                    {isProcessingBooking ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ), document.body)}

        <div className="flex justify-between max-ph:flex-col">
          <div>
            <div className="flex justify-between w-100">
              <span className="text-md font-600 leading-xl ">
                {props.data?.taxi_category?.model_name ? (
                  <>
                    {props.data.taxi_category.model_name}{" "}
                    <>
                      {props.data.taxi_category?.fuel_type ? (
                        `(${props.data.taxi_category.fuel_type})`
                      ) : (
                        <></>
                      )}
                    </>
                  </>
                ) : props.selectedBooking.transfer_type === "Intercity round-trip" ? (
                  "Round-trip Taxi"
                ) : (
                  "One-way Taxi"
                )}
              </span>
            </div>

            {<div className="text-sm font-400 leading-lg-md text-text-spacegrey">{props.data?.taxi_category?.type}</div>}

            <div className="flex flex-row justify-between">
              <div className="flex flex-col ">
                <div className="font-600 text-md-lg leading-xl-sm">
                  {props.data?.taxi_category?.seating_capacity + "-seater"}
                </div>
                <div>
                  <Accordion
                    borderRadius="0.5rem"
                    open={open}
                    setOpen={setOpen}
                    iconStyle={{ right: "unset", left: "75px" }}
                  >
                    <AccordionSummary className="text-blue whitespace-nowrap"
                      style={
                        isPageWide
                          ? { padding: "0.5rem 0" }
                          : { padding: "0.5rem 0" }
                      }
                    >
                      Facilities
                    </AccordionSummary>

                    <AccordionDetails
                      style={!isPageWide ? { marginBottom: "1rem" } : {}}
                    >
                      {props.data?.instructions &&
                        props.data?.instructions?.length ? (
                        <div>
                          {props.data.instructions.map((e, index) => (
                            <div className="text-sm font-400 leading-lg-md text-text-spacegrey"
                              key={index}

                            >
                              - {e}
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {bagCapacity > 0 && (
                        <div>
                          <div className="text-sm font-400 leading-lg-md text-text-spacegrey"
                          >
                            - {bagCapacity} Luggage bags
                          </div>
                        </div>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between items-end max-ph:flex-row max-ph:items-center">
            <div>
              <span className="text-lg font-700 2xl-md">
                {"₹" + getIndianPrice(Math.ceil(props.data.price.total))}
              </span>
            </div>
            <div className="flex items-end justify-center">
              {loading ? (
                <PulseLoader size={8} speedMultiplier={0.6} color="#111" />
              ) : props?.isSelected ? (
                <div className="flex items-center gap-1">
                  <button className="ttw-btn-secondary-fill max-ph:w-full">Selected</button>
                </div>
              ) : (
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={handleUpdate}
                >
                  <button className="ttw-btn-fill-yellow max-ph:w-full">Add to Itinerary</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  else return null;
};

export default Section;
