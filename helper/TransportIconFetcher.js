import { IoCar } from 'react-icons/io5';
import { MdOutlineFlightTakeoff } from 'react-icons/md';
import { IoMdTrain, IoMdBoat } from 'react-icons/io';
export function TransportIconFetcher({ TransportMode, Instyle, classname }) {
  // const Icons = {
  //   "clear sky": clearsky,
  //   "few clouds": fewClouds,
  //   "scattered clouds": scatteredclouds,
  //   "broken clouds": brokenclouds,
  //   "shower rain": showerrain,
  //   rain: rain,
  //   thunderstorm: thunderstorm,
  //   snow: snow,
  //   mist: mist,
  // };
  switch (TransportMode) {
    case 'Flight':
      return <MdOutlineFlightTakeoff style={Instyle} className={classname} />;

    case 'Taxi':
      return <IoCar style={Instyle} className={classname} />;
    case 'Train':
      return <IoMdTrain style={Instyle} className={classname} />;
    case 'Ferry':
      return <IoMdBoat style={Instyle} className={classname} />;
    default:
      return <IoCar style={Instyle} className={classname} />;
  }
}
