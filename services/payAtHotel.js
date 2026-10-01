// ─────────────────────────────────────────────────────────────────────────────
//  Hotel taxes the traveller pays directly at the hotel (e.g. city tax).
//
//  Some suppliers (RateHawk) return taxes that are NOT part of the room price.
//  Mercury sends them per stay as `pay_at_hotel_taxes_total` on
//  `Cart.summary.Stays.bookings[]`, and per rate as `pay_at_hotel_taxes` /
//  `pay_at_hotel_taxes_total` on hotel-detail recommendations. They must be
//  shown separately and never added to the cart total.
// ─────────────────────────────────────────────────────────────────────────────

/** Sum of pay-at-hotel taxes across the cart's selected stays. */
export const getPayAtHotelTotal = (Cart) =>
  (Cart?.summary?.Stays?.bookings || [])
    .filter((booking) => booking?.selected !== false)
    .reduce(
      (sum, booking) => sum + (Number(booking?.pay_at_hotel_taxes_total) || 0),
      0,
    );

/** Replaces the "All Taxes & Fees Included" assurance when a stay has pay-at-hotel taxes. */
export const PAY_AT_HOTEL_TRIP_CONDITION = {
  icon: "/assets/trip-condition/trip-condition-1.svg",
  title: "Hotel Taxes Paid at the Hotel",
  subheading:
    "Some hotels charge local taxes or fees (such as city tax) that you pay directly at the hotel. They are listed with your stay and are not included in the total.",
};

/** Swap the all-taxes-included assurance for the pay-at-hotel one when needed. */
export const withPayAtHotelCondition = (conditions, Cart) =>
  getPayAtHotelTotal(Cart) > 0
    ? conditions.map((item) =>
        item.title === "All Taxes & Fees Included"
          ? PAY_AT_HOTEL_TRIP_CONDITION
          : item,
      )
    : conditions;
