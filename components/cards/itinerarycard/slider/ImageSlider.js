import React, {useState, useEffect, useRef} from 'react';
import styled,  { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCalendarWeek,faCog, faWallet} from '@fortawesome/free-solid-svg-icons';
import BackgroundImageLoader from '../../../BackgroundImageLoader';

const ExperienceType = styled.div`
width: max-content;
position: absolute;
top: 0.5rem;
left: 0;
background-color: #F7e700;
z-index: 2;
color: black;
padding: 0.5rem 2rem;
letter-spacing: 1px;
font-weight: 600;
clip-path: polygon(0% 0%, 100% 0%, 85% 50%, 100% 100%, 0% 100%);

`;
const TagsContainer = styled.div`
    color: white;
    position: absolute;
        bottom: 0;
        width: 100%;
        text-align: left;
        padding: 0 1rem;
        display: grid;
        grid-template-columns: 1.5fr 1fr;

`;
const TagContainer = styled.div`
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: max-content auto;
`;
const TagHeading = styled.p`
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  letter-spacing: 1px;
  font-size: 0.75rem;
  line-height: 1;
`;
const TagText = styled.p`
  font-weight: 100;
  margin: 0;
  font-size: 0.75rem;


`;





   
    const IconsContainer = styled.div`
        color: white;
        position: absolute;
        bottom: 0;
        width: 100%;
        margin-bottom: 0.5rem;
        display: grid;
        grid-template-columns: repeat(3,1fr);
        font-size: 0.85rem;
        /* font-size: ${props => props.theme.fontsizes.desktop.text.five ? props.theme.fontsizes.desktop.text.five : props.theme.fontsizes.desktop.text.five }; */
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
const ImageSlider = (props) => {
  const Component = useRef();
  const [height, setHeight] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
    const _prevImgHandler = () => {
      if(imgIndex === 0) setImgIndex(4)
      else setImgIndex(imgIndex - 1);
    }
    const _nextImgHandler = () => {
      if(imgIndex === 4) setImgIndex(0)
      else setImgIndex(imgIndex + 1);
    }
  useEffect(()=> {
    setHeight((Component.current.offsetWidth * 3)/4);
  },[])
    const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
    let imgRequestBody = {
        bucket: "thetarzanway-web",
        key: "",
        edits: {
          resize: {
            width: 400,
            height: 300,
            fit: "cover"
          }
        }
      };

      const Container = styled.div`
width: 100%;
height: ${height+"px"};
position: relative;
`;
    return(
        <Container ref={Component} style={{height: height+"px"}}>
            {/* <ExperienceType className="font-opensans">TREK</ExperienceType> */}
            <BackgroundImageLoader height={height+"px"} url={props.image} filter="linear-gradient(180deg, rgba(0, 0, 0,0) 50%, rgba(0, 0, 0, 1) 100%)"></BackgroundImageLoader>
            {/* <IconsContainer>
             <IconTextContainer style={{}}><IconHoverContainer><div><FontAwesomeIcon icon={faMapMarkerAlt} style={{fontSize: "1.25rem", marginBottom: "0.5rem"}}/></div>{props.location}</IconHoverContainer> </IconTextContainer>
             <IconTextContainer style={{borderStyle: "none solid none solid", borderWidth: "1px", borderColor: "#E4E4E4"}}><IconHoverContainer><div><FontAwesomeIcon icon={faCalendarWeek} style={{fontSize: "1.25rem", marginBottom: "0.5rem"}}/></div>{props.duration}</IconHoverContainer></IconTextContainer>
             <IconTextContainer  style={{}}><IconHoverContainer><div><FontAwesomeIcon icon={faWallet} style={{fontSize: "1.25rem", marginBottom: "0.5rem"}}/></div>{props.budget}</IconHoverContainer></IconTextContainer>

           </IconsContainer> */}
          <TagsContainer>
              <div><TagContainer>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{fontSize: "1rem", margin: "0rem 0.5rem 0 0"}}/>
                  <div >
                    <TagHeading className="font-opensans">
                    LOCATIONS
                    </TagHeading>
                  <TagText  className="font-opensans">{props.locations.join(" ")}</TagText>
                  </div>
              </TagContainer>
              <TagContainer>
                 <FontAwesomeIcon icon={faCalendarWeek} style={{fontSize: "1rem", margin: "0rem 0.5rem 0 0"}}/>
                  <div  >
                    <TagHeading className="font-opensans">
                    DURATION
                    </TagHeading>
                  <TagText  className="font-opensans">{props.duration}</TagText>
                  </div>
              </TagContainer>
              </div>
              <TagContainer style={{height: 'max-content'}}>
                <FontAwesomeIcon icon={faWallet} style={{fontSize: "1rem", margin: "0rem 0.5rem 0 0"}}/> 
                  <div  >
                    <TagHeading className="font-opensans">
                    BUDGET
                    </TagHeading>
                  <TagText  className="font-opensans">{props.budget}</TagText>
                  </div>
              </TagContainer>
  </TagsContainer>
        </Container>
    );
}
export default React.memo(ImageSlider);

