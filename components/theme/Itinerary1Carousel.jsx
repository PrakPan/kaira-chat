import React, { useState } from "react";
import { FaArrowRight, FaHotel, FaPlane, FaTicketAlt, FaCar } from "react-icons/fa";
import SecondaryHeading from "../heading/Secondary";
import { IoBed } from "react-icons/io5";

const Itinerary1Carousel = () => {
  const [activeFeature, setActiveFeature] = useState(null);

  const cities = ["City 1 (2 N)", "City 2 (2 N)", "City 3 (2 N)"];
  const features = [
    { icon: <FaHotel />, label: "4 Star Stay", details: ["Luxury rooms", "Complimentary breakfast"] },
    { icon: <FaCar />, label: "4 Transfers", details: ["Airport pickup/drop", "City tours"] },
    { icon: <FaPlane />, label: "0 Flights", details: ["No flights included"] },
    { icon: <FaTicketAlt />, label: "4 Activities", details: ["Guided tours", "Cultural experiences"] },
  ];

  return (
    <div className="max-w-sm rounded-lg shadow-lg overflow-hidden border relative">
      {/* Image Section */}
      <div className="relative">
        <img
          src="https://via.placeholder.com/400x300"
          alt="Santorini, Greece"
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2  right-2 bg-yellow-400 text-black font-semibold px-3 py-1 rounded-lg">
        <span>  <IoBed/>  7 Days/6 Nights</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">Santorini, Greece</h2>
        <div className="flex items-center gap-2 text-gray-600 mt-2 text-sm">
          {cities.map((city, index) => (
            <React.Fragment key={index}>
              <span>{city}</span>
              {index !== cities.length - 1 && <FaArrowRight />}
            </React.Fragment>
          ))}
        </div>

        <div className="border-b border-gray-300 my-4"></div>

        <div className="flex justify-between items-center mt-4 text-gray-700 text-sm">
          {features.map((feature, index) => (
            <div className="flex flex-col md:text-[12px]">
            <div
              key={index}
              className={`flex flex-col items-center gap-2 cursor-pointer ${
                activeFeature === index ? "text-yellow-500" : ""
              }`}
              onClick={() => setActiveFeature(index)}
            >
              {feature.icon} 
              
            </div>
            <SecondaryHeading>{feature.label}</SecondaryHeading>
            </div>
          ))}
        </div>

        {activeFeature !== null && (
          <ul className="mt-4 list-disc list-inside text-gray-600">
            {features[activeFeature].details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        )}

        <div className="border-b border-gray-300 my-4"></div>

        <p className="text-gray-800 font-semibold text-lg mt-4">
          From ₹25,000 per person.
        </p>

        <button className="w-full mt-4 bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-500 transition">
          View Details
        </button>
      </div>
    </div>
  );
};

export default Itinerary1Carousel;
