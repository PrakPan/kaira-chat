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
          padding: 2px 0;

         @media screen and (min-width: 768px){
          padding: 5px 0;

        }

      `;
      
      const IconHoverContainer = styled.div`
    
      &:hover{

        }
        margin: 0 0.25rem;
        padding: 4px;

        @media screen and (min-width: 768px){
          padding: 0.5rem;

        }
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
    const DurationContainer = styled.div`
    position: absolute;
    top: 0;
     width: max-content;
    font-size: 0.75rem;
    color: white;
    border-radius: 5px;
    padding: 0.25rem;
    right: 0;
    background: rgba(0, 0, 0, 0.4);
    letter-spacing: 0.2em;

    margin: 0.5rem;
    font-weight: 300;
    `;
    const Heading = styled.p`
    text-align: center;
        font-size: 1.75rem;
        font-weight: 700;
        letter-spacing: 0.02em;
        margin: 0;
        text-overflow: ellipsis;
        overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: ${(props) => (props.locations ? props.locations.length ? '1': '2' : '2')};
    -webkit-box-orient: vertical;
     `;
    const Subheading=styled.p`
    text-align: center;
    font-size: 1rem;
    font-weight: 300;
    letter-spacing: 0.02em;
    @media screen and (min-width: 768px){
      font-size: 1rem;

    }
    `;
    const HeadingContainer = styled.div`
     top: 2.75rem;
    position: absolute;
    color: white;
   width: 100%;
   padding: 0 0.25rem;
   @media screen and (min-width: 768px){
    top: 3.5rem;

  }

     
    `;
    const CustomizableContainer = styled.div`
    position: absolute;
    top: 0;
    margin: 0.5rem;
    letter-spacing: 0.2em;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    padding: 0.25rem;
    font-size: 0.75rem;
    font-weight: 300;
    `;
    const PWContainer=styled.div`
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
      padding: 2px 0;

     @media screen and (min-width: 768px){
      padding: 5px 0;

    }

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
console.log('locations', props.locations)
        let LOCATIONS_TO_SHOW = "";
      if(props.locations){
        if(props.locations.length > 2) {
            LOCATIONS_TO_SHOW="Explore "+props.locations[0]+", "+props.locations[1]+ "+" +(props.locations.length-2).toString();
            console.log('locations to show', LOCATIONS_TO_SHOW)
          }
        else{
          if(props.locations.length===1)
          LOCATIONS_TO_SHOW="Explore " + props.locations[0];
          else if(props.locations.length === 2) LOCATIONS_TO_SHOW="Explore " + props.locations[0]+", "+props.locations[1];
          
        }

      }
       
    
    return(
        <Container  props={props} ref={Component} >
            {/* <ExperienceType className="font-opensans">TREK</ExperienceType> */}
            <BackgroundImageLoader height={height+"px"}  url={image} filters="linear-gradient(180deg, rgba(0, 0, 0,0) 50%, rgba(0, 0, 0, 1) 100%)" borderRadius="10px 10px 0 0"></BackgroundImageLoader>
            {!props.PW ? <IconsContainer className='font-opensans'>
            
               <IconHoverContainer className='center-div'>
                {props.filter.split(' ')[0]}
                </IconHoverContainer> 
                <div className='center-div'><FontAwesomeIcon icon={faCircle} style={{fontSize: "6px", marginBottom: "0rem"}}/></div>

               <IconHoverContainer className='center-div'>
                {props.budget}
                </IconHoverContainer> 
                <div className='center-div'><FontAwesomeIcon icon={faCircle} style={{fontSize: "6px", marginBottom: "0rem"}}/></div>

               <IconHoverContainer className='center-div'>
                {props.group_type}
                </IconHoverContainer> 
            </IconsContainer> : 
            <PWContainer style={{display: 'none'}}>

            </PWContainer> }
            {/* <RatingContainer className='font-opensans'>
            <GoStar  style={{fontSize: "1rem", marginBottom: "0rem", marginRight: '0.25rem', display: 'inline-block'}}></GoStar>
            {props.rating + '/5'}
             </RatingContainer> */}
             <DurationContainer className='font-opensans'>
             {!props.duration  ? props.duration_number+ " " + props.duration_unit : props.duration}
             </DurationContainer>
            <CustomizableContainer className='font-opensans'>
            100% customizable
            </CustomizableContainer>
<HeadingContainer>
  <Heading className='font-opensans' locations={props.locations}>{props.experience}</Heading>
  <Subheading className='font-opensans'>{LOCATIONS_TO_SHOW}</Subheading>
</HeadingContainer>
        </Container>
    );
}
export default React.memo(ImageSlider);

