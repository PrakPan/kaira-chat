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
      } else {
        dispatch(updateAirportTransferBooking(`${props?.cityId}`, response.data));
      }

      props._updateTaxiBookingHandler([response.data]);
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



  if (props.data)
    return (
      <Container>
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
        <TaxiHeading>
          {/* <Heading> */}
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
          {/* </Heading> */}

          <div>
            <Cost>
              {"₹" + getIndianPrice(Math.ceil(props.data.price.total)) + "/-"}
            </Cost>
          </div>
        </TaxiHeading>

        {<ModelText>{props.data?.taxi_category?.type}</ModelText>}

        <div className="flex justify-between">
          <SectionFour
            setHideBookingModal={props.setHideBookingModal}
            _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
            getPaymentHandler={props.getPaymentHandler}
            selectedBooking={props.selectedBooking}
            _updateSearchedTaxi={props._updateSearchedTaxi}
            data={props.data}
            setShowTaxiModal={props.setShowTaxiModal}
          ></SectionFour>

          <div className="p-[0.4rem] flex items-center justify-center">
            {!loading || !props?.bookingLoad ? (
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
              >

                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleUpdate();
                    } else {
                      handleCancel();
                    }
                  }}
                  checked={props?.isSelected || isChecked || false}
                  disabled={loading || props?.bookingLoad}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                {/* <img
                  src={
                    props?.isSelected
                      ? "/media/icons/bookings/tick-square-blue.svg"
                      : "/media/icons/bookings/tick-square.svg"
                  }
                  alt="Select"
                  style={{ width: "1.25rem", height: "1.25rem" }}
                /> */}
                {/* <span className="font-lexend" style={{ fontSize: "14px" }}>
        Select
      </span> */}
              </label>
            ) : (
              <PulseLoader size={8} speedMultiplier={0.6} color="#111" />
            )}
          </div>
        </div>
        <hr />
      </Container>
    );
  else return null;
};

export default Section;
