import React from "react";
import CitySection from "./CitySection";
import TransferSection from "./TransferSection";
import { ItineraryData, TransfersData } from "../types";


interface ItineraryContentProps {
  itineraryData: ItineraryData;
  transfers: TransfersData | null;
}

const ItineraryContent: React.FC<ItineraryContentProps> = ({
  itineraryData,
  transfers,
}) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-2 text-gray-800">
          {itineraryData.name}
        </h1>
      </div>

      {itineraryData.routes?.map((route, routeIndex) => {
  const cityName = route.city.name; // adjust if your shape differs

  // Find a transfer that DEPARTS from this city
  const outboundTransfer = transfers?.find(
    (t) => t.from_city === cityName
  );

  return (
    <div key={route.city.id} className="mb-1">
      <CitySection route={route} />

      {/* Show transfer arrow leading OUT of this city to the next */}
      {outboundTransfer && (
        <TransferSection transfer={outboundTransfer} />
      )}
    </div>
  );
})}
    </div>
  );
};

export default ItineraryContent;