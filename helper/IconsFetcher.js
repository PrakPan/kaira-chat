import {TiWeatherSunny } from 'react-icons/ti'
import {TiWeatherWindyCloudy } from 'react-icons/ti';
import {TiWeatherPartlySunny } from 'react-icons/ti';
import {TiWeatherWindy } from 'react-icons/ti';
import {TiWeatherStormy } from 'react-icons/ti';
import {TiWeatherCloudy } from 'react-icons/ti';
import {TiWeatherShower } from 'react-icons/ti';
import {TiWeatherSnow } from 'react-icons/ti';



 function WeatherICon(weather, style, ...props) {
  // const Icons = {
  //   "clear sky": clearsky,
  //   "few clouds": fewclouds,
  //   "scattered clouds": scatteredclouds,
  //   "broken clouds": brokenclouds,
  //   "shower rain": showerrain,
  //   "rain": rain,
  //   "snow": snow,
  //   "mist": mist,
  // };
  switch (weather) {
    case 'clear sky':
      return <TiWeatherSunny style={style} {...props} />;

    case 'few clouds':
      return <TiWeatherPartlySunny style={style} {...props}/>;

    case 'scattered clouds' || 'Clouds':
      return <TiWeatherCloudy style={style} {...props}/>;
    case 'overcast clouds':
      return <TiWeatherCloudy style={style} {...props}/>;
    case 'broken clouds' || 'overcast clouds':
      return <TiWeatherWindyCloudy style={style} {...props}/>;

    case 'shower rain':
      return <TiWeatherShower style={style} {...props}/>;

    case 'rain':
      return <TiWeatherStormy style={style} {...props}/>;

    case 'thunderstorm':
      return <TiWeatherSnow style={style} {...props}/>;

    case 'snow':
      return <TiWeatherSnow style={style} {...props}/>;

    case 'mist':
      return <TiWeatherWindy style={style} {...props}/>;

    default:
      return <TiWeatherSunny style={style} {...props}/>;
  } 
}

import React from 'react'

const IconsFetcher = ({weather,style,...props}) => {
  return (
    
      WeatherICon(weather,style)
  
  )
}

export default IconsFetcher