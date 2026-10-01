// Booking statuses as mercury sends them on the cart summary.
// "Confirmed" is a paid booking the supplier has also confirmed, so it counts
// as paid everywhere the cart asks "is this booking paid for?".
export const BOOKING_STATUS_PAID = "Paid";
export const BOOKING_STATUS_CONFIRMED = "Confirmed";
export const BOOKING_STATUS_CANCELLED = "Cancelled";

export const isBookingPaid = (status) =>
  status === BOOKING_STATUS_PAID || status === BOOKING_STATUS_CONFIRMED;
