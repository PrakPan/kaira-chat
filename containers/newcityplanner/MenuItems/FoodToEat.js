import React from 'react'
import styled from 'styled-components';
import ImageLoader from '../../../components/ImageLoader';

const Container = styled.div`
    max-width: 100%;
    display: grid;
    padding: 0;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 1rem;
    @media screen and (min-width: 768px){
        grid-template-columns: ${props=>'repeat('+props.total+',1fr)'};
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
        font-weight: 600;
        font-size: 16px;
        margin-block : 5px;
        `;

const FoodToEat = (props) => {
  return (
    <Container total={props.foods.length}>
        {
        props.foods?.map((icon,index) => 
             <IconContainer>
                <ImageLoader borderRadius='12px' url={icon.image ? icon.image : 'media/food/dinner.png'} dimensions={{width: 900, height: 900}} dimensionsMobile={{width: 900, height: 900}} ></ImageLoader>
                <IconTagLine className="font-opensans">{icon.name}</IconTagLine>
             </IconContainer>)
        }
    </Container>
  )
}

export default FoodToEat