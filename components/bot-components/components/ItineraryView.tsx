// components/itinerary/ItineraryView.tsx
import React from "react";
import { ItineraryViewProps } from "../types";
import ItineraryShimmer from "./ItineraryShimmer";
import ItineraryContent from "./ItineraryContent";
import EmptyItinerary from "./EmptyItinerary";

interface ExtendedItineraryViewProps extends ItineraryViewProps {
  onSendMessage?: (message: string) => void;
}

const ItineraryView: React.FC<ExtendedItineraryViewProps> = ({
  itineraryData,
  transfers,
  showShimmer,
  onSendMessage,
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white pb-[50px]">
      {showShimmer ? (
        <ItineraryShimmer />
      ) : itineraryData ? (
        <ItineraryContent 
          itineraryData={itineraryData} 
          transfers={transfers} 
          onSendMessage={onSendMessage}
        />
      ) : (
        <EmptyItinerary />
      )}
    </div>
  );
};

export default ItineraryView;