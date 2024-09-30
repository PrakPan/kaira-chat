import styled from "styled-components";
import { FaPlane } from "react-icons/fa";


const DottedLine = styled.div`
  position: relative;
  height: 2px;
  width: 100%;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(to right, #7a7a7a 5px, transparent 5px);
    background-size: 9px 100%; /* Adjust this value to change the spacing between the dots */
  }
`;

const Circle = styled.div`
  border: 1px solid #7a7a7a;
  height: 10px;
  width: 10px;
  border-radius: 100%;
  background: white;
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

export default function FlightDetails({ origin, destination, duration, isNonStop, numStops }) {
    function getTime(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}h:${formattedMinutes}m`;
    }

    return (
        <div className="lg:w-[40%] flex flex-row gap-2 items-center justify-between">
            <div className="flex flex-col items-center">
                <div className="text-lg font-bold">
                    {new Date(origin.departure_time).getHours().toString().padStart(2, '0')}:
                    {new Date(origin.departure_time).getMinutes().toString().padStart(2, '0')}
                </div>
                <div className="text-sm">
                    {origin.city_name}
                </div>
            </div>

            <div className="w-full flex flex-col items-center gap-2">
                {duration ? (
                    <div className="text-sm text-gray-600">{getTime(duration)}</div>
                ) : null}

                <div
                    className="w-full"
                    style={{
                        margin: "0",
                        position: "relative",
                        height: "0px",
                        top: "50%",
                    }}
                >
                    <Circle style={{ left: 0 }} />
                    <DottedLine />
                    <Circle style={{ right: 0 }} />
                    <Plan>
                        <FaPlane style={{ fontSize: "1.25rem" }} />
                    </Plan>
                </div>

                {isNonStop ? (
                    <div className="text-sm text-gray-600">Nonstop</div>
                ) : (<div className="text-sm text-gray-600">{numStops} stop{numStops > 1 ? 's' : null }</div>)}
            </div>


            <div className="flex flex-col items-center">
                <div className="text-lg font-bold">
                    {new Date(destination.arrival_time).getHours().toString().padStart(2, '0')}:
                    {new Date(destination.arrival_time).getMinutes().toString().padStart(2, '0')}
                </div>

                <div className="text-sm">
                    {destination.city_name}
                </div>

            </div>
        </div>
    );
}
