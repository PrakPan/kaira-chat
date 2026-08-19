import React from "react";
import FactChips from "./FactChips";
import VehiclePhoto from "./VehiclePhoto";

/**
 * Every cab of a mixed fleet, each described as fully as a single-taxi booking is.
 *
 * A mixed booking has no "the taxi" to photograph: the quote's `taxi_category` holds only the
 * largest member, so the drawer's one-hero-photo layout describes one car and says nothing
 * about the rest. A booking ships the real composition on `fleet.vehicles`, where each entry
 * carries its own `taxi_category` — so the same photo + class/model/fuel/seats/bags block is
 * simply repeated once per cab.
 *
 * `vehicle.price` is deliberately not rendered. Booking-detail drawers describe what was
 * booked; what it costs is the cart's job, and a per-cab figure here would be a second,
 * competing price display the cart total has no way to reconcile with.
 *
 * Renders the vehicles it is handed, in the order the backend listed them; deciding whether a
 * fleet warrants this treatment at all is the caller's job (see `isMixedFleet`).
 */

const vehicleName = (category) => category?.model_name || category?.type || "Taxi";

export default function FleetVehicles({
  vehicles,
  mode = "Taxi",
  className = "mx-4 mb-4",
}) {
  const list = Array.isArray(vehicles) ? vehicles.filter(Boolean) : [];
  if (!list.length) return null;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {list.map((vehicle, index) => {
        const category = vehicle?.taxi_category || {};

        return (
          <article
            key={vehicle?.index ?? category?.id ?? index}
            className="rounded-2xl border-sm border-solid border-[#efede6] overflow-hidden"
          >
            <header className="px-3 pt-3 pb-2.5">
              <div className="font-mono text-[9px] font-500 uppercase tracking-[0.12em] text-[#8a93a6]">
                Taxi {index + 1} of {list.length}
              </div>
              <div className="text-[13.5px] font-600 text-[#0b1220] break-words">
                {vehicleName(category)}
              </div>
            </header>

            <VehiclePhoto
              image={category?.image}
              alt={vehicleName(category)}
              vehicleType={category?.type}
              modelName={category?.model_name}
              mode={mode}
              className="mx-3 mb-3"
            />

            <FactChips
              padded={false}
              className="px-3 pb-3"
              facts={[
                { label: "Class", value: category?.type },
                { label: "Model", value: category?.model_name },
                { label: "Fuel", value: category?.fuel_type },
                { label: "Seats", value: category?.seating_capacity },
                { label: "Bags", value: category?.bag_capacity },
                // How the group was split across the convoy — the one fact a
                // single-cab booking has no equivalent of.
                { label: "Travellers", value: vehicle?.pax },
              ]}
            />
          </article>
        );
      })}
    </div>
  );
}
