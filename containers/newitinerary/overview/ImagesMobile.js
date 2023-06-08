<<<<<<< HEAD
import styled from 'styled-components';
import { useState, useEffect } from 'react';
// import Button from '../../../components/ui/button/Index';
import ImageLoader from '../../../components/ImageLoader';
  const Container = styled.div`
  display: grid;
  @media screen and (min-width: 768px){
    grid-template-columns: 2.5fr 1fr;
    grid-column-gap: 1rem;

}
`;

const GridContainer = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
margin-top: 0.75rem;
@media screen and (min-width: 768px){
    grid-template-columns:  1fr;
    margin-top: 0;


}


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
             <ImageLoader
                    borderRadius="12px"  url={props.images ? props.images.length ? props.images[0] :'media/website/grey.png' : 'media/website/grey.png' } dimensions={{width: 456, height: 150}} height="100%" heightMobile="auto" dimensionsMobile={{width: 320, height: 180}}
                    ></ImageLoader>
              {/* <ImageLoader borderRadius="12px"  dimensions={{width: 912, height: 331}} url="media/website/grey.png" height="auto" heightMobile="auto" dimensionsMobile={{width: 328, height: 141}}></ImageLoader> */}
                <GridContainer>
                  
                    <ImageLoader
                    borderRadius="12px"  url={props.images ? props.images.length > 1 ? props.images[1] :'media/website/grey.png' : 'media/website/grey.png' } dimensions={{width: 456, height: 150}} height="100%" heightMobile="auto" dimensionsMobile={{width: 320, height: 180}}
                    ></ImageLoader>
                    <MoreContainer className='center-div' >
                    <ImageLoader
                    borderRadius="12px" url={props.images ? props.images.length > 2 ? props.images[2] :'media/website/grey.png' : 'media/website/grey.png' } dimensions={{width: 456, height: 150}} height="100%" heightMobile="auto" dimensionsMobile={{width: 320, height: 180}}
                    ></ImageLoader>
                    <div className='center-div' style={{position: 'absolute', height: '100%', color: 'white', background: 'rgba(0,0,0,0.5)', width: '100%', borderRadius: '12px'}}>View 10+ photos</div>
                    {/* <MoreText className='font-poppins'>View 10+ photos</MoreText> */}
                    </MoreContainer>
                </GridContainer>
        </Container>
        
    );
 }

export default ImagesMobile;
=======
import styled from 'styled-components';
import { useState, useEffect } from 'react';
// import Button from '../../../components/ui/button/Index';
import ImageLoader from '../../../components/ImageLoader';
const Container = styled.div`
  display: grid;

  @media screen and (min-width: 768px) {
    grid-template-columns: ${(props) =>
      props.ConImg ? '3.3fr 1fr' : '3.3fr 0fr'};

    grid-column-gap: 2rem;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 0.75rem;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr;
    margin-top: 0;
    grid-row-gap: 2rem;
  }

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
  useEffect(() => {}, []);

  return (
    <Container ConImg={props.images[1]}>
      <ImageLoader
        borderRadius="12px"
        dimensions={{ width: 922, height: 331 }}
        url={props.images[0]}
        height="auto"
        heightMobile="auto"
        dimensionsMobile={{ width: 328, height: 141 }}
      ></ImageLoader>
      {props.images[1] ? (
        <GridContainer>
          <ImageLoader
            borderRadius="12px"
            url={props.images[1]}
            dimensions={{ width: 436, height: 150 }}
            height="100%"
            heightMobile="auto"
            dimensionsMobile={{ width: 160, height: 90 }}
          ></ImageLoader>
          <MoreContainer className="center-div">
            <ImageLoader
              borderRadius="12px"
              url={props.images[2]}
              dimensions={{ width: 436, height: 150 }}
              height="100%"
              heightMobile="auto"
              dimensionsMobile={{ width: 160, height: 90 }}
            ></ImageLoader>
            {/* <div
            className="center-div"
            style={{ position: 'absolute', height: '100%', color: 'white' }}
          >
            View 10+ photos
          </div> */}
            {/* <MoreText className='font-lexend'>View 10+ photos</MoreText> */}
          </MoreContainer>
        </GridContainer>
      ) : null}
    </Container>
  );
};

export default ImagesMobile;
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707
