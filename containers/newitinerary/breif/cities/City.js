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