import React from 'react';
import styled from 'styled-components';
import Flickity from '../FlickityCarousel';

import Card from '../cards/Blog';
import media from '../media';

const Container = styled.div`
    margin: ${(props) => props.margin? props.margin : '0'};
    @media screen and (min-width: 768px){
    }
    `;
    
    const GridContainer = styled.div`

      @media screen and (min-width: 768px){
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 2.5rem;
      }
  
    `;
const Blogs= (props) => {
  let isPageWide = media('(min-width: 768px)')

    
    let cards = [];
     if(props.cityblogs)
    for(var i = 0 ; i < props.cityblogs.length ; i++){
      cards.push(
      <Card key={i} bgColor={!isPageWide ? "hsl(0,0%,97%)" : null} link={props.cityblogs[i].link} heading={props.cityblogs[i].name} text={props.cityblogs[i].short_text} img={props.cityblogs[i].image}></Card>
      )
  }
  else 
    for(var i = 0 ; i < props.blogs.length ; i++){
        cards.push(
            <Card key={props.blogs[i].heading} bgColor={!isPageWide ? "hsl(0,0%,97%)" : null} link={props.blogs[i].link} heading={props.blogs[i].heading} text={props.blogs[i].text} img={props.blogs[i].image}></Card>
        )
    }
  
    if(isPageWide )
    return(
      <Container>  
          <GridContainer>
{cards}
          </GridContainer>
      </Container>
  ); 
  else return <Flickity cards={cards}></Flickity>
}

export default Blogs;
