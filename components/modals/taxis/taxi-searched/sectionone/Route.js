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
   const { openModal, ModalComponent } = useGenericAPIModalIModal();

  const isValidUUID = (uuid) => {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  };
  const handleUpdate = async () => {
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


     const warningApiCall = (data) => {
          return updateFlightBookingWarning.post(`${itineraryId || props.selectedBooking.itinerary_id}/transfers/taxi/warning/`, data, {
            headers: {
              Authorization: `Bearer ${props.token}`,
            },
          });
        };
    
        // Define the booking API call
        const bookingApiCall = (data) => {
          return axiosTaxiBooking
      .post(
        `${itineraryId || props.selectedBooking.itinerary_id}/bookings/taxi/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
        };
    
        // Define success handler
        const handleSuccess = (responseData, message) => {
         
          setLoading(false);
        dispatch(
          openNotification({
            type: "success",
            text: "Taxi changed successfully.",
            heading: "Sucess!",
          })
        );
        if (!props?.airportBooking) {
          dispatch(
            updateSingleTransferBooking(
              `${props?.origin_itinerary_city_id}:${props?.destination_itinerary_city_id}`,
              responseData
            )
          );
        } else {
          dispatch(updateAirportTransferBooking(`${props?.cityId}`, responseData));
        }
        props._updateTaxiBookingHandler([responseData]);
        props.getPaymentHandler();
        props.setHideBookingModal();
      
        };
    
        // Define error handler
        const handleError = (errorMessage) => {
           setLoading(false);
        const errorMsg =
          err?.response?.data?.errors?.[0]?.message?.[0] || err.message;
        dispatch(
          openNotification({
            type: "error",
            text:
              errorMsg ||
              "There seems to be a problem, please try again after some time!",
            heading: "Error!",
          })
        );
        props.setHideBookingModal();
        };
    
        // Open the modal with configuration
        openModal({
          title: "Update Taxi Booking",
          message: "Are you sure you want to update this Taxi booking?",
          warningApiCall,
          bookingApiCall,
          requestData,
          onSuccess: handleSuccess,
          onError: handleError,
          successMessage: "Taxi updated successfully.",
          loadingMessage: "Please wait while we update your flight...",
        });

    // axiosTaxiBooking
    //   .post(
    //     `${itineraryId || props.selectedBooking.itinerary_id}/bookings/taxi/`,
    //     requestData,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     setLoading(false);
    //     dispatch(
    //       openNotification({
    //         type: "success",
    //         text: "Taxi changed successfully.",
    //         heading: "Sucess!",
    //       })
    //     );
    //     if (!props?.airportBooking) {
    //       dispatch(
    //         updateSingleTransferBooking(
    //           `${props?.origin_itinerary_city_id}:${props?.destination_itinerary_city_id}`,
    //           res.data
    //         )
    //       );
    //     } else {
    //       dispatch(updateAirportTransferBooking(`${props?.cityId}`, res.data));
    //     }
    //     props._updateTaxiBookingHandler([res.data]);
    //     props.getPaymentHandler();
    //     props.setHideBookingModal();
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     const errorMsg =
    //       err?.response?.data?.errors?.[0]?.message?.[0] || err.message;
    //     dispatch(
    //       openNotification({
    //         type: "error",
    //         text:
    //           errorMsg ||
    //           "There seems to be a problem, please try again after some time!",
    //         heading: "Error!",
    //       })
    //     );
    //     props.setHideBookingModal();
    //   });
  };

  if (props.data)
    return (
      <Container>
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
                    if (e.target.checked) handleUpdate();
                  }}
                  style={{ width: "1.25rem", height: "1.25rem" }}
                />
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
