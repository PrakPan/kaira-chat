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
  sidebarCollapsed?: boolean; // Add this prop to know sidebar state
}

const ItineraryContent: React.FC<ItineraryContentProps> = ({
  itineraryData,
  transfers,
  onSendMessage,
  sidebarCollapsed = false, // Default to false if not provided
}) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    console.log("ItineraryContent received onSendMessage:", !!onSendMessage);
  }, [onSendMessage]);

  const handleConfirmItinerary = (details: ConfirmationDetails) => {
    // Format the message to send to chatbot
    const message = `Yes confirm the itinerary. Here are my details:
Start Date: ${details.startDate}
Pax: ${details.adults} Adults, ${details.children} Children, ${details.infants} Infants
Start Location: ${details.startLocation}
Hotel Preferences: ${details.hotelPreference}`;

    console.log("Sending to chatbot:", message);
    
    if (onSendMessage) {
      console.log("onSendMessage exists, sending...");
      onSendMessage(message);
    } else {
      console.log("onSendMessage is not available");
    }
  };

  // Calculate left margin based on sidebar state
  const sidebarWidth = sidebarCollapsed ? '80px' : '250px';
  const chatPanelWidth = '400px';

  return (
    <div className="p-6 pb-24 relative min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">
          {itineraryData.name}
        </h1>
      </div>

      {itineraryData.routes?.map((route, routeIndex) => {
        const cityName = route.city.name;

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

      {/* Fixed bottom button - positioned to avoid sidebar and chat panel */}
      <div className="fixed bottom-14 left-0 w-full pointer-events-none">
        <div 
          className="px-6 pointer-events-auto transition-all duration-300"
          style={{ 
            marginLeft: "150px",
            width: `400px`,
            marginBottom: "10px",

          }}
        >
          <button
            onClick={() => setShowConfirmationModal(true)}
            className="w-full px-3 py-3 bg-[#07213A] text-white font-medium rounded-lg hover:bg-[#0a2a4a] transition-colors text-sm shadow-lg"
          >
            Confirm Itinerary & View Prices →
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
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