import React, {useEffect} from 'react';
import Overview from './Overview/Overview';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import Tabs from './tabs/Index';
  const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  &:hover{
    cursor: pointer;
  }
`;

const Container = styled.div`
  min-height: 40vh;
  max-height: 70vh;
  @media screen and (min-width: 768px){

  max-height: 80vh;
  }
`;
const Body = (props) => {

  
  return(
      <Container>
 
                <Overview  short_description={props.poi ? props.poi.short_description : null}  image={props.poi ? props.poi.image :   'media/website/grey.png'} experience_filters={props.poi ? props.poi.experience_filters : null} name={props.poi ? props.poi.name : null} duration={props.poi ? props.poi.ideal_duration_hours : null}></Overview>
                <Tabs  
                short_description={props.poi ? props.poi.short_description : null} 
                getting_around={props.poi ? props.poi.getting_around : null} 
                recommendations={props.poi ? props.poi.recommendation : null} 
                tips={props.poi ? props.poi.tips : null}
                entry_fees={props.poi ? props.poi.entry_fees: null}
                weekdays={props.poi ? props.poi.weekday : null}
                >
                </Tabs>
      
      </Container>
  );

}

export default Body;