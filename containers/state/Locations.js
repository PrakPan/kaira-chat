import React from 'react';
import styled from 'styled-components';
import ImageLoader from '../../components/ImageLoader';
import CityCard from './LocationCard';
import Route from '../itinerary/breif/route/Index';
const RouteContainer = styled.div`


@media screen and (min-width: 768px){


}
`;
const CardContainer = styled.div`
@media screen and (min-width: 768px){
    width: 100%;

}
`;
const LocationContainer = styled.div``;

const LocationName = styled.p`
    text-align: center;
    margin: 0.5rem;
`;
const ArrowContainer = styled.div`
    
`;
const Arrow = styled.img`
    width: 2rem;
    display: block;
    margin: 1rem auto;
    transform: rotate(90deg);
    @media screen and (min-width: 768px){
        margin: 2.75rem 1rem;
        display: initial;
        transform: rotate(0deg);
    }
`;
const Locations = (props) => {

    const breif = {
        city_slabs: props.route
    }
    if(props.route.length > 1)
    return(
        <RouteContainer>
            {/* <LocationContainer>
                <ImageLoader url="media/itinerary/288555906pelling_rimbi_waterfall_main.jpg" width="7.5rem" height="7.5rem" borderRadius="50%"></ImageLoader>
                <LocationName>Location</LocationName>
            </LocationContainer>
            <LocationContainer>
                <ImageLoader url="media/itinerary/288555906pelling_rimbi_waterfall_main.jpg" width="7.5rem" height="7.5rem" borderRadius="50%"></ImageLoader>
                <LocationName>Location</LocationName>
            </LocationContainer>
            <LocationContainer>
                <ImageLoader url="media/itinerary/288555906pelling_rimbi_waterfall_main.jpg" width="7.5rem" height="7.5rem" borderRadius="50%"></ImageLoader>
                <LocationName>Location</LocationName>
            </LocationContainer>
            <LocationContainer>
                <ImageLoader url="media/itinerary/288555906pelling_rimbi_waterfall_main.jpg" width="7.5rem" height="7.5rem" borderRadius="50%"></ImageLoader>
                <LocationName>Location</LocationName>
            </LocationContainer> */}
            {/* <CityCard image="media/itinerary/288555906pelling_rimbi_waterfall_main.jpg" title="Rishikesh" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris finibus odio eu tellus ultrices, nec ornare nulla commodo. Maecenas eu elementum dolor. Vestibulum id leo non lorem tincidunt auctor." heading="heading"></CityCard> */}
            {/* <CityCard image="media/itinerary/288555906pelling_rimbi_waterfall_main.jpg" title="Laluri Khal" text="Text" heading="heading"></CityCard> */}
            {/* <CityCard image="media/itinerary/288555906pelling_rimbi_waterfall_main.jpg" title="Delhi" text="Text" heading="heading"></CityCard> */}
        <Route breif={breif} nomap nostartinglocation/>
        </RouteContainer>
  ); 
  else return(
      <CardContainer>
    <CityCard image={props.route[0].image ? props.route[0].image : 'media/itinerary/288555906pelling_rimbi_waterfall_main.jpg'} title={props.route[0].city_name} text={props.route[0].short_description} heading="heading"></CityCard>
    </CardContainer>
  )
}

export default React.memo(Locations);
