import { IoCar } from "react-icons/io5";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { IoMdTrain, IoMdBoat } from "react-icons/io";
import { FaBus } from "react-icons/fa";
import { MdTransferWithinAStation } from "react-icons/md";
import Image from "next/image";
import { useState } from "react";

export default function TransfersIcon({
  TransportMode,
  Instyle,
  classname,
  Multimode,
}) {
  switch (TransportMode) {
    case "Flight":
      return (
        <FlightIcon
          Instyle={Instyle}
          classname={classname}
          Multimode={Multimode}
        />
      );
    case "Taxi":
      return (
        <TaxiIcon
          Instyle={Instyle}
          classname={classname}
          Multimode={Multimode}
        />
      );
    case "Car":
      return <IoCar style={Instyle} className={classname} />;
    case "Train":
      return (
        <TrainIcon
          Instyle={Instyle}
          classname={classname}
          Multimode={Multimode}
        />
      );
    case "Ferry":
      return (
        <FerryIcon
          Instyle={Instyle}
          classname={classname}
          Multimode={Multimode}
        />
      );
    case "Bus":
      return (
        <BusIcon
          Instyle={Instyle}
          classname={classname}
          Multimode={Multimode}
        />
      );
    default:
      return <MdTransferWithinAStation style={Instyle} className={classname} />;
  }
}

const FlightIcon = ({ Instyle, classname, Multimode }) => {
  const [error, setError] = useState(false);
  if (error) {
    return <MdOutlineFlightTakeoff style={Instyle} />;
  }
  return (
    <Image
      src={`${
        Multimode
          ? "https://images.thetarzanway.com/media/icons/transfers/multi-mode/Vector.png"
          : "https://images.thetarzanway.com/media/icons/transfers/flight.png"
      } `}
      width={Multimode ? classname.width - 12 : classname.width}
      height={classname.height}
      alt="icon"
      onError={() => setError(true)}
      className=""
    />
  );
};

const TaxiIcon = ({ Instyle, classname }) => {
  const [error, setError] = useState(false);
  if (error) {
    return <IoCar style={Instyle} />;
  }
  return (
    <Image
      src="https://images.thetarzanway.com/media/icons/transfers/sedan-car.png"
      width={classname.width}
      height={classname.height}
      alt="icon"
      onError={() => setError(true)}
      className=""
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
      src="https://images.thetarzanway.com/media/icons/transfers/train.png"
      width={classname.width}
      height={classname.height}
      alt="icon"
      onError={() => setError(true)}
      className="lg:p-3 md:p-3 p-2"
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
      src="https://images.thetarzanway.com/media/icons/transfers/ferry.webp"
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
      src="https://images.thetarzanway.com/media/icons/transfers/bus.png"
      width={classname.width}
      height={classname.height}
      alt="icon"
      onError={() => setError(true)}
    />
  );
};
