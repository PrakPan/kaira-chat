<<<<<<< HEAD
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import ImageLoader from '../../../../components/ImageLoader';
   const Container = styled.div`

`;
const Heading = styled.p`
    font-size: 18px;
    font-weight: 600;
`;
const CityText = styled.p`
font-size: 18px;
    font-weight: 400;
    margin: 0;
    line-height: 1.5;
   color:  rgba(1, 32, 43, 1);
   overflow: hidden;
 text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 3;
-webkit-box-orient: vertical;
`;
const GridContainer = styled.div`
display: grid;
grid-template-columns: 1fr 2fr;
grid-gap: 0.5rem;
margin-bottom: 0.75rem;

`;
const TextBold =  styled.p`
    line-height: 24px;
    font-weight: 600;
    margin: 0;
    color: rgb(1, 32, 43);
`;

const TextLight = styled.p`
line-height: 24px;
margin: 0;

`;
const WeatherGrid = styled.div`
    display: grid;
    margin-top: 0.25rem;
    grid-template-columns: max-content max-content;
    grid-gap: 0.75rem;
`;
const City = (props) => {
   
    useEffect(() => {
      
    },[]);

    return(
        <Container className='font-poppins'>
             <Heading className='font-poppins'>{props.data.city_name + " - " +props.data.duration + (props.data.duration > 1 ? " Nights" : " Night")}</Heading>
             <GridContainer>
             <ImageLoader
                    borderRadius="8px" url={props.data.image} height="auto" heightMobile="auto" dimensionsMobile={{width: 118, height: 80}}
                    ></ImageLoader>
                    <CityText className='font-poppins'>
                    {props.data.short_description}
                    </CityText>
             </GridContainer>
             <TextLight>Things to do</TextLight>
             <TextBold>Lorem · Lorem · Lorem</TextBold>

             <TextLight style={{marginTop: '0.75rem'}}>Weather (00 Feb - 00 Feb 0000)</TextLight>
             <WeatherGrid>
             <ImageLoader
                    borderRadius="50%" url="media/website/grey.png" height="2rem" heightMobile="2rem" width="2rem" dimensionsMobile={{width: 10, height: 10}}
            ></ImageLoader>
            <div className='center-div'><TextBold>00°C - 00°C</TextBold></div>
             </WeatherGrid>

             <TextLight style={{marginTop: '0.75rem'}}>Food to eat</TextLight>
             <TextBold>Lorem Ipsum · Lorem · Lorem · Lorem Ispum </TextBold>
             <div style={{border: '1px solid #F0F0F0', marginBottom: '1.5rem', marginTop: '0.75rem'}}></div>

        </Container>
        
    );
 }

export default City;
=======
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import ImageLoader from '../../../../components/ImageLoader';
import TruncatedText from '../../../../helper/TruncatedText';
import WeatherWidget from '../../../../components/WeatherWidget/WeatherWidget';
import { FaBed } from 'react-icons/fa';

const Heading = styled.p`
  font-size: 23px;
  font-weight: 600;
  color: #01202b;
  font-style: Helvetica;
  @media (min-width: 768px) {
    font-size: 26px;
  }
`;
const CityText = styled.p`
  font-size: 18px;
  font-weight: 400;
  margin: 0 0 0 15px;
  line-height: 24px;
  color: rgba(1, 32, 43, 1);
`;
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1fr;
  grid-gap: 0.5rem;
  margin-bottom: 0.75rem;
`;
const TextBold = styled.p`
  line-height: 24px;
  font-weight: 600;
  margin: 0;
  color: rgb(1, 32, 43);
`;

const TextLight = styled.p`
  line-height: 24px;
  margin: 0;
`;
export const ITbutton = styled.button`
  /* Background/Primary */
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 8px;
  font-weight: 600;
  font-size: 12px;
  background: #ffffff;
  /* Background/Tertiary  */

  border: 1.5px solid #eceaea;
  /* Elevaion/Light/medium */

  box-shadow: 0px 2px 0px #eceaea;
  border-radius: 8px;
`;

const City = (props) => {
  useEffect(() => {}, []);
  function scrollToTargetAdjusted(id) {
    // if (window.location.pathname === '/') {
    //   router.push({ pathname: '/locations', query: { scroll: target } });
    //   return;
    // }
    // console.log(`lool${target}`);
    const element = document.getElementById(id);
    const headerOffset = 117;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
  return (
    <div className="font-lexend ">
      <div className="font-bold text-2xl pb-3">
        {props.cityData.city_name + ' - ' + props.cityData.duration} Nights
      </div>
      <GridContainer>
        <ImageLoader
          borderRadius="8px"
          url={props.cityData.image}
          height={200}
          heightMobile="auto"
          dimensionsMobile={{ width: 180, height: 180 }}
        ></ImageLoader>
        <div>
          <div className="flex flex-row">
            <div className="flex justify-center items-center bg-slate-100 rounded-lg px-3 py-3 mr-2">
              <FaBed />
            </div>

            <div className="flex flex-col">
              <div className="text-xl font-medium">
                Lemon Tree Premium Hotel
              </div>
              <div className="text-xs font-light">
                Nirwan Marg, Bani Park, Jaipur
              </div>
            </div>
          </div>
          <div className="flex flex-col py-2">
            {/* <div className="text-sm">Things to do</div>
            <div className="font-medium text-sm">
              Tours · Wildlife · Museums · Historic Sites
            </div> */}
          </div>
          {/* <TruncatedText
            text={props.cityData.short_description}
            maxLength={120}
            viewMoreText="more v"
            viewLessText="less ^"
          /> */}

          <div>
            {/* <TextLight>Things to do</TextLight>
      <TextBold>Tours · Wildlife · Museums</TextBold> */}

            {/* <TextLight style={{ marginTop: '0.75rem' }}>
        Weather (03 Feb - 05 Feb 2023)
      </TextLight> */}
            <WeatherWidget
              city={props.cityData.city_name}
              lat={props.cityData.lat}
              lon={props.cityData.long}
            />
            <ITbutton onClick={() => scrollToTargetAdjusted(props.dayId)}>
              View {props.cityData.city_name} in your Itinerary
            </ITbutton>
            {/* <TextLight style={{ marginTop: '0.75rem' }}>Food to eat</TextLight>
      <TextBold>Bajre di roti · Halwa · Lassi · Daal Baati </TextBold> */}
          </div>
        </div>
      </GridContainer>

      <div
        style={{
          border: '1px solid #F0F0F0',
          marginBottom: '0.75rem',
          marginTop: '0.75rem',
        }}
      ></div>
    </div>
  );
};

export default City;
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
