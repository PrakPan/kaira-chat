import React from "react";
import {
  MdAirlineSeatReclineNormal,
  MdDirectionsCar,
  MdLocalGasStation,
  MdLuggage,
} from "react-icons/md";

/**
 * The booked car's specs, as FactList facts.
 *
 * Shared by the taxi drawer and the multi-city combo shell so the same four
 * facts appear in the same order with the same glyphs wherever a vehicle is
 * described. Model / fuel / bags / seats read as four identical grey lines
 * without the icons; with them the card is scannable at a glance.
 */
const glyph = (Icon) => <Icon size={14} color="#8a93a6" aria-hidden="true" />;

export const legVehicle = (leg) =>
  leg?.transfer_details?.quote?.taxi_category ||
  leg?.transfer_details?.quote?.vehicle ||
  null;

/**
 * Two legs describe the same car when the supplier gave them the same class and
 * model — worth knowing, because then the car only needs showing once.
 */
export const sameVehicle = (a, b) =>
  !!a && !!b && a.type === b.type && a.model_name === b.model_name;

export default function vehicleFacts(vehicle) {
  return [
    { label: "Model", value: vehicle?.model_name, icon: glyph(MdDirectionsCar) },
    { label: "Fuel type", value: vehicle?.fuel_type, icon: glyph(MdLocalGasStation) },
    { label: "Luggage bags", value: vehicle?.bag_capacity, icon: glyph(MdLuggage) },
    {
      label: "Seat capacity",
      value: vehicle?.seating_capacity,
      icon: glyph(MdAirlineSeatReclineNormal),
    },
  ];
}
