import React from "react";
import { IoCar } from "react-icons/io5";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { IoMdTrain, IoMdBoat } from "react-icons/io";
import { FaBus } from "react-icons/fa";
import { RiArrowDropRightLine } from "react-icons/ri";


interface TransferLeg {
  from_city: string;
  to_city: string;
  legs: string[];
}

interface TransferSectionProps {
  transfer: TransferLeg;
}

// Exact same icon logic as CityItem's correctIcon
function correctIcon(transportMode: string | undefined) {
  switch (transportMode?.toLowerCase()) {
    case "flight":
      return (
        <MdOutlineFlightTakeoff
          className="text-2xl text-[#a5a5a5]"
          size={16}
          color={"#a5a5a5"}
        />
      );
    case "taxi":
    case "car":
      return <IoCar className="text-2xl" size={16} color={"#a5a5a5"} />;
    case "train":
      return <IoMdTrain className="text-2xl" size={16} color={"#a5a5a5"} />;
    case "ferry":
      return <IoMdBoat className="text-2xl" size={16} color={"#a5a5a5"} />;
    case "bus":
      return <FaBus className="text-2xl text-[#a5a5a5]" size={14} color={"#a5a5a5"} />;
    default:
      return null;
  }
}

// Exact same extractMode logic as CityItem
function extractMode(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("flight")) return "Flight";
  if (lowerText.includes("train")) return "Train";
  if (lowerText.includes("bus")) return "Bus";
  if (lowerText.includes("taxi") || lowerText.includes("car")) return "Car";
  if (lowerText.includes("ferry")) return "Ferry";
  return "";
}

const TransferSection: React.FC<TransferSectionProps> = ({ transfer }) => {
  const legs = transfer.legs ?? [];
  const isMultiLeg = legs.length > 1;
  //  const isDesktop = useMediaQuery("(min-width:767px)");

  return (
    <div className="flex items-center gap-2 px-3 py-4 flex-wrap">
      {/* Icons — multi-leg shows chain with arrows, exactly like CityItem children map */}
      <div className="mt-[1px] flex items-center">
        {isMultiLeg ? (
          legs.map((leg, i) => {
            const mode = extractMode(leg);
            return (
              <React.Fragment key={i}>
                {correctIcon(mode)}
                {i < legs.length - 1 && (
                  <RiArrowDropRightLine size={18} color={"#a5a5a5"} />
                )}
              </React.Fragment>
            );
          })
        ) : (
          correctIcon(extractMode(legs[0] ?? ""))
        )}
      </div>

      {/* Route */}
      {/* <span className="text-base font-[500]">
        {transfer.from_city} → {transfer.to_city}
      </span> */}

      {/* Legs as comma-separated */}
      {legs.length > 0 && (
        <>
          <span className=" text-sm">·</span>
          <span className={"Body1M_16"}>
            {legs.join(", ")}
          </span>
        </>
      )}
    </div>
  );
};

export default TransferSection;