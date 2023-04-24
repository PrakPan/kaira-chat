import React from 'react';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFontAwesomeLogoFull} from '@fortawesome/free-solid-svg-icons';
import media from '../../../media';
import cross from '../../../../public/assets/icons/navigation/close.svg';

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
     return(
        <Container>
            <TextContainer>
                <div>
                <HelperText className="font-nunito">CURRENTLY REPLACING</HelperText>
                <Name className="font-lexend">
                    {props.replacing}
                    {/* <FontAwesomeIcon icon={faChevronDown} style={{marginLeft: '0.5rem'}} /> */}
                </Name>
                {props.selectedBooking ? <DetailsContainer>
                        {props.selectedBooking.check_in ? <Detail className='font-lexend'>{"Check in: "+ props.selectedBooking.check_in}</Detail> : null}
                        {props.selectedBooking.check_out ? <Detail className='font-lexend'>{"Check out: " + props.selectedBooking.check_out}</Detail> : null}
                        {/* <Detail className='font-lexend'>{"Rooms: " + props.selectedBooking.number_of_rooms + " x " + props.selectedBooking.room_type}</Detail> */}
                </DetailsContainer> : null}
                </div>
            </TextContainer>
        </Container>
    );
}

export default CurrentlyReplacing;