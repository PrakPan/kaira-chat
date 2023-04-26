import React, {useState, useEffect, useRef} from 'react';
import styled,  { keyframes } from 'styled-components';
import BackgroundImageLoader from '../../../UpdatedBackgroundImageLoader';


const Container = styled.div`
width: 100%;
height : ${(props) => props.height + "px"};
position: relative;
`;
   


const ImageSlider = (props) => {
  
  const Component = useRef();
  const [height, setHeight] = useState(0);
  
  useEffect(()=> {
    setHeight((Component.current.offsetWidth * 3)/4);
  },[])
   
      var isArr = Object.prototype.toString.call(props.images) == '[object Array]';

       let image;
      if(isArr || props.images === null)
      image = props.images[0];
      else image = props.images.main_image;
      
     
    return(
        <Container props={props} ref={Component}>
            {/* <ExperienceType className="font-lexend">TREK</ExperienceType> */}
            <BackgroundImageLoader height={height+"px"} url={image} ></BackgroundImageLoader>
            {/* {typeof window !== 'undefined' ? <IconsContainer>
             <IconTextContainer style={{}}><IconHoverContainer><div><FontAwesomeIcon icon={faMapMarkerAlt} style={{fontSize: "1.25rem", marginBottom: "0.5rem"}}/></div>{props.location}</IconHoverContainer> </IconTextContainer>
             <IconTextContainer style={{borderStyle: "none solid none solid", borderWidth: "1px", borderColor: "#E4E4E4"}}><IconHoverContainer><div><FontAwesomeIcon icon={faCalendarWeek} style={{fontSize: "1.25rem", marginBottom: "0.5rem"}}/></div>{props.duration}</IconHoverContainer></IconTextContainer>
             <IconTextContainer  style={{}}><IconHoverContainer><div><FontAwesomeIcon icon={faCog} style={{fontSize: "1.25rem", marginBottom: "0.5rem"}}/></div>{props.filter}</IconHoverContainer></IconTextContainer>

           </IconsContainer> : null} */}
        </Container>
    );
}
export default React.memo(ImageSlider);

