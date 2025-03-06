import React from "react";
import { IoCar } from "react-icons/io5";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { IoMdTrain, IoMdBoat } from "react-icons/io";
import { FaBus, FaDotCircle } from "react-icons/fa";
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
      <div className="text-xl font-semibold flex gap-1">
        {correctIcon(data?.transfer_details?.mode)} {name}
      </div>
      <div className="flex items-center justify-between w-full">
        <FaDotCircle />

        <div className="flex-grow border-t border-dashed border-gray-500 mx-2"></div>

        <div className="flex justify-start w-[150px]">
          <FaDotCircle />
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <div>
          <div className="text-md font-medium">{source_address?.name}</div>
          <div className="w-[150px] text-sm">
            {data?.transfer_details?.start_datetime &&
              new Date(data.transfer_details.start_datetime).toLocaleString(
                "en-US",
                {
                  weekday: "long",
                }
              )}{" "}
            |{" "}
            {data?.transfer_details?.start_datetime &&
              new Date(data.transfer_details.start_datetime).toLocaleString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}
          </div>
          <div className="text-sm">
            {data?.transfer_details?.start_datetime &&
              new Date(data.transfer_details.start_datetime).toLocaleString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }
              )}
          </div>
        </div>

        <div>
          <div className="text-md font-medium">{destination_address?.name}</div>
          <div className="w-[150px] text-sm">
            {data?.transfer_details?.start_datetime &&
              data?.transfer_details?.duration &&
              new Date(
                new Date(data.transfer_details.start_datetime).getTime() +
                  data.transfer_details.duration * 60000
              ).toLocaleString("en-US", {
                weekday: "long",
              })}{" "}
            |{" "}
            {data?.transfer_details?.start_datetime &&
              data?.transfer_details?.duration &&
              new Date(
                new Date(data.transfer_details.start_datetime).getTime() +
                  data.transfer_details.duration * 60000
              ).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
          </div>
          <div className="text-sm">
            {data?.transfer_details?.start_datetime &&
              data?.transfer_details?.duration &&
              new Date(
                new Date(data.transfer_details.start_datetime).getTime() +
                  data.transfer_details.duration * 60000
              ).toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <div className="w-fit py-2 mb-2 text-lg font-bold">
          Transfer Details
        </div>

        <div className="flex gap-1">
          <span className="font-medium">Passengers:</span> {number_of_adults}{" "}
          Adults, {number_of_children} Children
        </div>

        <div className="flex gap-1">
          <span className="font-medium">Price:</span> {price} {currency}
        </div>

        <div className="flex gap-1">
          <span className="font-medium">Distance:</span>{" "}
          {data?.transfer_details?.distance} KM
        </div>

        <div className="flex gap-1">
          <span className="font-medium">Transfer Type:</span>{" "}
          {data?.transfer_type}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailModal;
