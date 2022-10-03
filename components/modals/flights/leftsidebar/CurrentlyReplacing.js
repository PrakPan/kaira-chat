import React from 'react';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFontAwesomeLogoFull} from '@fortawesome/free-solid-svg-icons';
import media from '../../../media';
import cross from '../../../../public/assets/icons/navigation/close.svg';
import { getHumanTime } from '../../../../services/getHumanTime';
import { getHumanDate } from '../../../../services/getHumanDate';
const Container  = styled.div`
bottom: 0;
@media screen and (min-width: 768px) {
    margin: 0 0.5rem;
}
`;
const TextContainer = styled.div`
  margin: 0 -1rem;
  
  @media screen and (min-width: 768px) {
    margin: 0;
}
`;
const HelperText = styled.p`
    color: black;
    font-size: 0.75rem;
    margin: 0 0 0.5rem 0;
    display: block;
    padding: 0.75rem 0;
    line-height: 1;
    text-align: center;
    background-color: #f7e700;

    @media screen and (min-width: 768px) {
        text-align: left;
        background-color: white;
        margin: 0.5rem 0 0 0;
        padding: 0;
    }
    
`;
const Name  = styled.p`
    font-weight: 700;
    font-size: 1.25rem;
    display: block;
    margin: 0;
    text-align: center;
    @media screen and (min-width: 768px) {
        text-align: left;
    }
    

`;
const Cross = styled.img`
    width: 1rem;
    height: auto;
    margin: 0.5rem;
    display: block;
    &:hover{
        cursor: pointer;
    }
`;
const DetailsContainer  = styled.div`
    margin: 0;
    @media screen and (min-width: 768px) {
        margin: 0.5rem 0;

    }
`;
const Detail = styled.p`
    font-size: 0.75rem;
    margin: 0;
    color: hsl(0,0%,50%);
    text-align: center;
    @media screen and (min-width: 768px) {
        text-align: left;
    }

`;
const CurrentlyReplacing = (props) =>{
    let isPageWide = media('(min-width: 768px)')
     const getTime = (datetime) => {
        return(getHumanTime(datetime.substring(11,16)));
    }
    const getDate = (datetime) => {
        let date = datetime.substring(0,10);
        let year = date.substring(0,4)
        let month = date.substring(5,7);
        let day = date.substring(8,10);
         // let actualdate = (date.slice(5)+"-"+date.substring(0,4)).replaceAll('-','/') + " "+ date.substring(0,4)
        return(getHumanDate(day+"/"+month+"/"+year) + " " + year);
    }
    return(
        <Container>
            <TextContainer>
                <div>
                <HelperText className="font-nunito">CURRENTLY REPLACING</HelperText>
                <Name className="font-opensans">
                    {/* {props.replacing} */}
                    FLIGHT
                    {/* <FontAwesomeIcon icon={faChevronDown} style={{marginLeft: '0.5rem'}} /> */}
                </Name>
                {props.selectedBooking ? <DetailsContainer>
                         {props.selectedBooking.costings_breakdown? props.selectedBooking.costings_breakdown.Segments ? props.selectedBooking.costings_breakdown.Segments[0].length ?   <Detail className='font-opensans'>{props.selectedBooking.costings_breakdown.Segments[0][0].Origin.Airport.CityName + ' to ' + props.selectedBooking.costings_breakdown.Segments[0][props.selectedBooking.costings_breakdown.Segments[0].length-1].Destination.Airport.CityName}</Detail>: null : null : null}
                        {props.selectedBooking.check_in ? <Detail className='font-opensans'>{"Departure: "+ getTime(props.selectedBooking.check_in) + ", "+getDate(props.selectedBooking.check_in)}</Detail>: null}
                        {props.selectedBooking.check_out ? <Detail className='font-opensans'>{"Arrival: " + getTime(props.selectedBooking.check_out) + ", " + getDate(props.selectedBooking.check_out)}</Detail> : null}
                        {/* <Detail className='font-opensans'>{"Rooms: " + props.selectedBooking.number_of_rooms + " x " + props.selectedBooking.room_type}</Detail> */}
                </DetailsContainer> : null}
                </div>
            </TextContainer>
        </Container>
    );
}

export default CurrentlyReplacing;