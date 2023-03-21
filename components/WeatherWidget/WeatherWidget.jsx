import styled from 'styled-components';
import { useState, useEffect } from 'react';
import ImageLoader from '../ImageLoader';
import { WeatherICon } from '../../helper/IconsFetcher';


const WeatherGrid = styled.div`
  display: grid;
  margin-top: 0.25rem;
  grid-template-columns: max-content max-content;
  grid-gap: 0.75rem;
`;
const TextBold = styled.p`
  line-height: 24px;
  font-weight: 600;
  margin: 0;
  color: rgb(1, 32, 43);
`;
const WeatherWidget = ({
  date,
  city,
  apiKey = 'e2fe4bf0d3954e25a493b899a559f43d',
}) => {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const forecast = data.list.find((item) => item.dt_txt.includes(date));

        if (forecast) {
          setWeather({
            temperature: forecast.main.temp,
            description: forecast.weather[0].description,
          });
        } else {
          setWeather(null);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setWeather(null);
        setIsLoading(false);
      });
  }, [date, city, apiKey]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!weather) {
    return <div>No forecast available for this date.</div>;
  }
  return (
    <WeatherGrid>
      {WeatherICon(item.weather.description)}

        
        
      
      <ImageLoader
        borderRadius="50%"
        url="media/website/grey.png"
        height="2rem"
        heightMobile="2rem"
        width="2rem"
        dimensionsMobile={{ width: 10, height: 10 }}
      ></ImageLoader>
      <div className="center-div">
        <TextBold>{weather.temperature} °C</TextBold>
        <TextBold>{weather.description}</TextBold>
      </div>
    </WeatherGrid>
  );
};

export default WeatherWidget;
