import React from 'react';
import styled from 'styled-components';
// import Heading from '../../../heading/Heading';
import Heading from '../../../newheading/heading/Index';
import ImageLoader from '../../../ImageLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock} from '@fortawesome/free-regular-svg-icons';
import Filters from './Filters';
import Icons from './Icons';
const Container = styled.div`
border-style: none none solid none;
border-width: 1px;
border-color: #E4e4e4;
padding: 0 1rem 1rem 1rem;
display: grid;
grid-gap: 1rem;
max-width: 100%;
@media screen and (min-width: 768px){
    grid-template-columns: 1fr;
}
@media screen and (min-width: 768px) and (min-height: 1024px) {
    grid-template-columns: 1fr;
}
`;
const ApproxTime = styled.div`
    width: max-content;
    border-radius: 2rem;
    background-color: #f7e700;
    padding: 0.25rem 1rem;
    margin: 1rem auto;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
    margin-right: 0.5rem;
`;



const Overview = (props) => {
 
  
  return(
      <Container>
        <Heading align="center" aligndesktop="center" margin="0" className="font-opensans" bold noline>{props.name}</Heading>
        {props.duration ? <ApproxTime className="font-opensans">
            <StyledFontAwesomeIcon icon={faClock}/>
            {"Approximate Time: "+props.duration+"h"}</ApproxTime> : null}
        {props.image ? <ImageLoader url={props.image} dimensions={{width: 1600, height: 900}} dimensionsMobile={{width: 1600, height: 900}} width="60%" margin="auto"/> : null}
        <Filters experience_filters={props.experience_filters}></Filters>
        {/* <Icons></Icons> */}
      </Container>
  );

}

export default Overview;