import { IoCar } from "react-icons/io5";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { IoMdTrain, IoMdBoat } from "react-icons/io";
import { FaBus } from "react-icons/fa";
import { MdTransferWithinAStation } from "react-icons/md";
import Image from "next/image";
import { useState } from "react";

export default function TransfersIcon({ TransportMode, Instyle, classname }) {
  switch (TransportMode) {
    case "Flight":
      return <MdOutlineFlightTakeoff style={Instyle} className={classname} />;
    case "Taxi":
      return <TaxiIcon Instyle={Instyle} classname={classname} />;
    case "Car":
      return <IoCar style={Instyle} className={classname} />;
    case "Train":
      return <TrainIcon Instyle={Instyle} classname={classname} />;
    case "Ferry":
      return <FerryIcon Instyle={Instyle} classname={classname} />;
    case "Bus":
      return <BusIcon Instyle={Instyle} classname={classname} />;
    default:
      return <MdTransferWithinAStation style={Instyle} className={classname} />;
  }
}

const TaxiIcon = ({ Instyle, classname }) => {
  const [error, setError] = useState(false);
  if (error) {
    return <IoCar style={Instyle} />;
  }
  return (
    <Image
      src="/assets/icons/transfers/car.svg"
      width={classname.width}
      height={classname.height}
      alt="icon"
      onError={() => setError(true)}
      className="bg-red-200"
    />
  );
};

const TrainIcon = ({ Instyle, classname }) => {
  const [error, setError] = useState(false);
  if (error) {
    return <IoMdTrain style={Instyle} />;
  }
  return (
    <Image
      src="/assets/icons/transfers/train.svg"
      width={classname.width}
      height={classname.height}
      alt="icon"
      onError={() => setError(true)}
    />
  );
};

const FerryIcon = ({ Instyle, classname }) => {
  const [error, setError] = useState(false);
  if (error) {
    return <IoMdBoat style={Instyle} />;
  }
  return (
    <Image
      src="/assets/icons/transfers/ferry.svg"
      width={classname.width}
      height={classname.height}
      alt="icon"
      onError={() => setError(true)}
    />
  );
};

const BusIcon = ({ Instyle, classname }) => {
  const [error, setError] = useState(false);
  if (error) {
    return <FaBus style={Instyle} />;
  }
  return (
    <Image
      src="/assets/icons/transfers/bus.svg"
      width={classname.width}
      height={classname.height}
      alt="icon"
      onError={() => setError(true)}
    />
  );
};
