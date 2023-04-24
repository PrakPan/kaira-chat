import React, {useRef, useEffect} from 'react';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faImages, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import GridContainer from './GridContainer';
import { style } from '@material-ui/system';
import { getIndianPrice } from '../../../../services/getIndianPrice';

const YellowContainer  = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: max-content;
    background-color: rgba(	247, 231, 0, 0.8);
    padding: 0.5rem;
`;
const Heading = styled.p`
    font-weight: 700;
    display: inline;
    margin: 0;

    `;
const DetailsContainer = styled.div`
    display: grid;
    grid-template-columns: max-content auto;
`;
const Detail = styled.div`
    font-size: 0.75rem;
`;

const Booking = (props) =>{
    const IndianPrice = getIndianPrice(Math.ceil(props.data.booking_cost/100));
  
    return(
   
                    <YellowContainer>
                        <div style={{display: 'grid', gridTemplateColumns: 'auto max-content', margin: '0.5rem 0'}}>
                            <Heading className="font-lexend">{props.heading}</Heading>
                            {/* <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon> */}
                            {props.data.booking_cost && !props.are_prices_hidden ? <div style={{  fontSize:'1rem', overflow: 'hidden'}} className="font-lexend center-div">
                                {"₹ "+IndianPrice+"/-"}
                            </div> : null}
                        </div>
                        {/* <GridContainer></GridContainer> */}
                        <DetailsContainer>
                            {props.city ? <Detail className='font-lexend'>
                                {/* <FontAwesomeIcon icon={faMapMarkerAlt} style={{margin: '0 0.25rem 0 0'}}/> */}
                                {props.data.city+" to "+props.data.destination_city}
                            </Detail> : <div></div>}
                            {/* {props.check_in && props.check_out ? <Detail className='font-lexend' style={{textAlign: 'right'}}>{props.getDate(props.check_in) + "," + props.getTime(props.check_in) +  " to " + props.getDate(props.check_out) + "," + props.getTime(props.check_out) }</Detail> : <div></div>} */}
                        </DetailsContainer>
                    </YellowContainer>
      
    );

}

export default Booking;