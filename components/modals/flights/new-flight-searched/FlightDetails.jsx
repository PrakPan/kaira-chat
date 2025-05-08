import styled from "styled-components";
import { FaPlane } from "react-icons/fa";
import { useState } from "react";

const DottedLine = styled.div`
  position: relative;
  height: 2px;
  width: 100%;
  color: #c5c1c1;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(to right, #c5c1c1 5px, transparent 5px);
    background-size: 9px 100%; /* Adjust this value to change the spacing between the dots */
  }
`;

const Circle = styled.div`
  border: 1px solid #c5c1c1;
  height: 10px;
  width: 10px;
  border-radius: 100%;
  background: #c5c1c1;
  position: absolute;
  z-index: 1;
  top: 50%;
  transform: translateY(-38%);
`;

const Plan = styled.div`
  position: absolute;
  left: 50%;
  top: 0%;
  transform: translate(-50%, -45%);
`;

export default function FlightDetails({
  segments,
  data,
  origin,
  destination,
  duration,
  isNonStop,
  numStops,
  setShowDetails,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const popupStyle = {
    display: isHovered ? "block" : "none",
    backgroundColor: "#2B2A2A",
    border: "1px solid #e5e7eb", // gray-200 equivalent
    borderRadius: "0.5rem",
    padding: "15px 30px",
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    marginTop: "7px",
  };

  function getTime(totalMinutes) {
    if (totalMinutes) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours ? hours + "h" : ""} ${minutes ? minutes + "m" : ""}`;
    }

    return totalMinutes;
  }

  return (
    <div className="lg:w-[100%] flex flex-col  gap-2  mt-4">
      <div className="flex flex-col items-center gap-2 text-[#C5C1C1]">
        <div
          className="w-full"
          style={{
            margin: "0",
            position: "relative",
            height: "0px",
            top: "50%",
          }}
        >
          <Circle style={{ left: 0 }} color="#C5C1C1" />
          <DottedLine color="#C5C1C1" />
          <Circle style={{ right: 0 }} />
          <Plan>
            <FaPlane style={{ fontSize: "1.25rem" }} />
          </Plan>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className=" flex flex-col items-center text-nowrap">
          <div className="text-[14px] font-semibold">
            {origin?.departure_time
              ? `${new Date(origin?.departure_time)
                  .getHours()
                  .toString()
                  .padStart(2, "0")}: ${new Date(origin?.departure_time)
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`
              : ""}
          </div>

          <div className="w-full text-[12px] text-gray-600 truncate text-center">
            ({origin?.city_code})
          </div>
        </div>

        {isNonStop || numStops == 0 ? (
          <div className="text-sm text-gray-600 text-[#C5C1C1]">Non-stop</div>
        ) : (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              setShowDetails((prev) => !prev);
              setIsHovered(false);
            }}
            className="relative"
          >
            <div className="text-sm text-blue cursor-pointer text-center max-w-[80%] md:max-w-[100%] mx-auto">
              {segments?.length - 1} stop{segments?.length - 1 !== 1 && "s"}
              {" via "}
              <span className="text-wrap">
                {segments?.map(
                  (segment, i) =>
                    i !== 0 && (
                      <span>
                        {i !== 1 ? ", " : " "}
                        {segment?.origin?.city_name}
                      </span>
                    )
                )}
              </span>
            </div>

            <div
              style={popupStyle}
              className="z-50 absolute -bottom-140 left-1/2 -translate-x-1/2 text-sm text-center flex flex-col gap-2 bg-[#2B2A2A]"
            >
              {data?.segments.map((segment, index) => {
                if (index == 0) return null;
                return (
                  <div className="mb-2 relative">
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-0 h-0 border-[10px] border-solid border-transparent border-b-red"></span>
                    <span className="absolute -top-[34px] left-1/2 -translate-x-1/2 w-0 h-0 border-[10px] border-solid border-transparent border-b-[#2B2A2A]"></span>
                    <div className="text-nowrap text-white">
                      Plane change ({segment?.airline.name},{" "}
                      {segment?.airline?.code}-{segment?.airline?.flight_number}
                      )
                    </div>
                    <div className="text-nowrap text-white">
                      Via {segment?.origin?.city_name} (
                      {segment.origin?.airport_code}){" "}
                      {getTime(segment?.ground_time)} layover
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center text-nowrap">
          <div className="text-[14px] font-semibold">
            {destination?.arrival_time
              ? `${new Date(destination?.arrival_time)
                  .getHours()
                  .toString()
                  .padStart(2, "0")}: ${new Date(destination?.arrival_time)
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`
              : ""}
          </div>

          <div className="w-full text-[12px] text-gray-600 truncate text-center">
            ({destination?.city_code})
          </div>
        </div>
      </div>
    </div>
  );
}
