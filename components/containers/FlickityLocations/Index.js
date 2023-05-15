
import React from 'react';
import Card from '../../cards/Location';
import Carousel from '../../FlickityCarousel';
import media from '../../media';
import { useRouter } from 'next/router';
import FlickityLocations from './Flickity';
/* Carousle for desktop and mobile to display locations
Inputs: experiences (json), 
used: guides, lising preview
*/
 
const LocationsBlog= (props) => {
  let isPageWide = media('(min-width: 768px)')

   const router = useRouter();
   let cardsarr = [];



  for (var i = 0; i < props.locations.length; i++){
      const slug  = props.locations[i].slug;
    let name = '';
    let id 
     if (props.locations[i].name) name = props.locations[i].name;
     if (props.locations[i].id) id= props.locations[i].id;

    if(props.locations[i].image)
    cardsarr.push(
      <Card
        key={i}
        location={props.locations[i].name ? props.locations[i].name : ""}
        heading={props.locations[i].tagline ? props.locations[i].tagline : ""}
        img={props.locations[i].image}
        onclick={() => _handleRedirect(slug)}
      ></Card>
    );
}
      const _handleRedirect = (slug) => {
        // router.push('/travel-guide/city/'+slug)
      }
    
   if(isPageWide) {
  if(props.locations.length)
  return(
    <FlickityLocations cards={cardsarr} groupCells={5}></FlickityLocations>
  ); 
  else return null;
  } 
  else return(
    <div >       
          <div style={{ padding: "1rem 0"}}>
            {isPageWide ? <Carousel cards={cardsarr} twocards></Carousel> :<Carousel cards={cardsarr}></Carousel> }
    </div>
  </div>
  )
  ;
}

export default LocationsBlog;
