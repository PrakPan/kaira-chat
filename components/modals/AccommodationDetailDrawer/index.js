// components/modals/AccommodationDetailDrawer/index.js
//
// Drawer wrapper around the existing HotelBookingDetails visual so the
// chat-opened flow looks identical to the booked-hotel detail in
// components/modals/ViewHotelDetails. Fetches data from the mercury
// /api/v1/hotels/detail/ endpoint (same payload shape as viewHotelDetails)
// and routes "select room" through the same itinerary booking API.

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import NextImage from "next/image";
import styled from "styled-components";

import Drawer from "../../ui/Drawer";
import Skeleton from "../ViewHotelDetails/Skeleton";
import HotelBookingDetails from "../ViewHotelDetails/Overview/HotelBookingDetails";
import FullScreenGallery from "../../fullscreengallery/Index.js";
import { hotelDetails } from "../../../services/bookings/FetchAccommodation";
import { updateAccommodationBooking } from "../../../services/bookings/UpdateBookings";
import { openNotification } from "../../../store/actions/notification";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";
import SetRefetchAirportTransfers from "../../../store/actions/refetchAirportTransfers";
import { updateSingleStayCityAndCheckInWise } from "../../../store/actions/StayBookings";
import { set } from "date-fns";

const Container = styled.div`
  padding: 0 0.75rem 0.75rem 0.75rem;
  @media screen and (min-width: 768px) {
    padding: 0 1.25rem 1.25rem 1.25rem;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  width: 90%;
  margin: auto;
  text-align: center;
`;

const toIsoDate = (v) => {
  if (!v) return "";
  // Accept "YYYY-MM-DD", "YYYY/MM/DD", or full ISO; return "YYYY-MM-DD".
  const s = String(v).split(" ")[0];
  return s.includes("/") ? s.split("/").join("-") : s;
};

const AccommodationDetailDrawer = ({
  show,
  onHide,
  accommodationId,
  onChangeHotel,
  onAddHotel,
  itinerary_city_id,
  check_in,
  check_out,
  bookingId,
  setShowLoginModal,
  _setImagesHandler = undefined,
  // New: lets the drawer hit /api/v1/hotels/detail/ directly.
  dbCityId = undefined,
  source = "Travclan",
  occupancies = undefined,
  traceId = undefined,
  // Optional hook fired after the booking POST succeeds. Receives the
  // booking payload so callers (e.g. the chat panel) can refresh derived
  // state on top of the Stays Redux update we already perform.
  onBookingSuccess = undefined,
  // Authoritative itinerary id from the caller. Required when the drawer
  // is opened from a route whose router.query.id is NOT the itinerary
  // (e.g. /chat/{sessionId}), where falling back to Redux can pick up a
  // stale id from a previously loaded itinerary.
  itineraryId: itineraryIdProp = undefined,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currency = useSelector((state) => state.currency);
  const callPaymentInfo = useSelector((state) => state.CallPaymentInfo);
  const itinerary = useSelector((state) => state.Itinerary);
  const reduxItineraryId = useSelector((state) => state.ItineraryId);

  // Resolve in priority order:
  //   1. explicit prop (always current — caller owns the source of truth)
  //   2. router.query.id, but only when the URL actually carries an
  //      itinerary id (the /chat/{sessionId} route uses `id` for the
  //      chat session UUID, which would silently corrupt the request)
  //   3. dedicated ItineraryId Redux slice
  //   4. Itinerary.id as a last resort (can lag during navigation)
  const isItineraryRoute = (router?.pathname || "").startsWith("/itinerary");
  const resolvedItineraryId =
    itineraryIdProp ||
    (isItineraryRoute ? router?.query?.id : undefined) ||
    reduxItineraryId ||
    itinerary?.id ||
    null;

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [internalGalleryImages, setInternalGalleryImages] = useState(null);

  // When opened from chat, the parent doesn't pass _setImagesHandler (the
  // itinerary-side flow owns the FullScreenGallery), so "Show all photos"
  // would be a no-op. Fall back to a local gallery in that case.
  const handleSetImages = (images) => {
    if (typeof _setImagesHandler === "function") {
      _setImagesHandler(images);
      return;
    }
    setInternalGalleryImages(images);
  };

  useEffect(() => {
    if (!show || !accommodationId) return;
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, accommodationId, check_in, check_out]);

  useEffect(() => {
    if (show) {
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [show]);

  const fetchDetails = () => {
    setLoading(true);
    setError(false);
    setErrorMsg(null);
    setData({});

    const requestData = {
      trace_id: traceId,
      check_in: toIsoDate(check_in),
      check_out: toIsoDate(check_out),
      hotel_id: accommodationId,
      occupancies:
        Array.isArray(occupancies) && occupancies.length
          ? occupancies.map((item) => ({
              num_adults: item.num_adults ?? item.adults ?? 1,
              child_ages: item.child_ages ?? item.childAges ?? [],
            }))
          : [{ num_adults: 1, child_ages: [] }],
      source,
      currency: currency?.currency || "INR",
      city_id: dbCityId,
    };

    hotelDetails
      .post(`?currency=${currency?.currency || "INR"}`, requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        setErrorMsg(err?.response?.data?.errors?.[0]?.message?.[0] || "Oops! There seems to be a problem, please try again later!");
      });
  };

  const updateBooking = (recommendation_id, rates) => {
    const itineraryId = resolvedItineraryId;
    if (!itineraryId) {
      dispatch(
        openNotification({
          type: "error",
          text: "Missing itinerary context. Please open this hotel from your itinerary.",
          heading: "Error!",
        })
      );
      return;
    }

    const requestData = {
      rates,
      itinerary_code: data?.itinerary_code,
      items: data?.items,
      recommendation_id,
      trace_id:
        data?.trace_details?.id ||
        traceId ||
        localStorage.getItem("trace_id"),
      itinerary_id: itineraryId,
      hotel_id: data?.id,
      source,
      booking_id: bookingId || null,
      itinerary_city: itinerary_city_id,
      city_id: dbCityId,
    };

    setUpdating(true);
    updateAccommodationBooking
      .post(`${itineraryId}/bookings/accommodation/`, requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setUpdating(false);

        const bookingData = response?.data;
        if (bookingData) {
          const stayPayload = {
            ...bookingData,
            itinerary_city_id:
              bookingData.itinerary_city_id ||
              bookingData.itinerary_city ||
              itinerary_city_id,
            city_id: bookingData.city_id || dbCityId,
          };
          dispatch(updateSingleStayCityAndCheckInWise(stayPayload));
        }

        dispatch(SetCallPaymentInfo(!callPaymentInfo));
        // The backend reprices this city's airport transfers and deletes the
        // previous bookings on a hotel change — re-poll status & re-fetch.
        dispatch(SetRefetchAirportTransfers());
        dispatch(
          openNotification({
            type: "success",
            text: `${data?.name || "Hotel"} added to itinerary successfully.`,
            heading: "Success!",
          })
        );
        onBookingSuccess?.(bookingData);
        onHide?.();
      })
      .catch((err) => {
        setUpdating(false);
        dispatch(
          openNotification({
            type: "error",
            text:
              err?.response?.data?.errors?.[0]?.message?.[0] ||
              "Could not update booking.",
            heading: "Error!",
          })
        );
      });
  };

  return (
    <>
      <Drawer
        show={show}
        anchor="right"
        backdrop
        bgColor="#fafaf5"
        className="font-lexend"
        onHide={onHide}
        style={{ zIndex: 1252 }}
        width="50vw"
        mobileWidth="100vw"
      >
        {loading ? (
          <Skeleton onHide={onHide} />
        ) : (
          <Container>
            <div className="my-xl">
              <NextImage
                src="/backarrow.svg"
                className="cursor-pointer"
                width={22}
                height={2}
                onClick={onHide}
              />
            </div>

            {error ? (
              <ErrorContainer>
                {errorMsg || "Oops! There seems to be a problem, please try again later!"}
              </ErrorContainer>
            ) : data && data.id ? (
              <HotelBookingDetails
                _setImagesHandler={handleSetImages}
                data={data}
                images={data?.images || []}
                updateBooking={updateBooking}
                setShowLoginModal={setShowLoginModal}
                onHide={onHide}
                id={accommodationId}
              />
            ) : null}

          {/* {data && data.id && (onAddHotel || onChangeHotel) && (
            <div
              className="fixed bottom-0 left-0 right-0 md:absolute flex items-center justify-between gap-3 border-t-2 bg-white px-[20px] py-[12px] shadow-md"
              style={{ zIndex: 50 }}
            >
              <div className="flex flex-col">
                {check_in && check_out && (
                  <span className="text-[12px] text-text-spacegrey">
                    {check_in} → {check_out}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {onChangeHotel && bookingId && (
                  <button
                    onClick={onChangeHotel}
                    disabled={updating}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-[14px] font-medium text-gray-800 hover:bg-gray-50"
                  >
                    Change Hotel
                  </button>
                )}
                {onAddHotel && !bookingId && (
                  <button
                    onClick={onAddHotel}
                    disabled={updating}
                    className="ttw-btn-fill-yellow"
                  >
                    Add to Itinerary
                  </button>
                )}
              </div>
            </div>
          )} */}
          </Container>
        )}
      </Drawer>

      {/* Portal to #modal-portal so the gallery shares the drawer's
          stacking context (chat panel's ancestor has a transform that would
          otherwise trap a fixed-position element below the drawer). */}
      {internalGalleryImages &&
        internalGalleryImages.length > 0 &&
        typeof document !== "undefined" &&
        document.getElementById("modal-portal") &&
        ReactDOM.createPortal(
          <FullScreenGallery
            mercury={false}
            closeGalleryHandler={() => setInternalGalleryImages(null)}
            images={internalGalleryImages}
          />,
          document.getElementById("modal-portal")
        )}
    </>
  );
};

export default AccommodationDetailDrawer;
