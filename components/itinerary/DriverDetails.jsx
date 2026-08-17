import React, { useState } from "react";
import { PulseLoader } from "react-spinners";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdRefresh } from "react-icons/md";
import { fetchTaxiDriverDetails } from "../../services/bookings/TaxiDriverDetails";

/**
 * Driver and vehicle for a confirmed Mozio taxi transfer.
 *
 * Two things shape this component:
 *
 * 1. **A driver is assigned close to pickup**, not at booking. So "nobody assigned yet" is
 *    the ordinary answer for most of a booking's life and is rendered as information, never
 *    as an error. Mercury returns `{success: true, assigned: false}` for it (including when
 *    Mozio answers 404).
 * 2. **One request per taxi is wasteful on an itinerary page** with several transfers, so
 *    nothing is fetched on mount. Mercury snapshots the driver onto the booking whenever it
 *    sees one, and that snapshot arrives with the booking as
 *    `transfer_details.mozio.driver_details` - so the collapsed row can show the driver
 *    immediately, and the live call happens only when the traveller expands or refreshes.
 *
 * Renders nothing unless the booking is a Mozio taxi with a reservation: mercury has no
 * driver endpoint for any other source, and asking before a reservation exists can only
 * return `not_confirmed`.
 */
const DriverDetails = ({ booking, token }) => {
  const mozio = booking?.transfer_details?.mozio || {};
  const snapshot = mozio?.driver_details || null;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [details, setDetails] = useState(snapshot);
  const [fetched, setFetched] = useState(false);

  const isMozio = String(booking?.booking_source || "").toLowerCase() === "mozio";
  // A reservation must exist upstream before there is anything to ask about. Either field
  // means mercury stamped a confirmed reservation.
  const hasReservation = Boolean(mozio?.reservation_id || mozio?.confirmation_number);

  if (!isMozio || !hasReservation) return null;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchTaxiDriverDetails(booking.id, token);
      const data = response?.data || {};
      setDetails({
        assigned: Boolean(data.assigned),
        status: data.status,
        driver: data.driver || {},
        vehicle: data.vehicle || {},
        fetched_at: data.fetched_at,
      });
      setFetched(true);
    } catch (err) {
      // Mercury sends the last snapshot it had alongside a supplier failure, so a brief
      // Mozio outage still shows the traveller their driver instead of an empty panel.
      const data = err?.response?.data;
      if (data?.stored) setDetails(data.stored);
      setError(
        data?.message ||
          "Driver details are unavailable right now. Please try again shortly.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    // Refresh on first expand even when a snapshot is already on screen - the stored copy
    // can be hours old, and a driver may have been assigned or changed since.
    if (next && !fetched && !loading) load();
  };

  const driver = details?.driver || {};
  const vehicle = details?.vehicle || {};
  const assigned = Boolean(details?.assigned);

  const vehicleLine = [vehicle.manufacturer, vehicle.model]
    .filter(Boolean)
    .join(" ");
  const vehicleMeta = [vehicle.color, vehicle.vehicle_type]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mt-2 w-full rounded-xl border border-[#ECEAEA] bg-[#FAFAF7] px-3 py-2">
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between gap-2 bg-transparent border-0 p-0 cursor-pointer text-left"
      >
        <span className="flex flex-col">
          <span className="text-[13px] font-600 text-[#01202B]">
            Driver &amp; vehicle
          </span>
          <span className="text-[12px] text-[#7A7A7A]">
            {assigned && driver.name
              ? `${driver.name}${vehicleLine ? ` · ${vehicleLine}` : ""}`
              : "Assigned closer to your pickup time"}
          </span>
        </span>
        {open ? (
          <MdKeyboardArrowUp size={18} />
        ) : (
          <MdKeyboardArrowDown size={18} />
        )}
      </button>

      {open ? (
        <div className="mt-2 border-t border-dashed border-[#E4E2DC] pt-2">
          {loading && !details ? (
            <div className="py-2">
              <PulseLoader size={7} speedMultiplier={0.6} color="#111" />
            </div>
          ) : null}

          {assigned ? (
            <div className="flex items-start gap-3">
              {driver.image_url ? (
                <img
                  src={driver.image_url}
                  alt={driver.name || "Driver"}
                  className="h-12 w-12 rounded-full object-cover shrink-0"
                  style={{ margin: 0 }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : null}
              <div className="min-w-0 flex-1 text-[13px] text-[#01202B]">
                {driver.name ? (
                  <div className="font-600">{driver.name}</div>
                ) : null}
                {driver.phone ? (
                  <div>
                    <a
                      href={`tel:${driver.phone}`}
                      className="text-[#0b5cab] underline"
                    >
                      {driver.phone}
                    </a>
                  </div>
                ) : null}
                {driver.license_number ? (
                  <div className="text-[12px] text-[#7A7A7A]">
                    {`Licence ${driver.license_number}`}
                  </div>
                ) : null}

                {vehicleLine || vehicle.plate || vehicleMeta ? (
                  <div className="mt-1">
                    {vehicleLine ? <div>{vehicleLine}</div> : null}
                    {vehicle.plate ? (
                      <div className="font-mono font-600 tracking-wide">
                        {vehicle.plate}
                      </div>
                    ) : null}
                    {vehicleMeta ? (
                      <div className="text-[12px] text-[#7A7A7A]">
                        {vehicleMeta}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          ) : !loading ? (
            <div className="text-[12px] text-[#445069]">
              Your driver has not been assigned yet. Details usually appear a few
              hours before pickup.
            </div>
          ) : null}

          {error ? (
            <div className="mt-2 text-[12px] text-[#a4442f]">{error}</div>
          ) : null}

          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="mt-2 flex items-center gap-1 bg-transparent border-0 p-0 text-[12px] font-600 text-[#0b1220] cursor-pointer disabled:opacity-50"
          >
            <MdRefresh size={14} />
            {loading ? "Checking..." : "Refresh"}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default DriverDetails;
