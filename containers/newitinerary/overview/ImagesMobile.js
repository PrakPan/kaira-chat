import styled from 'styled-components';
import { useState, useEffect } from 'react';
// import Button from '../../../components/ui/button/Index';
import ImageLoader from '../../../components/ImageLoader';
  const Container = styled.div`
   
`;

const GridContainer = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
margin-top: 0.75rem;


grid-gap: 1rem;
`;
const MoreContainer = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    border-radius: 12px;
    z-index: 2;
    background-color: rgba(84, 84, 84, 0.7);

    
`;
const MoreText = styled.div`
font-size: 14px;
font-weight: 600;
color: black;
position: absolute;
margin: 0;
`;
const ImagesMobile = (props) => {
   
    useEffect(() => {
      
    },[]);

    return(
        <Container>
              <ImageLoader borderRadius="12px" url="media/website/grey.png" height="auto" heightMobile="auto" dimensionsMobile={{width: 328, height: 141}}></ImageLoader>
                <GridContainer>
                    <ImageLoader
                    borderRadius="12px" url="media/website/grey.png" height="auto" heightMobile="auto" dimensionsMobile={{width: 160, height: 90}}
                    ></ImageLoader>
                    <MoreContainer className='center-div' >
                    <ImageLoader
                    borderRadius="12px" url="media/website/grey.png" height="auto" heightMobile="auto" dimensionsMobile={{width: 160, height: 90}}
                    ></ImageLoader>
                    <div className='center-div' style={{position: 'absolute', height: '100%', color: 'white'}}>View 10+ photos</div>
                    {/* <MoreText className='font-poppins'>View 10+ photos</MoreText> */}
                    </MoreContainer>
                </GridContainer>
        </Container>
        
    );
 }

export default ImagesMobile;