import {TiWeatherSunny as clearsky} from 'react-icons/ti'
import {TiWeatherWindyCloudy as brokenclouds} from 'react-icons/ti';
import {TiWeatherPartlySunny as fewClouds} from 'react-icons/ti';
import {TiWeatherWindy as mist} from 'react-icons/ti';
import {TiWeatherStormy as rain} from 'react-icons/ti';
import {TiWeatherCloudy as scatteredclouds} from 'react-icons/ti';
import {TiWeatherShower as showerrain} from 'react-icons/ti';
import {TiWeatherSnow as snow} from 'react-icons/ti';


function weatherIconFetcher(weather){
  const Icons = {
    "clear sky": clearsky,
    "few clouds": fewClouds,
    "scattered clouds": scatteredclouds,
    "broken clouds": brokenclouds,
    "shower rain": showerrain,
    "rain": rain,
    "snow": snow,
    "mist": mist,
  };
  switch (weather) {
    case 'clear sky':
      return clearsky;

    case 'few clouds':
      return fewClouds;

    case 'scattered clouds' || 'Clouds':
      return scatteredclouds;
    case 'overcast clouds':
      return scatteredclouds;
    case 'broken clouds' || 'overcast clouds':
      return brokenclouds;

    case 'shower rain':
      return showerrain;

    case 'rain':
      return rain;

    case 'thunderstorm':
      return thunderstorm;

    case 'snow':
      return snow;

    case 'mist':
      return mist;

    default:
      return clearsky;
  }
}

export function WeatherICon(weather) {
 return weatherIconFetcher(weather)
}
