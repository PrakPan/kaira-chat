import React, {useState, useEffect, useRef} from 'react';
import styled,  { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCalendarWeek,faCog} from '@fortawesome/free-solid-svg-icons';
import BackgroundImageLoader from '../../../UpdatedBackgroundImageLoader';
import usePageLoaded from '../../../custom hooks/usePageLoaded';



 
    const IconsContainer = styled.div`
        color: white;
        position: absolute;
        bottom: 0;
        width: 100%;
        margin-bottom: 0.5rem;
        display: grid;
        grid-template-columns: repeat(3,1fr);
        font-size: 0.85rem;
        border-style: none;
        border-width: 1px;
        border-color: #E4e4e4;

      `;
      const IconTextContainer = styled.div`
        
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
const ImageSlider = (props) => {
  const isPageLoaded = usePageLoaded();
  
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

      
    
    return (
      <Container props={props} ref={Component}>
        {/* <ExperienceType className="font-lexend">TREK</ExperienceType> */}
        <BackgroundImageLoader
          height={height + "px"}
          url={image}
          filters="linear-gradient(180deg, rgba(0, 0, 0,0) 50%, rgba(0, 0, 0, 1) 100%)"
        ></BackgroundImageLoader>
        {isPageLoaded ? (
          <IconsContainer>
            <IconTextContainer style={{}}>
              <IconHoverContainer>
                <div>
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}
                  />
                </div>
                {props.location}
              </IconHoverContainer>{" "}
            </IconTextContainer>
            <IconTextContainer
              style={{
                borderStyle: "none solid none solid",
                borderWidth: "1px",
                borderColor: "#E4E4E4",
              }}
            >
              <IconHoverContainer>
                <div>
                  <FontAwesomeIcon
                    icon={faCalendarWeek}
                    style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}
                  />
                </div>
                {props.duration}
              </IconHoverContainer>
            </IconTextContainer>
            <IconTextContainer style={{}}>
              <IconHoverContainer>
                <div>
                  <FontAwesomeIcon
                    icon={faCog}
                    style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}
                  />
                </div>
                {props.filter}
              </IconHoverContainer>
            </IconTextContainer>
          </IconsContainer>
        ) : null}
      </Container>
    );
}
export default React.memo(ImageSlider);

