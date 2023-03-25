 function WeatherIcon(weather) {
  switch (weather) {
    case '01':
      return 'media/icons/weather/clear-sky.png';

    case '02':
      return 'media/icons/weather/few-clouds.png';

    case '03':
      return 'media/icons/weather/scattered-clouds.png';

      case '04':
      return 'media/icons/weather/broken-clouds.png';

    case '09':
      return 'media/icons/weather/shower-rain.png';

    case '10':
      return 'media/icons/weather/rain.png';

    case '11':
      return 'media/icons/weather/thunderstorm.png';

    case '13':
      return 'media/icons/weather/snowman.png';

    case '50':
      return 'media/icons/weather/mist.png';

    default:
      return 'media/icons/weather/overcast-clouds.png';
  } 
}

import React from 'react'
import ImageLoader from '../ImageLoader';

const IconsFetcher = ({iconId}) => {
  return (  
    <ImageLoader url={WeatherIcon(iconId)} height="50px" width="100%"></ImageLoader> 
  )
}

export default IconsFetcher