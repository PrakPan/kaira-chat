import React from 'react';
import styled from 'styled-components';
import ImageLoader from '../../ImageLoader';
import right from '../../../assets/icons/navigation/rightarrowcurve.svg';

const Container = styled.div`
@media screen and (min-width: 768px){
    display: grid;
    grid-template-columns: 1fr max-content 1fr max-content  1fr max-content 1fr  max-content 1fr;
}
`;
const LocationContainer = styled.div``;

const LocationName = styled.p`
    text-align: center;
    margin: 0.5rem;
`;

const Locations = (props) => {
    

    return(
        <Container>
            <LocationContainer>
                <ImageLoader url="media/itinerary/288555906pelling_rimbi_waterfall_main.jpg" width="80%" borderRadius="50%"></ImageLoader>
                <LocationName>Location</LocationName>
            </LocationContainer>
            <div ><img style={{width: "3rem", marginTop: "1rem"}} src={right}></img></div>
            <LocationContainer>
                <ImageLoader url="media/itinerary/288555906pelling_rimbi_waterfall_main.jpg" width="80%" borderRadius="50%"></ImageLoader>
                <LocationName>Location</LocationName>
            </LocationContainer>
            <div ><img style={{width: "3rem", marginTop: "1rem"}} src={right}></img></div>
            <LocationContainer>
                <ImageLoader url="media/itinerary/288555906pelling_rimbi_waterfall_main.jpg" width="80%" borderRadius="50%"></ImageLoader>
                <LocationName>Location</LocationName>
            </LocationContainer>
            <div ><img style={{width: "3rem", marginTop: "1rem"}} src={right}></img></div>
            <LocationContainer>
                <ImageLoader url="media/itinerary/288555906pelling_rimbi_waterfall_main.jpg" width="80%" borderRadius="50%"></ImageLoader>
                <LocationName>Location</LocationName>
            </LocationContainer>
            <div ><img style={{width: "3rem", marginTop: "1rem"}} src={right}></img></div>
            <LocationContainer>
                <ImageLoader url="media/itinerary/288555906pelling_rimbi_waterfall_main.jpg" width="80%" borderRadius="50%"></ImageLoader>
                <LocationName>Location</LocationName>
            </LocationContainer>
        </Container>
  ); 
}

export default Locations;
