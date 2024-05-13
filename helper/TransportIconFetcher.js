import { IoCar } from "react-icons/io5";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { IoMdTrain, IoMdBoat } from "react-icons/io";
import { FaBus } from "react-icons/fa";
import { MdTransferWithinAStation } from "react-icons/md";

export function TransportIconFetcher({ TransportMode, Instyle, classname }) {
  switch (TransportMode) {
    case "Flight":
      return <MdOutlineFlightTakeoff style={Instyle} className={classname} />;
    case "Taxi":
      return <IoCar style={Instyle} className={classname} />;
    case "Car":
      return <IoCar style={Instyle} className={classname} />;
    case "Train":
      return <IoMdTrain style={Instyle} className={classname} />;
    case "Ferry":
      return <IoMdBoat style={Instyle} className={classname} />;
    case "Bus":
      return <FaBus style={Instyle} className={classname} />;
    default:
      return <MdTransferWithinAStation style={Instyle} className={classname} />;
  }
}
