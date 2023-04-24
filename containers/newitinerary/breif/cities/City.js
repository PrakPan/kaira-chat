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
    line-height: 24px;
   color:  rgba(1, 32, 43, 1);
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
        <Container className='font-lexend'>
             <Heading className='font-lexend'>{props.city + " - " + props.duration}</Heading>
             <GridContainer>
             <ImageLoader
                    borderRadius="8px" url="media/website/grey.png" height="auto" heightMobile="auto" dimensionsMobile={{width: 118, height: 80}}
                    ></ImageLoader>
                    <CityText className='font-lexend'>
                    Known as the "Pink City" because of the color of the stone used ...
                    </CityText>
             </GridContainer>
             <TextLight>Things to do</TextLight>
             <TextBold>Tours · Wildlife · Museums</TextBold>

             <TextLight style={{marginTop: '0.75rem'}}>Weather (03 Feb - 05 Feb 2023)</TextLight>
             <WeatherGrid>
             <ImageLoader
                    borderRadius="50%" url="media/website/grey.png" height="2rem" heightMobile="2rem" width="2rem" dimensionsMobile={{width: 10, height: 10}}
            ></ImageLoader>
            <div className='center-div'><TextBold>27°C - 32°C</TextBold></div>
             </WeatherGrid>

             <TextLight style={{marginTop: '0.75rem'}}>Food to eat</TextLight>
             <TextBold>Bajre di roti · Halwa · Lassi · Daal Baati </TextBold>
             <div style={{border: '1px solid #F0F0F0', marginBottom: '1.5rem', marginTop: '0.75rem'}}></div>

        </Container>
        
    );
 }

export default City;