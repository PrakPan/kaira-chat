import React from "react";
import { IoMdTrain } from "react-icons/io";
import { FaCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import TransfersIcon from "../../../helper/TransfersIcon";
import Pin from "../../../containers/newitinerary/breif/route/Pin";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";

const VehicleDetailModal = ({ data, onClose }) => {
  if (!data) return null;
  console.log("Data",data);
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
  
  const handleDelete = async () =>{
   
     try {
         
          const response = await axiosDeleteBooking.delete(`${data?.itinerary_id}/bookings/${data?.booking_type?.toLowerCase()}/${data?.id}/`);
          if (response.data) {
           console.log("Deleted Booking",response.data);
          }
        } catch (err) {
          console.log(
            `[ERROR][ItineraryPage][axiosDeleteBooking:/Delete_Booking]`
          );
        }
  }

  return (
    <div className="fixed inset-0 bg-gray-50 w-full h-full flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center">
        <div className="bg-blue-100 rounded-lg p-2 mr-3">
          <TransfersIcon
                        TransportMode={transfer_details?.mode}
                        Instyle={{
                          fontSize: transfer_details.mode === "Bus" ? "2.5rem" : "3rem",
                          color: "black",
                        }}
                        classname={{ width: 80, height: 75 }}
          />
        </div>
        <span className="text-xl font-semibold text-gray-800">{name}</span>
      </div>
      
      {/* Ticket Section Label */}
      <div className="px-4 pt-2 pb-2">
        <h2 className="text-lg font-medium">My Ticket</h2>
      </div>
      
      {/* Scrollable Ticket Details */}
      <div className="flex-1  px-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm relative border border-gray-100">
          {/* Notch Cut Edges */}
          <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-gray-50 w-6 h-6 rounded-full"></div>
          <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-gray-50 w-6 h-6 rounded-full"></div>
          
          {/* Route Info */}
          <div className="flex justify-between">
            <div className="flex flex-col items-start">
              {/* <div className="w-6 h-6 bg-green-500 rounded-full mb-2"></div> */}
              <Pin pinColour={"green"} index={0} length={0}></Pin>
              <div>
                <p className="font-semibold text-md">{source_address?.name}</p>
                <p className=" text-black opacity-50 text-[12px]">{depart?.time}</p>
                <p className="text-[12px] text-[#000000] opacity-50">{depart?.date}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-sm">{transfer_details?.distance} km</span>
              <div className="border-t border-dashed w-64"></div>
            </div>
            
            <div className="flex flex-col items-end">
              {/* <div className="w-6 h-6 bg-red-500 rounded-full mb-1 self-end"></div> */}
              <Pin pinColour={"red"} index={0} length={0}></Pin>
              <div className="text-right">
                <p className="font-semibold text-md">{destination_address?.name}</p>
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
                <p className="font-semibold text-md">{number_of_adults} Adults, {number_of_children} Children</p>
                <p className="text-gray-500 text-sm">Passengers</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-md">{price} {currency}</p>
                <p className="text-gray-500 text-sm">Price</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="font-semibold text-md">One way</p>
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
      <div className="p-4  bg-white">
        <button className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center" onClick={handleDelete}>
          🗑 Delete Booking
        </button>
      </div>
    </div>
  //   <>
  //   <div className="flex items-center justify-center bg-gray-100 min-h-screen w-full">
  //     <div className="bg-white rounded-lg shadow-sm relative w-full p-5">
  //       {/* Header */}
  //       <div className="flex items-center relative mb-4">
  //         <div className="mr-3 w-10 h-10 bg-blue-500 rounded text-white flex items-center justify-center text-sm">
  //           <TransfersIcon
  //             TransportMode={transfer_details?.mode}
  //             Instyle={{
  //               fontSize: transfer_details.mode === "Bus" ? "2.5rem" : "3rem",
  //               color: "black",
  //             }}
  //             classname={{ width: 80, height: 75 }}
  //           />
  //         </div>
  //         <h2 className="text-xl font-bold text-gray-800">{name}</h2>
  //         <button className="ml-auto w-6 h-6 flex items-center justify-center">
  //           <span className="text-2xl text-gray-600">×</span>
  //         </button>
  //       </div>
  
  //       <div className="mt-2 mb-4">
  //         <p className="text-gray-600 font-medium">My Ticket</p>
  //       </div>
  
  //       <div className="bg-white rounded-lg p-4 mb-4 shadow-lg relative">
  //         <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-white w-6 h-6 rounded-full"></div>
  //         <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white w-6 h-6 rounded-full"></div>
          
  //         {/* Journey section */}
  //         <div className="flex items-center justify-between mb-6 relative">
  //           {/* Source */}
  //           <div className="flex flex-col items-center z-10">
  //             <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mb-2 text-white font-bold">
  //               •
  //             </div>
  //             <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded font-medium">
  //             {source_address?.name}
  //             </div>
  //           </div>
  
  //           {/* Dotted line with distance */}
  //           <div className="absolute top-3 left-16 right-16 flex items-center justify-center">
  //             <div className="w-full border-t-2 border-dashed border-gray-300"></div>
  //             <div className="absolute bg-gray-200 px-2 text-gray-500 text-sm rounded-lg">
  //             {transfer_details?.distance} km
  //             </div>
  //           </div>
  
  //           {/* Destination */}
  //           <div className="flex flex-col items-center z-10">
  //             <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center mb-2 text-white">
  //               •
  //             </div>
  //             <div className="font-medium">
  //             {destination_address?.name}
  //             </div>
  //           </div>
  //         </div>
  
  //         {/* Time section */}
  //         <div className="flex justify-between mb-4">
  //           <div>
  //             <p className="font-bold text-lg">{depart?.time}</p>
  //             <p className="text-gray-500 text-sm">{depart?.date}</p>
  //           </div>
  
  //           <div className="text-right">
  //             <p className="font-bold text-lg">{arrival?.time}</p>
  //             <p className="text-gray-500 text-sm">{arrival?.time}</p>
  //           </div>
  //         </div>
  
  //         {/* Details section */}
  //         <div className="border-t border-dashed border-gray-300 pt-4">
  //           <p className="text-gray-500 text-sm uppercase font-medium mb-2">TRANSFER DETAILS</p>
  
  //           <div className="flex justify-between mb-2">
  //             <div>
  //               <p className="font-bold">{number_of_adults} Adults, {number_of_children} Children</p>
  //               <p className="text-gray-500 text-sm">Passengers</p>
  //             </div>
  
  //             <div className="text-right">
  //               <p className="font-bold">{price} {currency}</p>
  //               <p className="text-gray-500 text-sm">Price</p>
  //             </div>
  //           </div>
  
  //           <div className="flex justify-between items-end">
  //             <div>
  //               <p className="font-bold">One way</p>
  //               <p className="text-gray-500 text-sm">Transfer way</p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  
  //   {/* Fixed bottom button */}
  //   <div className="p-2 fixed w-full left-0 bottom-0 z-10 bg-white">
  //     <button className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center" onClick={handleDelete}>
  //       🗑 Delete Booking
  //     </button>
  //   </div>
  // </>
  
  );
};

export default VehicleDetailModal;
