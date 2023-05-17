
import React from 'react';
import Card from '../../cards/Location';
import media from '../../media';
import { useRouter } from 'next/router';
import SwiperCarousel from '../../SwiperCarousel';
 
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
    <SwiperCarousel cards={cardsarr} slidesPerView={5}></SwiperCarousel>
  ); 
  else return null;
  } 
  else return (
    <div>
      <div style={{ padding: "1rem 0" }}>
        <SwiperCarousel
          slidesPerView={1.3}
          initialSlide={1}
          centeredSlides
          cards={cardsarr}
        ></SwiperCarousel>
      </div>
    </div>
  );
}

export default LocationsBlog;
