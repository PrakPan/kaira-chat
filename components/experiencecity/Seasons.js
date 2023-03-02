import React from 'react';
import styled from 'styled-components';
import SeasonCard from '../../components/cards/Season';
import Flickity from '../FlickityCarousel';

const Container = styled.div`
    display: grid;
    grid-gap: 1rem;
    padding: 0 10%;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr 1fr;

        padding: 0;
    }
`;


const Season= (props) => {

    let cards=[];
    for(var i=0; i<props.seasons_data.length; i++){
        cards.push(
            <SeasonCard season={props.seasons_data[i].season} text={props.seasons_data[i].text} time_interval={props.seasons_data[i].time_interval}></SeasonCard>
        )
    }

    if(true)
    return(
            <Container>  
          {cards}
      </Container>
  ); 
  else return <Flickity cards={cards}></Flickity>
}

export default Season;
