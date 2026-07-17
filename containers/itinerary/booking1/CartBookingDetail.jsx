import React from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import TransferDrawer from "../TransferDrawer";
import POIDetailsDrawer from "../../../components/drawers/poiDetails/POIDetailsDrawer";
import AccommodationModal from "../../../components/modals/accommodation/Index";
import VisaDetailDrawer from "../../../components/drawers/visaDetails/VisaDetailDrawer";
import EsimDetailDrawer from "../../../components/drawers/esimDetails/EsimDetailDrawer";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";
import { updateTransferBookings } from "../../../store/actions/transferBookingsStore";
import {
  addAncillaryBooking,
  removeAncillaryBooking,
} from "../../../store/actions/ancillaryBookings";
import { openNotification } from "../../../store/actions/notification";

// The cart itself renders inside a z-1700 drawer, so anything it opens on top
// has to clear that — including the delete footers, which portal out of their
// drawer and would otherwise sit behind the cart. 1710 is the layer the
// ancillary drawers already default to.
const CART_DRAWER_Z_INDEX = 1710;

// Which detail drawer a cart row maps to, or null when the row has none.
// `booking_type` is the cart category (Flight/Accommodation/Activity/…);
// `detail.booking_type` is the booking's own type (Taxi, Visa, eSIM, …).
export const getBookingDetailType = (booking) => {
  switch (booking?.booking_type) {
    case "Flight":
    case "Transfer":
      return "transfer";
    case "Accommodation":
      return "stay";
    case "Activity":
      return "activity";
    case "Ancillary":
      if (booking?.detail?.booking_type === "Visa") return "visa";
      if (booking?.detail?.booking_type === "eSIM") return "esim";
      return null;
    default:
      return null;
  }
};

const CartBookingDetail = ({
  booking,
  onClose,
  setShowLoginModal,
  getPaymentHandler,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const stays = useSelector((state) => state.Stays);
  const itinerary = useSelector((state) => state.Itinerary);
  const ancillaries = useSelector((state) => state.AncillaryBookings);

  const itineraryId = router?.query?.id || router?.query?.sessionId;
  const type = getBookingDetailType(booking);

  // Pull the cart's line item back to the full booking the drawers need.
  const stay = stays?.find?.((item) => item?.id === booking?.id);
  const ancillary = ancillaries?.find?.((item) => item?.id === booking?.id);
  const activityCity = itinerary?.cities?.find((city) =>
    city?.activities?.some((activity) => activity?.id === booking?.id),
  );

  const handleDeleteTransfer = async (target) => {
    if (!localStorage?.getItem("access_token")) {
      setShowLoginModal?.(true);
      return;
    }
    const deleted = target || {};
    const path = deleted?.booking_type?.includes(",")
      ? "combo"
      : deleted?.booking_type?.toLowerCase();

    try {
      const response = await axiosDeleteBooking.delete(
        `${itineraryId}/bookings/${path}/${deleted?.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      if (response.status === 204) {
        if (deleted?.combo_type === "multicity" && deleted?.children) {
          dispatch(
            updateTransferBookings(
              deleted?.id,
              deleted.children.map((child) => child.id),
              deleted?.combo_type,
            ),
          );
        } else {
          dispatch(updateTransferBookings(deleted?.id));
        }
        onClose();
        dispatch(
          openNotification({
            type: "success",
            text: `${deleted?.name || "Booking"} deleted successfully`,
            heading: "Success!",
          }),
        );
      }
    } catch (error) {
      dispatch(
        openNotification({
          type: "error",
          text:
            error?.response?.data?.errors?.[0]?.message?.[0] || error?.message,
          heading: "Error!",
        }),
      );
    }
  };

  // "Change Hotel" hands off to the search drawer the itinerary already mounts,
  // via the URL contract it consumes.
  const handleChangeHotel = () => {
    onClose();
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          drawer: "changeHotelBooking",
          clickType: "Change",
          itineraryCityId: stay?.itinerary_city_id || "",
          booking_id: booking?.id,
          check_in: stay?.check_in || booking?.detail?.check_in || "",
          check_out: stay?.check_out || booking?.detail?.check_out || "",
          hotel_duration: stay?.duration || booking?.detail?.duration || "",
          city_id: stay?.city_id || "",
          city_name: stay?.city_name || "",
        },
      },
      undefined,
      { scroll: false, shallow: true },
    );
  };

  const handleAncillaryAdded = (added, replaceId) => {
    if (added?.id) dispatch(addAncillaryBooking(added, replaceId));
    else if (replaceId) dispatch(removeAncillaryBooking(replaceId));
    onClose();
  };

  const handleAncillaryRemoved = (removedId) => {
    if (removedId) dispatch(removeAncillaryBooking(removedId));
    onClose();
  };

  if (!booking || !type) return null;

  if (type === "transfer") {
    // A combo (roundtrip / multicity) booking carries its legs as children and
    // is fetched from a different path than a single-leg transfer.
    const bookingType = booking?.detail?.booking_type || "";
    const isCombo =
      booking?.detail?.transfer_type === "combo" || bookingType.includes(",");

    return (
      <TransferDrawer
        show
        booking_id={booking?.id}
        booking_type={
          bookingType.split(",")[0] ||
          (booking?.booking_type === "Flight" ? "Flight" : "Taxi")
        }
        combo={isCombo}
        isSightseeing={booking?.detail?.transfer_type === "sightseeing"}
        city={booking?.detail?.name}
        handleDelete={handleDeleteTransfer}
        getPaymentHandler={getPaymentHandler}
        setShowLoginModal={setShowLoginModal}
        drawerZIndex={CART_DRAWER_Z_INDEX}
        onClose={onClose}
      />
    );
  }

  if (type === "stay") {
    return (
      <AccommodationModal
        mercury
        show
        standalone
        id={booking?.id}
        booking={stay}
        index={stays?.findIndex?.((item) => item?.id === booking?.id)}
        city_id={stay?.city_id}
        provider={stay?.source}
        handleClickAc={handleChangeHotel}
        setShowLoginModal={setShowLoginModal}
        drawerZIndex={CART_DRAWER_Z_INDEX}
        onClose={onClose}
      />
    );
  }

  if (type === "activity") {
    return (
      <POIDetailsDrawer
        itineraryDrawer
        show
        showBookingDetail
        activityData={{ id: booking?.id, type: "activity" }}
        itinerary_city_id={activityCity?.id}
        name={booking?.detail?.name}
        removeDelete={false}
        setShowLoginModal={setShowLoginModal}
        getPaymentHandler={getPaymentHandler}
        drawerZIndex={CART_DRAWER_Z_INDEX}
        handleCloseDrawer={onClose}
      />
    );
  }

  if (type === "visa") {
    return (
      <VisaDetailDrawer
        show
        showManageActions
        visa={ancillary?.visa}
        bookingId={booking?.id}
        drawerZIndex={CART_DRAWER_Z_INDEX}
        onHide={onClose}
        onBooked={onClose}
        onAdded={handleAncillaryAdded}
        onRemoved={handleAncillaryRemoved}
      />
    );
  }

  return (
    <EsimDetailDrawer
      show
      showManageActions
      pkg={ancillary?.external_data?.package}
      bookingId={booking?.id}
      drawerZIndex={CART_DRAWER_Z_INDEX}
      onHide={onClose}
      onBooked={onClose}
      onAdded={handleAncillaryAdded}
      onRemoved={handleAncillaryRemoved}
    />
  );
};

export default CartBookingDetail;
