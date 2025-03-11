import React from "react";
import { IoMdTrain } from "react-icons/io";
import { FaCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const VehicleDetailModal = ({ data, onClose }) => {
  if (!data) return null;

  const { name, transfer_details, price, currency, number_of_adults, number_of_children, source_address, destination_address} = data;

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        weekday: "long",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };
  
  const addMinutesToDate = (dateString, minutes) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + minutes); // Add minutes to the departure date
    return formatDateTime(date.toISOString()); // Format the new date
  };
  
  const departure = transfer_details?.start_datetime; // Example departure date
  const duration = transfer_details?.duration; // Duration in minutes
  
  // Get the arrival based on the duration
  const arrival = addMinutesToDate(departure, duration);
  const depart = formatDateTime(departure);
  
  console.log("Departure:", formatDateTime(departure));
  console.log("Arrival:", arrival);
  

  return (
    <div className="fixed inset-0 bg-gray-50 w-full h-full flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center">
        <div className="bg-blue-100 rounded-lg p-2 mr-3">
          <span className="text-blue-600 text-xl">🚆</span>
        </div>
        <span className="text-xl font-semibold text-gray-800">{name}</span>
      </div>
      
      {/* Ticket Section Label */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-medium">My Ticket</h2>
      </div>
      
      {/* Scrollable Ticket Details */}
      <div className="flex-1 overflow-auto px-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm relative border border-gray-100">
          {/* Notch Cut Edges */}
          <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-gray-50 w-6 h-6 rounded-full"></div>
          <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-gray-50 w-6 h-6 rounded-full"></div>
          
          {/* Route Info */}
          <div className="flex justify-between">
            <div className="flex flex-col items-start">
              <div className="w-6 h-6 bg-green-500 rounded-full mb-2"></div>
              <div>
                <p className="font-bold text-lg">{source_address?.name}</p>
                <p className=" text-black opacity-50 text-[12px]">{depart?.time}</p>
                <p className="text-[12px] text-[#000000] opacity-50">{depart?.date}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-sm">{transfer_details?.distance} km</span>
              <div className="border-t border-dashed w-32 my-2"></div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="w-6 h-6 bg-red-500 rounded-full mb-1 self-end"></div>
              <div className="text-right">
                <p className="font-bold text-lg">{destination_address?.name}</p>
                <p className=" text-black opacity-50 text-[12px]">{arrival?.time}</p>
                <p className=" text-black opacity-50 text-[12px]">{arrival?.date}</p>
              </div>
            </div>
          </div>
          
          {/* Transfer Details */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-gray-400 font-medium text-sm">TRANSFER DETAILS</p>
            
            <div className="flex justify-between mt-4">
              <div>
                <p className="font-semibold text-lg">{number_of_adults} Adults, {number_of_children} Children</p>
                <p className="text-gray-500 text-sm">Passengers</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">{price} {currency}</p>
                <p className="text-gray-500 text-sm">Price</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="font-semibold text-lg">One way</p>
              <p className="text-gray-500 text-sm">Transfer way</p>
            </div>
          </div>
          
          {/* BOOKED Stamp */}
          {/* <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 rotate-12">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNTAgMTUwIj48Y2lyY2xlIGN4PSI3NSIgY3k9Ijc1IiByPSI3MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZWQiIHN0cm9rZS13aWR0aD0iNiIvPjx0ZXh0IHg9Ijc1IiB5PSI4NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0icmVkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CT09LRUQ8L3RleHQ+PHBhdGggZD0iTTMwLDQ1IEw0MCw2MCBMNjUsMzUiIHN0cm9rZT0icmVkIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNODUsNDUgTDk1LDYwIEwxMjAsMzUiIHN0cm9rZT0icmVkIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz48L3N2Zz4=" 
              alt="Booked" 
              className="w-24 h-24"
            />
          </div> */}
          
          {/* Profile Icon */}
          <div className="absolute bottom-6 right-6 bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow">
            <span className="font-semibold">D</span>
          </div>
        </div>
      </div>
      
      {/* Delete Booking Button (Fixed) */}
      <div className="p-4 border-t bg-white shadow-md">
        <button className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center">
          🗑 Delete Booking
        </button>
      </div>
    </div>
  );
};

export default VehicleDetailModal;
