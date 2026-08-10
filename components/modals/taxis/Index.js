import React, { useEffect, useState } from "react";
import styled from "styled-components";
import media from "../../media";
import axiosTaxiSearch from "../../../services/bookings/TaxiSearch";
import axiosbookingupdateinstance from "../../../services/bookings/UpdateBookings";
import { connect, useSelector } from "react-redux";
import Button from "../../ui/button/Index";
import LogInModal from "../Login";
import SectionOne from "./SectionOne";
import LoadingLottie from "../../ui/LoadingLottie";
import { ItineraryUpdateLoader } from "../../revamp/common/components/loader";
import TaxiSearched from "./taxi-searched/Index";
import SelectedTaxisBar from "./fleet/SelectedTaxisBar";
import {
  TaxiSelectionProvider,
  useTaxiSelectionState,
} from "./fleet/TaxiSelectionContext";
import { useFleetBookingSubmit } from "./fleet/useFleetBookingSubmit";
import { currencySymbols } from "../../../data/currencySymbols";
import Drawer from "../../ui/Drawer";
import SearchLoaderOverlay from "../../ui/SearchLoaderOverlay";
import { openNotification } from "../../../store/actions/notification";
import Skeleton from "./Skeleton";
import TransferEditDrawer from "../../drawers/routeTransfer/TransferEditDrawer";
import { fetchTransferMode } from "../../../services/bookings/FetchTaxiRecommendations";
import OfflineQuoteEmptyState from "../../ui/OfflineQuoteEmptyState";
import { useRouter } from "next/router";
import { PulseLoader } from "react-spinners";

const OptionsContainer = styled.div`
  position: relative;
`;

const ContentContainer = styled.div`
  position: relative;
`;

const Booking = (props) => {
  const router = useRouter();
  let isPageWide = media("(min-width: 768px)");
  const drawerZIndex = props?.zIndex ?? 1501;
  const [optionsJSX, setOptionsJSX] = useState([]);
  const [moreOptionsJSX, setMoreOptionsJSX] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMoreStatus, setViewMoreStatus] = useState(false);
  const [updateBookingState, setUpdateBookingState] = useState(false);
  const [updateLoadingState, setUpdateLoadingState] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [showTransferEditDrawer, setShowTransferEditDrawer] = useState(false);
  const [isMercury, setIsMercury] = useState(false);
  // Progressive polling (Mozio): trace_id to re-poll with, and whether more results are coming.
  const [traceId, setTraceId] = useState(null);
  const [moreLoadingState, setMoreLoadingState] = useState(false);
  // How the search described the party: `multi_vehicle_needed` is true only when no single
  // vehicle seats it, and that is the one thing that turns on multi-select.
  const [fleet, setFleet] = useState(null);
  const [fleetSource, setFleetSource] = useState(null);
  // Set while a single-taxi card is committing, so the rest of the screen freezes.
  const [addingKey, setAddingKey] = useState(null);
  const [quotes, setQuotes] = useState([]);
   const {number_of_adults,number_of_children,number_of_infants} = useSelector(state => state.Itinerary);
  const currency = useSelector((state) => state.currency);
  // Same fallback chain the single-taxi card uses, so both paths post to the same itinerary.
  const reduxItineraryId = useSelector((state) => state.ItineraryId);

  // Owns "which taxis has the customer lined up", shared with the cards through context —
  // `optionsJSX` freezes the elements it builds, and context reaches past that where a prop
  // could not.
  const taxiSelection = useTaxiSelectionState({
    fleet,
    quotes,
    source: fleetSource,
    busy: !!addingKey,
  });
 
 // console.log("OCity,D",props?.oCityData,props?.dCityData);

  useEffect(() => {
    if (props.showTaxiModal) {
      fetchData();
    }
  }, [props.alternates, props.budget, props.showTaxiModal]);

  // Build the taxi result cards from a search/load-more response. Shared by the initial
  // search and Load More so both render identically. `result_index` is stable per option
  // across polls (backend guarantee), so it's a safe React key and lets re-renders reuse
  // existing cards instead of re-mounting them.
  const buildTaxiCards = (resData) => {
    const quotes = resData?.data?.quotes || [];
    return quotes.map((quote, i) => (
      <TaxiSearched
        key={quote.result_index || i}
        setHideBookingModal={props.setHideBookingModal}
        _updateSearchedTaxi={_updateSearchedTaxi}
        selectedBooking={props.selectedBooking}
        getPaymentHandler={props.getPaymentHandler}
        _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
        data={{
          ...quote,
          distance: resData.data.distance,
          duration: resData.data.duration,
          trace_id: resData.trace_id,
          source: resData.data?.source,
        }}
        handleTaxiSelect={props.handleTaxiSelect}
        onBusyChange={(busy) => setAddingKey(busy ? "quote" : null)}
      ></TaxiSearched>
    ));
  };

  // `next` may arrive top-level or nested in data depending on the supplier envelope.
  const readNext = (resData) => resData?.next ?? resData?.data?.next ?? false;

  const fetchData = () => {
    setError(false);
    setLoading(true);
    setUpdateLoadingState(false);
    setViewMoreStatus(false);
    setMoreLoadingState(false);
    setTraceId(null);
    setOptionsJSX([]);
    setQuotes([]);
    setFleet(null);
    setFleetSource(null);
    taxiSelection.clear();

    {props?.mercury && 
      fetchTransferMode
      .post("",{origin: props?.origin, destination: props?.destination, top_only:"false",number_of_adults:number_of_adults || 1,number_of_children: number_of_children || 0, number_of_infants: number_of_infants || 0})
    }

    const now = new Date();
    let start_date = now.toISOString().split("T")[0];

    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const start_time = `${hours}:${minutes}`;

    const requestData = {
      trips: [
        {
          start_date: props.selectedBooking.check_in || start_date,
          start_time: start_time,
          number_of_travellers:
            number_of_adults + number_of_children + number_of_infants,
          trip_type: "one-way",
          origin: {
            city_id: props.selectedBooking?.origin?.city_id || props?.oCityData?.gmaps_place_id || props?.oCityData?.city?.id,
            hub_id: null,
            gmaps_place_id: null,
            address: props.selectedBooking?.origin?.shortName
              ? props.selectedBooking?.origin?.shortName
              : props.selectedBooking?.origin?.city_name ? props.selectedBooking?.origin?.city_name : (props?.oCityData.city_name || props?.oCityData?.city?.name),
            coordinates: {
              latitude: props.selectedBooking?.origin?.lat ? props.selectedBooking?.origin?.lat : props?.oCityData?.latitude || props?.oCityData?.city?.latitude,
              longitude: props.selectedBooking?.origin?.lng ? props.selectedBooking?.origin?.lng : props?.oCityData?.longitude || props?.oCityData?.city?.longitude,
            },
          },
          destination: {
            city_id: props.selectedBooking?.destination?.city_id || props?.dCityData?.gmaps_place_id || props?.dCityData?.city?.id,
            hub_id: null,
            gmaps_place_id: null,
            address: props.selectedBooking?.destination?.shortName
              ? props.selectedBooking?.destination?.shortName
              : props.selectedBooking?.destination?.city_name ? props.selectedBooking?.destination?.city_name :
              (props?.dCityData.city_name || props?.dCityData?.city?.name),
            coordinates: {
              latitude: props.selectedBooking?.destination?.lat ? props.selectedBooking?.origin?.lat : props?.dCityData?.latitude || props?.dCityData?.city?.latitude,
              longitude: props.selectedBooking?.destination?.lng ? props.selectedBooking?.origin?.lng : props?.dCityData?.longitude || props?.dCityData?.city?.longitude,
            },
          },
        },
      ],
    };

    axiosTaxiSearch
      .post("", requestData)
      .then((res) => {
        if (res.data.success) {
          const hasNext = readNext(res.data);
          const cards = buildTaxiCards(res.data);
          setTraceId(res.data.trace_id || null);
          setViewMoreStatus(!!hasNext);
          // Only "no results" when the search is done AND found nothing. If more are
          // still coming (hasNext), keep the Load More affordance instead.
          setNoResults(cards.length === 0 && !hasNext);
          setOptionsJSX(cards);
          // The cards are frozen React elements; the selection maths needs the underlying
          // quotes, so the raw list is kept beside them and updated with them.
          setQuotes(res.data?.data?.quotes || []);
          setFleet(res.data?.data?.fleet || null);
          setFleetSource(res.data?.data?.source || null);
        } else {
          setNoResults(true);
          setViewMoreStatus(false);
          setTraceId(null);
          setOptionsJSX([]);
          setQuotes([]);
          setFleet(null);
          setFleetSource(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        props.openNotification({
          type: "error",
          text: err?.response?.data?.errors[0]?.message[0] || "There seems to be a problem, please try again later!",
          heading: "Error!",
        });
      });
  };

  // Load More: poll Mozio once more for the next batch. The backend accumulates
  // server-side and returns the FULL set each time, so we REPLACE optionsJSX (not
  // append). `trace_id` is the handle to re-poll; `next` tells us whether to keep
  // offering the button.
  const _loadMore = () => {
    if (!traceId || moreLoadingState) return;
    setMoreLoadingState(true);
    axiosTaxiSearch
      .post("", {
        load_more: true,
        trace_id: traceId,
        number_of_travellers:
          number_of_adults + number_of_children + number_of_infants,
      })
      .then((res) => {
        setMoreLoadingState(false);
        if (res.data.success) {
          const hasNext = readNext(res.data);
          setViewMoreStatus(!!hasNext);
          if (res.data.trace_id) setTraceId(res.data.trace_id);
          const cards = buildTaxiCards(res.data);
          // A load-more poll may carry no fleet block; don't let it wipe the one we have.
          if (res.data?.data?.fleet) {
            setFleet(res.data.data.fleet);
            setFleetSource(res.data.data.source || null);
          }
          if (cards.length) {
            setNoResults(false);
            setOptionsJSX(cards);
            setQuotes(res.data?.data?.quotes || []);
          } else if (!hasNext) {
            setNoResults(true);
          }
        } else {
          setViewMoreStatus(false);
        }
      })
      .catch(() => {
        // Transient failure — keep existing results and let the user retry via the button.
        setMoreLoadingState(false);
        props.openNotification({
          type: "error",
          text: "Couldn't load more options, please try again.",
          heading: "Error!",
        });
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
          Authorization: `Bearer ${props.token}`,
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
            err?.response?.data?.errors?.[0]?.message?.[0] || err.message ;
        props.openNotification({
          type: "error",
          text: errorMsg || "There seems to be a problem, please try again!",
          heading: "Error!",
        });
      });
  };

  const handleTransferEdit = (e) => {
    setShowTransferEditDrawer(true);
  };

  const { submit: submitFleet, loading: submittingFleet } = useFleetBookingSubmit({
    itineraryId: props?.itinerary_id || reduxItineraryId,
    selectedBooking: props.selectedBooking,
    token: props.token,
    airportBooking: props?.airportBooking,
    cityId: props?.cityId,
    origin_itinerary_city_id: props?.origin_itinerary_city_id,
    destination_itinerary_city_id: props?.destination_itinerary_city_id,
    edge: props?.edge,
    booking_id: props?.booking_id,
    getPaymentHandler: props.getPaymentHandler,
    setHideBookingModal: props.setHideBookingModal,
  });

  const handleAddSelectedTaxis = async (vehicles) => {
    if (!vehicles?.length) return;
    if (props.handleTaxiSelect) {
      // Selection mode: hand the choice back instead of booking, mirroring what a
      // single-taxi card does with {trace_id, result_index}.
      props.handleTaxiSelect({ trace_id: traceId, vehicles });
      return;
    }
    await submitFleet({ source: fleetSource, trace_id: traceId, vehicles });
  };

  const currencySymbol =
    (fleet?.currency && currencySymbols?.[fleet.currency]) ||
    (currency?.currency && currencySymbols?.[currency.currency]) ||
    "₹";

  if (props.token)
    return (
      <Drawer
        anchor={"right"}
        backdrop
        bgColor="#fafaf5"
        style={{ zIndex: drawerZIndex }}
        className="!overflow-y-hidden"
        show={props.showTaxiModal}
        onHide={props.setHideTaxiModal}
        mobileWidth={"100%"}
        width="50%"
      >
        {/* Column, not two stacked blocks: the results pane used to be a flat 100vh sitting
            BELOW the header, so its last header-height worth of pixels fell outside the
            panel. Anything pinned to the bottom of that pane - the selected-taxis bar -
            would have been pinned off-screen. */}
        <TaxiSelectionProvider value={taxiSelection}>
        <div className="flex flex-col h-full">
        <SectionOne
          selectedBooking={props.selectedBooking}
          setHideTaxiModal={props.setHideTaxiModal}
          handleTransferEdit={handleTransferEdit}
          oCityData={props?.oCityData}
          dCityData={props?.dCityData}
          mercury={props?.mercury}
          setIsMercury={setIsMercury}
        ></SectionOne>

        <div className="flex-1 min-h-0 overflow-y-scroll px-6 max-ph:px-4">
          <div style={{ clear: "right" }}>
            <ContentContainer style={{ position: "relative" }}>
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
                  {/* One taxi per card, at that taxi's own price, whatever the party size.
                      When no single vehicle seats the group the cards grow quantity
                      steppers and SelectedTaxisBar below commits them as one booking. */}
                  {taxiSelection.enabled ? (
                    <div className="rounded-2xl border-sm border-solid border-[#f2e6a8] bg-[#fffdf0] px-3 py-2 mt-md ttw-type-small text-[#6b5600]">
                      No single taxi seats {fleet?.pax} — add as many as you need
                      and we will book them together.
                    </div>
                  ) : null}
                  <div
                    style={{ clear: "right" }}
                    className={addingKey ? "pointer-events-none" : ""}
                  >
                    {optionsJSX.length
                      ? optionsJSX
                      : moreOptionsJSX.length
                      ? moreOptionsJSX
                      : null}
                    {loading && !optionsJSX.length ? <Skeleton /> : null}
                  </div>

                  {updateLoadingState ? (
                    <div className="flex items-center justify-center py-6">
                      <PulseLoader size={8} color="#0b1220" />
                    </div>
                  ) : null}

                  {viewMoreStatus && !loading ? (
                    <div className="flex justify-center mt-5 mb-1">
                      <button
                        type="button"
                        onClick={_loadMore}
                        disabled={moreLoadingState}
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-[#e2e2da] bg-white ttw-type-small font-500 text-[#0b1220] shadow-[0_1px_2px_rgba(11,18,32,0.05)] hover:border-[#0b1220] hover:bg-[#f4f3ec] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {moreLoadingState ? (
                          <PulseLoader size={7} color="#0b1220" />
                        ) : optionsJSX.length ? (
                          "Load more"
                        ) : (
                          "Search for more options"
                        )}
                      </button>
                    </div>
                  ) : null}
                </OptionsContainer>
              ) : null}

              {noResults ? (
                <OptionsContainer className="center-div text-center ttw-type-body text-[#445069]">
                  Oops, we couldn't find what you were searching but we are
                  already adding new and approved transfers to our database
                  everyday!
                </OptionsContainer>
              ) : null}

              {error ? (
                <OptionsContainer>
                  <OfflineQuoteEmptyState
                    message="We couldn't load transfers for these details right now. Request an offline quote and our team will sort it out for you."
                    title="No transfers available right now"
                    itinerary_id={props?.itinerary_id || router?.query?.id}
                    type="taxi"
                    token={props?.token}
                    startDate={props?.selectedBooking?.check_in}
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
                      start_date: props?.selectedBooking?.check_in,
                    }}
                  />
                </OptionsContainer>
              ) : null}
            </ContentContainer>
          </div>

          {/* Pinned to the bottom of the scroll area: the quote list is long, and having
              picked a taxi near the end of it you should not have to scroll further to
              find the total. */}
          <SelectedTaxisBar
            symbol={currencySymbol}
            submitting={submittingFleet}
            onSubmit={handleAddSelectedTaxis}
          />
        </div>
        </div>
        </TaxiSelectionProvider>

        {props?.mercury ? <TransferEditDrawer
          itinerary_id={props?.itinerary_id}
          showDrawer={showTransferEditDrawer}
          setShowDrawer={setShowTransferEditDrawer}
          origin={props.selectedBooking?.origin?.shortName || props?.oCityData?.gmaps_place_id || props?.oCityData?.city?.id}
          destination={props.selectedBooking?.destination?.shortName || props?.dCityData?.gmaps_place_id || props?.dCityData?.city?.id}
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
        /> 
        :
        <TransferEditDrawer
          itinerary_id={props?.itinerary_id}
          showDrawer={showTransferEditDrawer}
          setShowDrawer={setShowTransferEditDrawer}
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
        />}
        <SearchLoaderOverlay
          isVisible={props.showTaxiModal && loading && !optionsJSX.length}
          displayText="Finding best transfers for you"
          zIndex={drawerZIndex + 5}
        />
      </Drawer>
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

export default connect(mapStateToPros, mapDispatchToProps)(Booking);
