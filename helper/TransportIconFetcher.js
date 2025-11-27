import { IoCar } from "react-icons/io5";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { IoMdTrain, IoMdBoat } from "react-icons/io";
import { FaBus } from "react-icons/fa";
import { MdTransferWithinAStation } from "react-icons/md";
import { MdLocalTaxi } from "react-icons/md";

export function TransportIconFetcher({ TransportMode, Instyle, classname ,color="black"}) {
  switch (TransportMode) {
    case "Flight":
      return <MdOutlineFlightTakeoff style={Instyle} className={classname} color={color}/>;
    case "Taxi":
      return <MdLocalTaxi style={Instyle} className={classname} color={color}/>;
    case "Rental":
      return <MdLocalTaxi style={Instyle} className={classname} color={color}/>;
    case "Car":
      return <IoCar style={Instyle} className={classname} color={color}/>;
    case "Train":
      return <IoMdTrain style={Instyle} className={classname} color={color}/>;
    case "Ferry":
      return <IoMdBoat style={Instyle} className={classname} color={color}/>;
    case "Bus":
      return <FaBus style={Instyle} className={classname} color={color}/>;
    default:
      return <MdTransferWithinAStation style={Instyle} className={classname} color={color}/>;
  }
}
