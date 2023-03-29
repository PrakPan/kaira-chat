import styled from 'styled-components';
import { useState, useEffect } from 'react';
import IconsFetcher from './IconsFetcher';
import SkeletonCard from '../ui/SkeletonCard';


const WeatherGrid = styled.div`
  display: grid;
  margin-top: 1rem;
  grid-template-columns: max-content max-content;
  grid-gap: 0.75rem;
  height : 50px;
`;
const TextBold = styled.p`
  line-height: 24px;
  font-weight: 600;
  margin: 0;
  color: rgb(1, 32, 43);
`;
const WeatherWidget = ({
  
  city,
  cnt=7,
  apiKey = 'e2fe4bf0d3954e25a493b899a559f43d',
}) => {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weatherText ,  setWeatherText] = useState(null)

  useEffect(() => {
    
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${cnt}&units=metric&appid=${apiKey}`;
    
    setIsLoading(true)
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const tempArr = data.list.map((e)=>Math.floor(e.main.temp))
        const weatherObj = {minTemp : Math.min(...tempArr) , maxTemp : Math.max(...tempArr) , description: data.list[0].weather[0].description , icon : data.list[0].weather[0].icon.slice(0,2)}
        setWeather(weatherObj)
        setIsLoading(false);
      })
      .catch((error) => {
        setWeather(null);
        setIsLoading(false);
      });

      const today = new Date()
      const post = new Date(new Date().setDate(new Date().getDate() + 7))
      const [,todayMonth,todayDate,todayYear] = today.toString().split(' ')
      const [,postMonth,postDate,postYear] = post.toString().split(' ')
      setWeatherText(`Weather (${todayDate} ${todayMonth} ${postYear!=todayYear ? todayYear : ''} - ${postDate} ${postMonth} ${postYear})`)
  
  }, [city, apiKey]);

  if (isLoading) {
    return <div><SkeletonCard height='1.6rem' width='16rem'></SkeletonCard><SkeletonCard mt='1rem' height='4rem' width='10rem'></SkeletonCard>
    </div>;
  }

  if (!weather) {
    return <div>No forecast available for this date.</div>;
  }
  return (
    <div>

    {weatherText &&<TextBold>{weatherText}</TextBold>}
     <WeatherGrid>
      {weather.icon && <IconsFetcher iconId={weather.icon} />}    
      <div>
       {weather.minTemp && weather.maxTemp && <TextBold>{weather.minTemp}°C - {weather.maxTemp}°C</TextBold>}
        {weather.description && <p style={{fontWeight : '300'}}>{weather.description}</p>}
      </div>
    </WeatherGrid>
    
    </div>
   
  );
};

export default WeatherWidget;
