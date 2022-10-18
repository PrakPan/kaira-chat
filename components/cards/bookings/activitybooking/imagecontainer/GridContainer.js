import React, {useRef, useEffect} from 'react';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faImages} from '@fortawesome/free-solid-svg-icons';

const GridContainer  = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr 1fr;
    margin: 1rem 0 0.25rem 0;
`;

const Booking = (props) =>{
  
  
    return(
        <GridContainer>
            <div className="center-div font-opensans text-center" style={{fontSize: '0.75rem', fontWeight: '600'}}>Private Room</div>
            <div  className="center-div font-opensans text-center" style={{fontSize: '0.75rem', fontWeight: '600', borderStyle: 'none solid none solid', borderWidth: '1px'}}>2 Nights</div>
            <div  className="center-div font-opensans text-center" style={{fontSize: '0.75rem', fontWeight: '600'}}>One More</div>

        </GridContainer>
    );

}

export default Booking;