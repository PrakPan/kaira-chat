import React from 'react';
import styled from 'styled-components';
import Heading from '../../../heading/Heading';
import ImageLoader from '../../../ImageLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock} from '@fortawesome/free-regular-svg-icons';
import Filters from './Filters';
import media from '../../../media';
const Container = styled.div`
border-style: none none solid none;
border-width: 1px;
border-color: #E4e4e4;
padding: 0 1rem 1rem 1rem;

max-width: 100%;
@media screen and (min-width: 768px){
    display: grid;
grid-gap: 1rem;
    grid-template-columns: 1fr;
}
@media screen and (min-width: 768px) and (min-height: 1024px) {
    grid-template-columns: 1fr;
}
`;
const ApproxTime = styled.div`
    width: max-content;
    border-radius: 2rem;
    background-color: hsl(0,0%,93%);
    padding: 0.25rem 1rem;
    font-size: 0.8rem;
    margin: auto;
    @media screen and (min-width: 768px){
        margin: 1rem auto;

    }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
    margin-right: 0.5rem;
`;

const GridContainer  = styled.div`
    
    @media screen and (min-width: 768px){
        display: grid;
        grid-template-columns: 40% 60%;
        margin: 1rem 0;
    }
`;

const About = styled.p`
    font-weight: 600;
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
`;
const Text = styled.p`
    font-weight: 100;
    text-align: center;
    margin: 0 1rem;
    font-size: 1rem;
    max-height: 8rem;
    overflow-y: scroll;
`;
const Overview = (props) => {
 
    let isPageWide = media('(min-width: 768px)')

  return(
      <Container>
        {!isPageWide ? <Heading align="center" aligndesktop="center" margin="0" className="font-opensans" bold noline>{props.name}</Heading> : null}
        {props.duration && !isPageWide ? <ApproxTime className="font-opensans">
            <StyledFontAwesomeIcon icon={faClock}/>
            {"Approximate Time: "+props.duration+"h"}</ApproxTime> : null}
        <GridContainer>
        <div className='center-div'>
             <ImageLoader bgcolor="#e4e4e4" borderRadius="8px" url={props.image ? props.image :  'media/website/grey.png'} dimensions={{width: 800, height: 600}} dimensionsMobile={{width: 800, height: 450}} width="90%" margin="auto"/>
            <Filters experience_filters={props.experience_filters}></Filters>
            {/* <Icons></Icons> */}
        </div>
        {isPageWide ? <div className='center-iv'>
            <Heading align="center" aligndesktop="center" margin="0" className="font-opensans" bold noline>{props.name}</Heading>
            {/* <About className='font-opensans'>About</About> */}
             {props.duration ? <ApproxTime className="font-opensans">
            <StyledFontAwesomeIcon icon={faClock}/>
            {"Approximate Time: "+props.duration+"h"}</ApproxTime> : null}
            <Text className='font-opensans'>{props.short_description}</Text>
        </div> : null}
        </GridContainer>
      </Container>
  );

}

export default Overview;