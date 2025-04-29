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
import { updateSingleTransferBooking } from "../../../../../store/actions/transferBookingsStore";

const Container = styled.div`
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  max-width: 100%;
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

const Section = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const itineraryId = useSelector((state) => state.ItineraryId);

  const isValidUUID = (uuid) => {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  };
  const handleUpdate = () => {
    if (props.handleTaxiSelect) {
      props.handleTaxiSelect({
        trace_id: props.data.trace_id,
        result_index: props.data.result_index,
      });
      return;
    }

    setLoading(true);


    const requestData = {
      source: props.data.source,
      trace_id: props.data.trace_id,
      result_index: props.data.result_index,
      source_itinerary_city:isValidUUID(props?.origin_itinerary_city_id) ? props?.origin_itinerary_city_id : null,
      destination_itinerary_city: isValidUUID(props?.destination_itinerary_city_id) ? props?.destination_itinerary_city_id : null
    };

    axiosTaxiBooking
      .post(
        `${itineraryId || props.selectedBooking.itinerary_id}/bookings/taxi/`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        dispatch(
          openNotification({
            type: "success",
            text: "Taxi changed successfully.",
            heading: "Sucess!",
          })
        );
        dispatch(
                updateSingleTransferBooking(
                  `${props?.origin_itinerary_city_id}:${props?.destination_itinerary_city_id}`,
                  res.data
                )
              );
        props._updateTaxiBookingHandler([res.data]);
        props.getPaymentHandler();
        props.setHideBookingModal();
      })
      .catch((err) => {
        setLoading(false);
        console.log("Error Changing Taxi", err.message);
        dispatch(
          openNotification({
            type: "error",
            text: "There seems to be a problem, please try again after some time!",
            heading: "Error!",
          })
        );
        props.setHideBookingModal();
      });
  };

  if (props.data)
    return (
      <Container>
        <Heading>
          {props.data?.taxi_category?.type ? (
            <>
              {props.data.taxi_category.type}{" "}
              <>
                {props.data.taxi_category?.fuel_type && isPageWide ? (
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
        </Heading>

        {isPageWide && (
          <ModelText>{props.data?.taxi_category?.model_name}</ModelText>
        )}
        {/* <RouteContainer className="font-lexend">
          <Location className="font-lexend">
            {props.selectedBooking.city}
          </Location>
          <div style={{ margin: "0 2px" }}>
            <ImageLoader
              url="media/icons/bookings/next.png"
              leftalign
              dimensions={{ width: 200, height: 200 }}
              width="1.25rem"
              widthmobile="1.25rem"
              noLazy
            ></ImageLoader>
          </div>
          <Location className="font-lexend">
            {props.selectedBooking.destination_city}
          </Location>
        </RouteContainer> */}

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "0.75rem",
            marginTop: "0.75rem",
          }}
        >
          <ImageLoader
            url="media/icons/bookings/distance.png"
            height="1.5rem"
            width="1.5rem"
            widthmobile="1.5rem"
            dimensions={{ width: 100, height: 100 }}
            margin="0"
            leftalign
            noLazy
          ></ImageLoader>

          <div
            style={{ display: "flex", gap: "1rem" }}
            className="flex flex-row justify-between w-full"
          >
            <div className="flex flex-row gap-[1rem]">
              {props.data?.distance?.text ? (
                <div>
                  <IconHeading className="font-lexend">
                    {props.data.distance.text}
                  </IconHeading>
                  <Text className="font-nunito">Included</Text>
                </div>
              ) : null}

              {props.data?.duration?.text ? (
                <div>
                  <IconHeading className="font-lexend">
                    {props.data.duration.text}
                  </IconHeading>
                  <Text className="font-nunito">Included</Text>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <div className="center-div" style={{ marginRight: "0.5rem" }}>
                <Cost>
                  {"₹" +
                    getIndianPrice(Math.ceil(props.data.price.total)) +
                    "/-"}
                </Cost>
              </div>

              <div>
                {loading ? (
                  <PulseLoader size={8} speedMultiplier={0.6} color="#111" />
                ) : (
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent:"center",
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
                )}
              </div>
            </div>
          </div>
        </div>

        <SectionFour
          setHideBookingModal={props.setHideBookingModal}
          _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
          getPaymentHandler={props.getPaymentHandler}
          selectedBooking={props.selectedBooking}
          _updateSearchedTaxi={props._updateSearchedTaxi}
          data={props.data}
          setShowTaxiModal={props.setShowTaxiModal}
        ></SectionFour>
      </Container>
    );
  else return null;
};

export default Section;
