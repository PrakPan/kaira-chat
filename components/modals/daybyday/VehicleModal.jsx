import React from "react";
import { IoCar } from "react-icons/io5";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { IoMdTrain, IoMdBoat } from "react-icons/io";
import { FaBus, FaPen } from "react-icons/fa";
const VehicleDetailModal = ({ data }) => {
  if (!data) return null;

  const {
    name,
    transfer_details,
    price,
    currency,
    number_of_adults,
    number_of_children,
    check_in,
    source_address,
    destination_address,
  } = data;

  const correctIcon = (TransportMode) => {
    switch (TransportMode) {
      case "Flight":
        return <MdOutlineFlightTakeoff className="text-2xl" size={32} />;
      case "Taxi":
      case "Car":
        return <IoCar className="text-2xl" size={32} />;
      case "Train":
        return <IoMdTrain className="text-2xl" size={32} />;
      case "Ferry":
        return <IoMdBoat className="text-2xl" size={32} />;
      case "Bus":
        return <FaBus className="text-2xl" size={32} />;
      default:
        return null;
    }
  };
  return (
    <div className=" flex flex-col gap-4 bg-white p-4 ">
      <div className="text-xl font-semibold">{name}</div>
      <div className="flex justify-between p-4 rounded-lg shadow-md">
        <div>
          <div className="flex items-center gap-2 text-lg font-medium ">
            {correctIcon(data?.transfer_details?.mode)}
            <span>{source_address?.name}</span>
          </div>
          <div className="w-[150px]">
          {data?.transfer_details?.start_datetime &&
         new Date(data.transfer_details.start_datetime).toLocaleString("en-US", {
            weekday: "long", 
            year: "numeric",
            month: "long", 
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, 
          })}</div>
        </div>
        <div className="flex-grow border-t border-dashed border-gray-500 mx-4 mt-4"></div>
        <div>
          <div className="flex items-center gap-2 text-lg font-medium text-gray-700">
          {correctIcon(data?.transfer_details?.mode)}            <span>{destination_address?.name}</span>
          </div> <div className="w-[150px]">
          {data?.transfer_details?.start_datetime &&
            data?.transfer_details?.duration &&
            new Date(
              new Date(data.transfer_details.start_datetime).getTime() +
                data.transfer_details.duration * 60000 
            ).toLocaleString("en-US", {
              weekday: "long", 
              year: "numeric",
              month: "long", 
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true, 
            })}</div>
        </div>
      </div>

        
      <div className="flex flex-col gap-2 text-sm">
  <div className="w-fit py-2 mb-2 text-lg font-bold">Transfer Details</div>

  <div className="flex gap-1">
    <span className="font-medium">Passengers:</span> {number_of_adults} Adults, {number_of_children} Children
  </div>

  <div className="flex gap-1">
    <span className="font-medium">Price:</span> {price} {currency}
  </div>

  <div className="flex gap-1">
    <span className="font-medium">Distance:</span> {data?.transfer_details?.distance} KM
  </div>

  <div className="flex gap-1">
    <span className="font-medium">Transfer Type:</span> {data?.transfer_type}
  </div>
</div>

    </div>
  );
};

export default VehicleDetailModal;
