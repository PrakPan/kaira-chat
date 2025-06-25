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
import TaxiSearched from "./taxi-searched/Index";
import Drawer from "../../ui/Drawer";
import { openNotification } from "../../../store/actions/notification";
import Skeleton from "./Skeleton";
import TransferEditDrawer from "../../drawers/routeTransfer/TransferEditDrawer";
import { fetchTransferMode } from "../../../services/bookings/FetchTaxiRecommendations";
import dayjs from "dayjs";
import { add, format } from "date-fns"; // Make sure to import these functions if used
import { DatePicker } from "../../../containers/newitinerary/breif/route/RouteEditSection";

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
  width: 97%;
  position: relative;
  margin: auto;

  @media screen and (min-width: 768px) {
    min-height: 80vh;
    width: 90%;
  }
`;

const ContentContainer = styled.div`
  min-height: 65vh;
  @media screen and (min-width: 768px) {
    min-height: max-content;
  }
`;

const ComboTaxi = (props) => {
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
      console.log("Inside fetch data", props.showTaxiModal);
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
    console.log("T Resu", props?.taxiResults, props?.selectedData);
    if (
      props?.taxiResults?.length &&
      props?.selectedData?.result_index !== undefined
    ) {
      console.log("T Resu", props?.taxiResults, props?.selectedData);
      const selectedIndex = props.taxiResults.findIndex(
        (taxi) => taxi?.result_index === props.selectedData?.result_index
      );

      if (selectedIndex !== -1) {
        setSelectedTaxiIndex(selectedIndex);
      }
    }
  }, [props.taxiResults, props.selectedData]);

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
      props.onTimeChange(slot.value);
    } else {
      fetchDataWithNewTime(slot.value);
    }
  };

  const fetchDataWithNewTime = (newTime) => {
    const updatedProps = {
      ...props,
      comboStartTime: newTime,
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
    console.log("Inside fetch data with time:", propsToUse?.comboStartTime);
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

    console.log("API Request Data:", requestData);

    propsToUse?.comboStartDate &&
      axiosTaxiSearch
        .post("", requestData)
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

          dispatch(
            openNotification({
              type: "error",
              text: "There seems to be a problem, please try again later!",
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
        console.log("Error updating Taxi", err.message);
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
        <div>
          <GridContainer style={{ clear: "right" }}>
            <ContentContainer style={{ position: "relative" }}>
              <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  {(selectedDate || props?.comboStartDate) && (
                    <div className="mb-2 sm:mb-0">
                      <span className="text-sm text-gray-600">
                        Departure Date:{" "}
                      </span>
                      <DatePicker
                        date={selectedDate || props?.comboStartDate}
                        defaultDate={selectedDate || props?.comboStartDate}
                        id="departureDate"
                        onDateChange={(e) => {
                          const newDate = dayjs(e.target.value).format(
                            "YYYY-MM-DD"
                          );
                          setSelectedDate(newDate);
                          if (props.onDateChange) {
                            props.onDateChange(newDate);
                          } else {
                            fetchDataWithNewDate(newDate);
                          }
                        }}
                      />
                    </div>
                  )}

                  {(selectedTime || props?.comboStartTime) && (
                    <div className="time-dropdown-container relative w-full sm:w-auto">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Departure Time
                      </div>
                      <div
                        className="flex items-center justify-between p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-50"
                        onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                      >
                        <span className="text-sm font-medium">
                          {selectedTime ||
                            (props?.comboStartTime
                              ? dayjs(
                                  props?.comboStartDate +
                                    "T" +
                                    props?.comboStartTime +
                                    ":00"
                                )?.format("h:mm A")
                              : "Select Time")}
                        </span>
                        <button>
                          <svg
                            className={`w-5 h-5 text-gray-600 transition-transform`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      </div>

                      {showTimeDropdown && (
                        <div className="absolute z-[15] w-full sm:w-64 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                          <div className="sticky -top-1 bg-gray-100 p-2 border-b">
                            <span className="font-medium text-sm">
                              Select Time
                            </span>
                          </div>
                          <div className="p-1">
                            {timeSlots.map((slot, index) => (
                              <div
                                key={index}
                                className={`p-2 hover:bg-blue-50 cursor-pointer text-sm rounded-md ${
                                  selectedTime === slot.display
                                    ? "bg-blue-100"
                                    : ""
                                }`}
                                onClick={() => handleTimeSelection(slot)}
                              >
                                {slot.display}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {updateBookingState ? (
                <div
                  style={{
                    width: "max-content",
                    margin: "auto",
                    height: isPageWide ? "80vh" : "40vh",
                  }}
                  className="center-div text-center font-lexend"
                >
                  <LoadingLottie height="5rem" width="5rem" margin="none" />
                  Please wait while we update your bookings
                </div>
              ) : null}

              {!noResults && !error && !updateBookingState ? (
                <OptionsContainer id="options">
                  <div style={{ clear: "right" }}>
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
                <OptionsContainer className="font-lexend center-div text-center">
                  Oops, we couldn't find what you were searching but we are
                  already adding new and approved accommodations to our database
                  everyday!
                </OptionsContainer>
              ) : null}

              {error ? (
                <OptionsContainer className="font-lexend center-div text-center">
                  Oops, There seems to be a problem, please try again later!
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
            selectedTransferHeading={props.selectedTransferHeading}
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
            fetchData={props?.fetchData}
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
            selectedTransferHeading={props.selectedTransferHeading}
            origin={props.selectedBooking?.origin?.shortName}
            destination={props.selectedBooking?.destination?.shortName}
            day_slab_index={props.daySlabIndex}
            element_index={props.elementIndex}
            fetchData={props?.fetchData}
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
