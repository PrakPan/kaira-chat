import React from 'react'
import styled from 'styled-components';
import ImageLoader from '../../../components/ImageLoader';

const Container = styled.div`
    max-width: 100%;
    display: grid;
    padding: 0;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 1rem;
    @media screen and (min-width: 768px){
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: auto;

    }
    @media (min-width: 768px) and (max-width: 1024px) {
        grid-template-columns: 33% 33% 33%;
    }
    `;
    const IconContainer = styled.div`
    width: 100%;
    `;
    const IconTagLine = styled.p`
        font-weight: 400;
       margin: 1rem auto 0.5rem auto;
        font-size: 0.75rem;
        text-align: center
    `;

const FoodToEat = (props) => {
  return (
    <Container>
        {
        props.foods?.map((icon,index) => 
             <IconContainer>
                <ImageLoader url={icon.image ? icon.image : 'media/food/dinner.png'} dimensions={{width: 900, height: 900}} dimensionsMobile={{width: 900, height: 900}} ></ImageLoader>
                <IconTagLine className="font-opensans">{props.icon.name}</IconTagLine>
             </IconContainer>)
        }
    </Container>
  )
}

export default FoodToEat