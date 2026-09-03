import React from "react";
import { MdOutlineLuggage } from "react-icons/md";
import { PiGasPumpFill, PiUsersThreeFill } from "react-icons/pi";

/**
 * What one cab holds — seats, bags, fuel — as a row of glyph-and-value facts.
 *
 * One component because every taxi list states the same four things and they
 * had drifted apart: the suggestion cards read "3 seats · 2 bags · Petrol" off
 * icons while the search results read "3-seater · 2 Luggage bags" with the fuel
 * type parenthesised into the taxi's name, so the same cab described itself
 * differently depending on which drawer found it.
 *
 * Every fact drops out when the supplier does not state it, so a sparse quote
 * renders a shorter row rather than a row of blanks. `perTaxi` adds the caveat
 * the convoy layouts need: with more than one cab these numbers describe one of
 * them, not the fleet.
 */
const Fact = ({ icon: Icon, children }) =>
  children ? (
    <span className="flex items-center gap-1 whitespace-nowrap">
      <Icon size={15} className="text-[#8a93a6]" style={{ flex: "none" }} />
      {children}
    </span>
  ) : null;

const VehicleSpecs = ({ category, perTaxi = false, className = "" }) => {
  const bags = category?.bag_capacity || category?.bagCapacity;
  const bigBags = category?.bigBagCapaCity;

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 ttw-type-small text-[#445069] ${className}`}
    >
      <Fact icon={PiUsersThreeFill}>
        {category?.seating_capacity ? `${category.seating_capacity} seats` : null}
      </Fact>
      <Fact icon={MdOutlineLuggage}>{bags ? `${bags} bags` : null}</Fact>
      <Fact icon={MdOutlineLuggage}>
        {bigBags ? `${bigBags} big bags` : null}
      </Fact>
      <Fact icon={PiGasPumpFill}>{category?.fuel_type || null}</Fact>
      {perTaxi ? <span>(per taxi)</span> : null}
    </div>
  );
};

export default VehicleSpecs;
