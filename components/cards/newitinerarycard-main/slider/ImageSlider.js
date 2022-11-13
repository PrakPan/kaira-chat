import React, {useState, useEffect, useRef} from 'react';
import styled,  { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCalendarWeek,faCog, faCircle, } from '@fortawesome/free-solid-svg-icons';
import BackgroundImageLoader from '../../../UpdatedBackgroundImageLoader';
import {GoStar} from 'react-icons/go';


 
    const IconsContainer = styled.div`
        color: white;
        position: absolute;
        bottom: 0;
        width: 100%;
         display: grid;
        grid-template-columns: 1fr max-content 1fr max-content 1fr;
        font-size: 0.85rem;
        border-style: none;
        border-width: 1px;
         background-color: rgba(255, 255, 255, 0.7);;
          color: black;
         padding: 5px 0;

      `;
      
      const IconHoverContainer = styled.div`
      &:hover{

        }
        margin: 0 0.25rem;
        padding: 0.5rem;
      `;

      const Container = styled.div`
        width: 100%;
        height: ${(props) => props.height ? props.height+"px" : '100%'};
        position: relative;
    `;
    const RatingContainer = styled.div`
        position: absolute;
        top: 0;
        background-color: #126904;
        width: max-content;
        font-size: 0.75rem;
        color: white;
        border-radius: 5px;
        padding: 0.25rem;
        right: 0;
        margin: 0.5rem;
        font-weight: 300;

    `;
    const Heading = styled.p`
    text-align: center;
        font-size: 1.75rem;
        font-weight: 700;
        letter-spacing: 0.02em;
        margin: 0;
    `;
    const Subheading=styled.p`
    text-align: center;
    font-size: 1.25rem;
    font-weight: 300;
    letter-spacing: 0.02em;
    `;
    const HeadingContainer = styled.div`
    width: 100%;
    top: 3.5rem;
    position: absolute;
    color: white;
     
    `;
    const CustomizableContainer = styled.div`
    position: absolute;
    top: 0;
    margin: 0.5rem;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    padding: 0.25rem;
    font-size: 0.75rem;
    font-weight: 300;
    `;
const ImageSlider = (props) => {
  
  const Component = useRef();
  const [height, setHeight] = useState(0);
   
  useEffect(()=> {
    setHeight((Component.current.offsetWidth * 3)/5);
  },[])
   
      var isArr = Object.prototype.toString.call(props.images) == '[object Array]';

       let image;
      if(isArr || props.images === null)
      image = props.images[0];
      else image = props.images.main_image;

      
    
    return(
        <Container  props={props} ref={Component} >
            {/* <ExperienceType className="font-opensans">TREK</ExperienceType> */}
            <BackgroundImageLoader height={height+"px"}  url={image} filters="linear-gradient(180deg, rgba(0, 0, 0,0) 50%, rgba(0, 0, 0, 1) 100%)" borderRadius="10px 10px 0 0"></BackgroundImageLoader>
            <IconsContainer className='font-opensans'>
            
               <IconHoverContainer>
                Adventure
                </IconHoverContainer> 
                <div className='center-div'><FontAwesomeIcon icon={faCircle} style={{fontSize: "0.5rem", marginBottom: "0rem"}}/></div>

               <IconHoverContainer>
                Affordable
                </IconHoverContainer> 
                <div className='center-div'><FontAwesomeIcon icon={faCircle} style={{fontSize: "0.5rem", marginBottom: "0rem"}}/></div>

               <IconHoverContainer>
                Family Trip
                </IconHoverContainer> 
            </IconsContainer>
            <RatingContainer className='font-opensans'>
            <GoStar  style={{fontSize: "1rem", marginBottom: "0rem", marginRight: '0.25rem', display: 'inline-block'}}></GoStar>

                4.5/5
            </RatingContainer>
            <CustomizableContainer className='font-opensans'>
            100% customizable
            </CustomizableContainer>
<HeadingContainer>
  <Heading className='font-opensans'>6 Days in Rajasthan</Heading>
  <Subheading className='font-opensans'>Explore Delhi, Rishikesh + 3 </Subheading>
</HeadingContainer>
        </Container>
    );
}
export default React.memo(ImageSlider);

