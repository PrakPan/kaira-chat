import React from "react";
import { ItineraryViewProps } from "../types";
import ItineraryShimmer from "./ItineraryShimmer";
import ItineraryContent from "./ItineraryContent";
import EmptyItinerary from "./EmptyItinerary";

const ItineraryView: React.FC<ItineraryViewProps> = ({
  itineraryData,
  transfers,
  showShimmer,
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white pb-[50px]">
      {showShimmer ? (
        <ItineraryShimmer />
      ) : itineraryData ? (
        <ItineraryContent itineraryData={itineraryData} transfers={transfers} />
      ) : (
        <EmptyItinerary />
      )}
    </div>
  );
};

export default ItineraryView;