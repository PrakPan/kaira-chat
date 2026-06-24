import React, { useEffect, useState } from "react";
import styled from "styled-components";
import media from "../../media";
import axiosTaxiSearch from "../../../services/bookings/TaxiSearch";
import axiosbookingupdateinstance from "../../../services/bookings/UpdateBookings";
import { connect, useDispatch, useSelector } from "react-redux";
import Button from "../../ui/button/Index";
import LogInModal from "../Login";
import SectionOne from "./SectionOne";
import LoadingLottie from "../../ui/LoadingLottie";
import { ItineraryUpdateLoader } from "../../revamp/common/components/loader";
import TaxiSearched from "./taxi-searched/Index";
import Drawer from "../../ui/Drawer";
import { openNotification } from "../../../store/actions/notification";
import Skeleton from "./Skeleton";
import SearchLoaderOverlay from "../../ui/SearchLoaderOverlay";
import TransferEditDrawer from "../../drawers/routeTransfer/TransferEditDrawer";
import { fetchTransferMode } from "../../../services/bookings/FetchTaxiRecommendations";
import dayjs from "dayjs";
import { add, format } from "date-fns";
import TransferDateTimeFields from "../../drawers/routeTransfer/TransferDateTimeFields";
import OfflineQuoteEmptyState from "../../ui/OfflineQuoteEmptyState";

const GridContainer = styled.div`
@media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr;

    @media screen and (min-width: 768px) {

    }
`;

const OptionsContainer = styled.div`
  min-height: 40vh;
  overflow-x: hidden;
  width: 100%;
  position: relative;
  margin: auto;

  @media screen and (min-width: 768px) {
    min-height: 80vh;
    width: 100%;
  }
`;

const ContentContainer = styled.div`
  min-height: 65vh;
  @media screen and (min-width: 768px) {
    min-height: max-content;
  }
`;

const ComboTaxi = (props) => {
  console.log(props,"txi props")
  let isPageWide = media("(min-width: 768px)");
  const [optionsJSX, setOptionsJSX] = useState([]);
  const [moreOptionsJSX, setMoreOptionsJSX] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMoreStatus, setViewMoreStatus] = useState(false);
  const [updateBookingState, setUpdateBookingState] = useState(false);
  const [updateLoadingState, setUpdateLoadingState] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [showTransferEditDrawer, setShowTransferEditDrawer] = useState(false);
  const [isMercury, setIsMercury] = useState(false);
  const [selectedTaxiIndex, setSelectedTaxiIndex] = useState(null);
  const [quotes, setQuotes] = useState(
    props?.taxiResults ? props?.taxiResults : []
  );
  const dispatch = useDispatch();
  const currency = useSelector(state=>state.currency);
  

  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    props?.comboStartDate || null
  );
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTimeValue, setSelectedTimeValue] = useState(
    props?.comboStartTime || null
  );
  const { number_of_adults, number_of_children, number_of_infants } =
    useSelector((state) => state.Itinerary);

  useEffect(() => {
    if (props?.comboStartTime) {
      const slots = [];
      let Time = dayjs(
        props?.comboStartDate + "T" + props?.comboStartTime + ":00"
      );
      const date = new Date(Time);
      date.setHours(0, 0, 0, 0);

      let baseTime = dayjs(date.toISOString());

      const minutes = baseTime.minute();
      const remainder = minutes % 30;

      if (remainder > 0) {
        baseTime = baseTime.add(30 - remainder, "minute");
      }

      const endTime = baseTime
        .startOf("day")
        .add(1, "day")
        .subtract(1, "minute");

      while (baseTime.isBefore(endTime) || baseTime.isSame(endTime)) {
        slots.push({
          value: baseTime.format("HH:mm"),
          display: baseTime.format("h:mm A"),
        });
        baseTime = baseTime.add(30, "minute");
      }

      setTimeSlots(slots);

      const initialTimeDisplay = dayjs(
        props?.comboStartDate + "T" + props?.comboStartTime + ":00"
      ).format("h:mm A");
      setSelectedTime(initialTimeDisplay);
      setSelectedTimeValue(props?.comboStartTime);
    }
  }, [props?.comboStartTime, props?.comboStartDate]);

  const addDaysToDate = (dateString, numberOfDays) => {
    const date = new Date(dateString);
    const newDate = add(date, { days: numberOfDays });
    const formattedDate = format(newDate, "yyyy-MM-dd");
    return formattedDate;
  };

  useEffect(() => {
    if (props?.comboStartDate && props?.comboStartDate !== selectedDate) {
      setSelectedDate(props?.comboStartDate);
    }
  }, [props?.comboStartDate]);

  useEffect(() => {
    if (props.showTaxiModal && !props?.skipTaxiFetch) {
      fetchData();
    }
  }, [
    props.alternates,
    props.budget,
    props.showTaxiModal,
    props?.comboStartDate,
    props?.comboStartTime,
  ]);

  useEffect(() => {
    if (
      props?.taxiResults?.length &&
      props?.selectedData?.result_index !== undefined
    ) {
      const selectedIndex = props.taxiResults.findIndex(
        (taxi) => taxi?.result_index === props.selectedData?.result_index
      );

      if (selectedIndex !== -1) {
        setSelectedTaxiIndex(selectedIndex);
      }
    } else {
      if ((!props.selectedData || !props.isSelected) && selectedTaxiIndex !== null) {
        console.log("Resetting taxi selection - parent deselected or no selected data");
        setSelectedTaxiIndex(null);
      }
    }
  }, [props.taxiResults, props.selectedData, props.isSelected, selectedTaxiIndex]);
  // useEffect(() => {
  //   if (
  //     props?.taxiResults?.length &&
  //     props?.selectedData?.result_index !== undefined
  //   ) {
  //     const selectedIndex = props.taxiResults.findIndex(
  //       (taxi) => taxi?.result_index === props.selectedData?.result_index
  //     );

  //     if (selectedIndex !== -1) {
  //       setSelectedTaxiIndex(selectedIndex);
  //     }
  //   }
  // }, [props.taxiResults, props.selectedData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showTimeDropdown &&
        !event.target.closest(".time-dropdown-container")
      ) {
        setShowTimeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTimeDropdown]);


  const handleTimeSelection = (slot) => {
    setSelectedTime(slot.display);
    setSelectedTimeValue(slot.value);
    setShowTimeDropdown(false);

    if (props.onTimeChange) {
      props.onTimeChange(slot.value, selectedDate || props?.comboStartDate);
    } else {
      fetchDataWithNewTime(slot.value, selectedDate || props?.comboStartDate);
    }
  };
  const fetchDataWithNewTime = (newTime, dateToUse = null) => {
    const updatedProps = {
      ...props,
      comboStartTime: newTime,
      comboStartDate: dateToUse || selectedDate || props?.comboStartDate,
    };
    fetchDataWithProps(updatedProps);
  };

  const isValidUUID = (uuid) => {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  };

  const fetchData = () => {
    fetchDataWithProps(props);
  };

  const fetchDataWithProps = (propsToUse) => {
    setError(false);
    setLoading(true);
    setUpdateLoadingState(false);
    setOptionsJSX([]);
    setQuotes([]);
    props?.setTaxiResults((prev) => {
      let newData = { ...prev };
      delete newData[props?.KEY];
      return newData;
    });

    {
      propsToUse?.mercury &&
        fetchTransferMode.post("", {
          origin: propsToUse?.origin,
          destination: propsToUse?.destination,
          top_only: "false",
          number_of_adults: number_of_adults || 1,
          number_of_children: number_of_children || 0,
          number_of_infants: number_of_infants || 0,
        });
    }

    const now = new Date();
    let start_date = now.toISOString().split("T")[0];

    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const start_time = `${hours}:${minutes}`;

    const requestData = {
      trips: [
        {
          start_date:
            propsToUse?.comboStartDate ||
            propsToUse.selectedBooking.check_in ||
            start_date,
          start_time: propsToUse?.comboStartTime || start_time,
          number_of_travellers:
            number_of_adults + number_of_children + number_of_infants,
          trip_type: "one-way",
          origin: {
            city_id: props?.sourceRouteCityId ? props?.sourceRouteCityId : null,

            // isValidUUID(propsToUse?.originCityId || propsToUse.selectedBooking?.origin?.city_id ||
            // propsToUse?.oCityData?.gmaps_place_id ||
            // propsToUse?.oCityData?.city?.id) ? propsToUse?.originCityId || propsToUse.selectedBooking?.origin?.city_id ||
            // propsToUse?.oCityData?.gmaps_place_id ||
            // propsToUse?.oCityData?.city?.id  : null,
            hub_id: props?.sourceHubId ? props?.sourceHubId : null,
            gmaps_place_id: null,
            // propsToUse?.oCityData?.gmaps_place_id,
            coordinates: {
              latitude: null,
              // propsToUse.selectedBooking?.origin?.lat
              //   ? propsToUse.selectedBooking?.origin?.lat
              //   : propsToUse?.oCityData?.latitude ||
              //     propsToUse?.oCityData?.city?.latitude,
              longitude: null,
              // propsToUse.selectedBooking?.origin?.lng
              //   ? propsToUse.selectedBooking?.origin?.lng
              //   : propsToUse?.oCityData?.longitude ||
              //     propsToUse?.oCityData?.city?.longitude,
            },
          },
          destination: {
            city_id: props?.destinationRouteCityId
              ? props?.destinationRouteCityId
              : null,
            // isValidUUID(propsToUse?.destinationCityId || propsToUse.selectedBooking?.destination?.city_id ||
            // propsToUse?.dCityData?.gmaps_place_id ||
            // propsToUse?.dCityData?.city?.id ||
            // propsToUse?.destinationCityId) ? propsToUse?.destinationCityId || propsToUse.selectedBooking?.destination?.city_id ||
            // propsToUse?.dCityData?.gmaps_place_id ||
            // propsToUse?.dCityData?.city?.id ||
            // propsToUse?.destinationCityId : null,
            hub_id: propsToUse?.destinationHubId
              ? propsToUse?.destinationHubId
              : null,
            gmaps_place_id: null,
            //  propsToUse?.dCityData?.gmaps_place_id,
            coordinates: {
              latitude: null,
              //  propsToUse.selectedBooking?.destination?.lat
              //   ? propsToUse.selectedBooking?.origin?.lat
              //   : propsToUse?.dCityData?.latitude ||
              //     propsToUse?.dCityData?.city?.latitude,
              longitude: null,
              //  propsToUse.selectedBooking?.destination?.lng
              //   ? propsToUse.selectedBooking?.origin?.lng
              //   : propsToUse?.dCityData?.longitude ||
              //     propsToUse?.dCityData?.city?.longitude,
            },
          },
        },
      ],
    };


    propsToUse?.comboStartDate &&
      axiosTaxiSearch
        .post(`/?currency=${currency?.currency || 'INR'}`, requestData)
        .then((res) => {
          if (res.data.success) {
            setNoResults(false);
            setQuotes(
              res.data.data.quotes.map((q, i) => ({
                ...q,
                distance: res.data.data.distance,
                duration: res.data.data.duration,
                trace_id: res.data.trace_id,
                source: res.data.data?.source,
              }))
            );
            props?.setTaxiResults((prev) => {
              let newData = { ...prev };

              newData[props?.KEY] = res.data.data.quotes.map((q, i) => ({
                ...q,
                distance: res.data.data.distance,
                duration: res.data.data.duration,
                trace_id: res.data.trace_id,
                source: res.data.data?.source,
              }));
              return newData;
            });
          } else {
            setNoResults(true);
            setViewMoreStatus(false);
            setQuotes([]);

            props?.setTaxiResults((prev) => {
              let newData = { ...prev };
              delete newData[props?.KEY];
              return newData;
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          setQuotes([]);
          if (props?.setTransferResults) {
            props?.setTransferResults((prev) => {
              let newData = [...prev];
              newData[props?.index] = [];
              return newData;
            });
          }
          props?.setTaxiResults((prev) => {
            let newData = { ...prev };
            delete newData[props?.KEY];
            return newData;
          });
          setLoading(false);
          setError(true);
          const errorMsg =
            err?.response?.data?.errors?.[0]?.message?.[0] ||
            err.message ||
            "There seems to be a problem, please try again later!";

          dispatch(
            openNotification({
              type: "error",
              text: errorMsg,
              heading: "Error!",
            })
          );
        });
  };

  const _updateSearchedTaxi = ({
    itinerary_id,
    taxi_type,
    transfer_type,
    duration,
    total_taxi,
  }) => {
    if (props.handleTaxiSelect) {
      props.handleTaxiSelect();
      return;
    }

    setUpdateBookingState(true);

    let updated_bookings_arr = [
      {
        id: props.selectedBooking.id,
        booking_type: "Taxi",
        itinerary_type: "Tailored",
        user_selected: true,
        itinerary_id: itinerary_id,
        taxi_type: taxi_type,
        transfer_type: transfer_type,
        costings_breakdown: {
          duration: {
            value: Math.trunc(duration),
          },
          total_taxi: total_taxi,
        },
      },
    ];

    axiosbookingupdateinstance
      .post("?booking_type=Taxi,Bus,Ferry", updated_bookings_arr, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        props._updateTaxiBookingHandler(res.data.bookings);
        setTimeout(function () {
          props.getPaymentHandler();
        }, 1000);
        setUpdateBookingState(false);
      })
      .catch((err) => {
        setUpdateBookingState(false);
        const errorMsg =
          err?.response?.data?.errors?.[0]?.message?.[0] || err.message;
        dispatch(
          openNotification({
            type: "error",
            text: errorMsg || "There seems to be a problem, please try again!",
            heading: "Error!",
          })
        );
      });
  };

  const handleTransferEdit = (e) => {
    setShowTransferEditDrawer(true);
  };

  const handleTaxiDeselect = () => {
    setSelectedTaxiIndex(null);
  };

  const fetchDataWithNewDate = (newDate) => {
    setSelectedDate(newDate);
    const updatedProps = {
      ...props,
      comboStartDate: newDate,
    };
    fetchDataWithProps(updatedProps);
  };


  if (props.token)
    return (
      <>
        <SearchLoaderOverlay
          isVisible={loading && !quotes.length}
          displayText="Finding best transfers for you"
          zIndex={1505}
        />
        <div>
          <GridContainer style={{ clear: "right" }}>
            <ContentContainer style={{ position: "relative" }}>

              <div className="ttw-type-h2 font-semibold mb-md text-[#0b1220]"> {props.heading}</div>

              <div className="">
                {(selectedDate || props?.comboStartDate) && (
                  <TransferDateTimeFields
                    dateId="departureDate"
                    date={selectedDate || props?.comboStartDate}
                    defaultDate={props?.comboStartDate}
                    onDateChange={(e) => {
                      const newDate = dayjs(e.target.value).format("YYYY-MM-DD");
                      setSelectedDate(newDate);
                      if (props.onDateChange) {
                        props.onDateChange(newDate);
                      } else {
                        fetchDataWithNewDate(newDate);
                      }
                    }}
                    departureTime={selectedTimeValue || props?.comboStartTime}
                    timeOptions={timeSlots}
                    formatTimeForDisplay={(val) =>
                      val
                        ? dayjs(
                            `${selectedDate || props?.comboStartDate}T${val}:00`
                          ).format("h:mm A")
                        : "Select Time"
                    }
                    onTimeSelect={handleTimeSelection}
                    showTimeDropdown={showTimeDropdown}
                    setShowTimeDropdown={setShowTimeDropdown}
                    timeDropdownId="taxiTimeDropdown"
                    showTravellers={false}
                  />
                )}
              </div>
              {updateBookingState ? (
                <ItineraryUpdateLoader
                  message="Please wait while we update your transfer"
                  subMessages={[
                    "Confirming your ride…",
                    "Arranging pickup details…",
                    "Updating your transfer…",
                  ]}
                />
              ) : null}

              {!noResults && !error && !updateBookingState ? (
                <OptionsContainer id="options">
                  <div >
                    {quotes.map((quote, index) => (
                      <TaxiSearched
                        key={index}
                        booking_id={props?.booking_id}
                        setHideBookingModal={props.setHideTaxiModal}
                        _updateSearchedTaxi={_updateSearchedTaxi}
                        selectedBooking={props.selectedBooking}
                        getPaymentHandler={props.getPaymentHandler}
                        _updateTaxiBookingHandler={
                          props._updateTaxiBookingHandler
                        }
                        data={quote}
                        handleTaxiSelect={props.handleTaxiSelect}
                        combo={props?.combo}
                        onSelect={props?.onSelect}
                        isSelected={selectedTaxiIndex === index}
                        onTaxiSelect={() => setSelectedTaxiIndex(index)}
                        index={index}
                        start_date={props?.comboStartDate}
                        start_time={selectedTimeValue || props?.comboStartTime} // Use the selected time value
                        origin_itinerary_city_id={
                          props?.origin_itinerary_city_id
                        }
                        destination_itinerary_city_id={
                          props?.destination_itinerary_city_id
                        }
                        edge={props?.edge}
                        handleTaxiDeselect={handleTaxiDeselect}
                      />
                    ))}
                    {loading && !quotes.length ? <Skeleton /> : null}
                  </div>

                  {updateLoadingState ? (
                    <div className="center-div" style={{}}>
                      <LoadingLottie
                        height="5rem"
                        width="5rem"
                        margin="1rem auto"
                      />
                    </div>
                  ) : null}
                </OptionsContainer>
              ) : null}

              {noResults ? (
                <OptionsContainer className=" center-div text-center ttw-type-small md:ttw-type-body text-[#445069]">
                  Oops, we couldn't find what you were searching but we are
                  already adding new and approved accommodations to our database
                  everyday!
                </OptionsContainer>
              ) : null}

              {error ? (
                <OptionsContainer className=" center-div text-center text-[#445069]">
                  <OfflineQuoteEmptyState
                    message="We couldn't load transfers for these details right now. Request an offline quote and our team will sort it out for you."
                    title="No transfers available right now"
                    itinerary_id={props?.itinerary_id}
                    type="taxi"
                    token={props?.token}
                    startDate={
                      props?.comboStartDate ||
                      props?.selectedBooking?.check_in
                    }
                    onEditDates={() => {
                      if (typeof props?.setHideTaxiModal === "function") {
                        props.setHideTaxiModal();
                      }
                    }}
                    payload={{
                      taxi_type: "one-way",
                      source:
                        props.selectedBooking?.origin?.shortName ||
                        props.selectedBooking?.origin?.city_name ||
                        props?.oCityData?.city_name ||
                        props?.oCityData?.city?.name,
                      destination:
                        props.selectedBooking?.destination?.shortName ||
                        props.selectedBooking?.destination?.city_name ||
                        props?.dCityData?.city_name ||
                        props?.dCityData?.city?.name,
                      start_date:
                        props?.comboStartDate ||
                        props?.selectedBooking?.check_in,
                    }}
                  />
                </OptionsContainer>
              ) : null}
            </ContentContainer>
          </GridContainer>
        </div>

        {props?.mercury ? (
          <TransferEditDrawer
            itinerary_id={props?.itinerary_id}
            showDrawer={showTransferEditDrawer}
            setShowDrawer={setShowTransferEditDrawer}
            origin={
              props.selectedBooking?.origin?.shortName ||
              props?.oCityData?.gmaps_place_id ||
              props?.oCityData?.city?.id
            }
            destination={
              props.selectedBooking?.destination?.shortName ||
              props?.dCityData?.gmaps_place_id ||
              props?.dCityData?.city?.id
            }
            day_slab_index={props.daySlabIndex}
            element_index={props.elementIndex}
            setShowLoginModal={props?.setShowLoginModal}
            check_in={props?.check_in}
            _GetInTouch={props._GetInTouch}
            routeId={props.routeId}
            selectedBooking={props.selectedBooking}
            city={props?.city}
            dcity={props?.dcity}
            oCityData={props?.oCityData}
            dCityData={props?.dCityData}
            isMercury={isMercury}
            mercury={props?.mercury}
            booking_id={props?.booking_id}
          />
        ) : (
          <TransferEditDrawer
            itinerary_id={props?.itinerary_id}
            showDrawer={showTransferEditDrawer}
            setShowDrawer={setShowTransferEditDrawer}
            origin={props.selectedBooking?.origin?.shortName}
            destination={props.selectedBooking?.destination?.shortName}
            day_slab_index={props.daySlabIndex}
            element_index={props.elementIndex}
            setShowLoginModal={props?.setShowLoginModal}
            check_in={props?.check_in}
            _GetInTouch={props._GetInTouch}
            routeId={props.routeId}
            selectedBooking={props.selectedBooking}
            isMercury={isMercury}
            city={props?.city}
            dcity={props?.dcity}
            oCityData={props?.oCityData}
            dCityData={props?.dCityData}
            booking_id={props?.booking_id}
          />
        )}
      </>
    );
  else
    return (
      <div>
        <LogInModal show={true} onhide={props.setHideTaxiModal}></LogInModal>
      </div>
    );
};

const mapStateToPros = (state) => {
  return {
    name: state.auth.name,
    emailFail: state.auth.emailFail,
    token: state.auth.token,
    phone: state.auth.phone,
    email: state.auth.email,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
    emailfailmessage: state.auth.emailfailmessage,
    loginmessage: state.auth.loginmessage,
    hideloginclose: state.auth.hideloginclose,
    plan: state.Plan,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(ComboTaxi);
