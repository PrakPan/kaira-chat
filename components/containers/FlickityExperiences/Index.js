
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import ExperienceCard from '../../cards/newitinerarycard-main/ExperienceCard';
import Carousel from '../../FlickityCarousel';
import media from '../../media';
import { useRouter } from 'next/router';
import Flickity from './Flickity';
/* Carousle for desktop and mobile to display experiences 
Inputs: experiences (json), 
used: guides, lising preview
*/
const Container = styled.div`
display: grid;
  @media screen and (min-width: 768px){
    grid-template-columns: repeat(5, minmax(0, 1fr));
    grid-gap: 1.5rem;
  }
`;

const LocationsBlog= (props) => {
  let isPageWide = media('(min-width: 768px)')

   const router = useRouter();

   let experiencecards = [];

   useEffect(() => {
  


 
  }, []);
  
      const _handleRedirect = (slug) => {
        router.push('/travel-guide/city/'+slug)
      }
    for(var i = 0; i<props.experiences.length; i++){
    
     
        //get height of text 
        // if height of text more than maxheight set maxheight to new height
        experiencecards.push(  
          <ExperienceCard 
          hardcoded={props.experiences[i].payment_info ?true : false }
          filter={props.experiences[i].experience_filters[0]}
          rating={props.experiences[i].rating}
          slug={props.experiences[i].slug}
          id={props.experiences[i].id}
          text={props.experiences[i].short_text} 
          experience={props.experiences[i].name}
          cost={props.experiences[i].payment_info ? props.experiences[i].payment_info[0].cost : null}
          duration={props.experiences[i].duration}
          location={props.experiences[i]["experience_region"]}
          starting_cost={props.experiences[i].payment_info? props.experiences[i].payment_info[0].cost : props.experiences[i].starting_price }
        images={props.experiences[i].images}>
          
          </ExperienceCard>
          )
      }
  if(isPageWide) {
  if(props.experiences.length)
  return(
    <Flickity cards={experiencecards} ></Flickity>
  ); 
  else return null;
  } 
  else return(
    <div >       
          <div style={{ padding: "1rem 0"}}>
            {isPageWide ? <Carousel cards={experiencecards} twocards></Carousel> :<Carousel cards={experiencecards}></Carousel> }
    </div>
  </div>
  )
  ;
}

export default LocationsBlog;
