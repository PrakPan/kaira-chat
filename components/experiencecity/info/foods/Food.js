import React from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../ImageLoader';
const  Icon= (props) => {
    const Container = styled.div`
    width: 100%;
    `;

   
    const IconTagLine = styled.p`
        font-weight: 400;
       margin: 1rem auto 0.5rem auto;
        font-size: 0.75rem;
        text-align: center
    `;


        return( 
            <Container>
                    <ImageLoader url={props.icon.image ? props.icon.image : 'media/food/dinner.png'} dimensions={{width: 900, height: 900}} dimensionsMobile={{width: 900, height: 900}} ></ImageLoader>
                    <IconTagLine className="font-lexend">{props.icon.name}</IconTagLine>
            </Container>
          );
    }
   

export default  React.memo(Icon);