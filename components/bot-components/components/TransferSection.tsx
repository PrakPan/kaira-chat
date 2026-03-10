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

function correctIcon(transportMode: string | undefined) {
  switch (transportMode?.toLowerCase()) {
    case "flight":
      return <MdOutlineFlightTakeoff size={18} color={"#a5a5a5"} />;
    case "taxi":
    case "car":
      return <IoCar size={16} color={"#a5a5a5"} />;
    case "train":
      return <IoMdTrain size={16} color={"#a5a5a5"} />;
    case "ferry":
      return <IoMdBoat size={16} color={"#a5a5a5"} />;
    case "bus":
      return <FaBus size={16} color={"#a5a5a5"} />;
    default:
      return null;
  }
}

function extractMode(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("flight")) return "Flight";
  if (lower.includes("train")) return "Train";
  if (lower.includes("bus")) return "Bus";
  if (lower.includes("taxi") || lower.includes("car")) return "Car";
  if (lower.includes("ferry")) return "Ferry";
  return "";
}

const TransferSection: React.FC<TransferSectionProps> = ({ transfer }) => {
  const legs = transfer.legs ?? [];
  const isMultiLeg = legs.length > 1;

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Vertical dotted line — matches CityItem's VerticalLine (2px wide, dashed) */}
      <div className="flex flex-col items-center self-stretch flex-shrink-0">
        <div
          style={{
            width: "2px",
            flex: 1,
            borderLeft: "2px dashed #DDDDDD",
            minHeight: "60px",
          }}
        />
      </div>

      {/* Transfer info — icon(s) + legs, same as CityItem booking row */}
      <div className="flex gap-1 items-center py-1">
        <div className="flex items-center">
          {isMultiLeg ? (
            legs.map((leg, i) => (
              <React.Fragment key={i}>
                {correctIcon(extractMode(leg))}
                {i < legs.length - 1 && (
                  <RiArrowDropRightLine size={18} color={"#a5a5a5"} />
                )}
              </React.Fragment>
            ))
          ) : (
            correctIcon(extractMode(legs[0] ?? ""))
          )}
        </div>
        {legs.length > 0 && (
          <span className="text-[16px] font-[500]">{legs.join(", ")}</span>
        )}
      </div>
    </div>
  );
};

export default TransferSection;