import { FaTaxi } from 'react-icons/fa';
import { MdOutlineFlightTakeoff } from 'react-icons/md';

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
      return <FaTaxi style={Instyle} className={classname} />;

    default:
      return <FaTaxi style={Instyle} className={classname} />;
  }
}
