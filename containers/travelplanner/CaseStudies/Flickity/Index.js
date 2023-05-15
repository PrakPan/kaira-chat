
import React, { useState} from 'react';
import styled from 'styled-components';
//  import Carousel from '../../FlickityCarousel';
import media from '../../../../components/media';
import { useRouter } from 'next/router';
import Flickity  from './Flickity';
 import Card from '../Card';
const LocationsBlog= (props) => {
  let isPageWide = media('(min-width: 768px)')

   const router = useRouter();
   const [loaded, setLoaded] = useState(false);
   const [locations, setLocations] = useState([]);
   let cardsarr = [];

   const flickityOptions = {
    initialIndex: 0,
    prevNextButtons: false,
    wrapAround: false,
    pageDots: false,
    groudCells: 4,

};

  for(var i = 0 ; i<props.data.length ; i++){
    //  const slug  = props.locations[i].slug;
    // if(props.locations[i].image)
    cardsarr.push(
        <Card
      heading={props.data[i].heading}
      text={props.data[i].text}
  > 
  </Card>
    )
}
    
  if(isPageWide) {
   return(
    <Flickity  cards={cardsarr} groupCells={2}></Flickity >
  ); 
}
  else return null;
  
}


export default LocationsBlog;
