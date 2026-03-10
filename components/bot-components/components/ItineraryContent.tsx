// components/itinerary/ItineraryContent.tsx
import React, { useState, useEffect } from "react";
import CitySection from "./CitySection";
import TransferSection from "./TransferSection";
import ConfirmationModal, { ConfirmationDetails } from "./ConfirmationModal";
import { ItineraryData, TransfersData } from "../types";

interface ItineraryContentProps {
  itineraryData: ItineraryData;
  transfers: TransfersData | null;
  onSendMessage?: (message: string) => void;
  sidebarCollapsed?: boolean;
}

const ItineraryContent: React.FC<ItineraryContentProps> = ({
  itineraryData,
  transfers,
  onSendMessage,
  sidebarCollapsed = false,
}) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    console.log("ItineraryContent received onSendMessage:", !!onSendMessage);
  }, [onSendMessage]);

  const handleConfirmItinerary = (details: ConfirmationDetails) => {
    const message = `Yes confirm the itinerary. Here are my details:
Start Date: ${details.startDate}
Pax: ${details.adults} Adults, ${details.children} Children, ${details.infants} Infants
Start Location: ${details.startLocation}`;

    if (onSendMessage) {
      onSendMessage(message);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto p-6 pb-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            {itineraryData.name}
          </h1>
        </div>

        {itineraryData.routes?.map((route, routeIndex) => {
          const cityName = route.city.name;

          const outboundTransfer = transfers?.find(
            (t) => t.from_city === cityName
          );

          return (
            <div key={route.city.id} className="mb-1">
              <CitySection route={route} />
              {outboundTransfer && (
                <TransferSection transfer={outboundTransfer} />
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky footer button — stays at bottom of itinerary panel only */}
      <div className="flex-shrink-0 px-6 py-3 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] flex justify-center pb-4">
        <button
          onClick={() => setShowConfirmationModal(true)}
          className="w-fit px-3 py-[12px] bg-[#07213A] text-white font-medium rounded-lg hover:bg-[#0a2a4a] transition-colors text-sm md:text-[14px]"
        >
          Confirm Itinerary & View Prices →
        </button>
      </div>

      <ConfirmationModal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        itineraryName={itineraryData.name}
        onConfirm={handleConfirmItinerary}
      />
    </div>
  );
};

export default ItineraryContent;