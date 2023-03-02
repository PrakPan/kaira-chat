
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Card from '../../cards/Location';
import Carousel from '../../FlickityCarousel';
import media from '../../media';
import { useRouter } from 'next/router';
import axiosrecommendedinstance from '../../../services/poi/reccommededcities';
import FlickityLocations from './FlickityLocations';

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

   useEffect(() => {
  


    axiosrecommendedinstance
      .get(
        `/?slug=`+props.slug
      )
      .then((res) => {

       
        setLocations(res.data);
       setLoaded(true);

      })
      .catch((error) => {
        // alert('Page could not be loaded. Please try again.');
      });

 
  }, []);
//   for(var i = 0 ; i<props.length ; i++){
//     const slug  = locations[i].slug;
//     if(locations[i].image)
//     cardsarr.push(
//         <Card
//   location={locations[i].nickname}
//   heading={locations[i].tagline}
//   img={locations[i].image}
//   onclick={() => _handleRedirect(slug)}
//   > 
//   </Card>
//     )
// }
      const _handleRedirect = (slug) => {
        router.push('/travel-guide/city/'+slug)
      }


  if(isPageWide) {
  if(props.cards.length)
  return(
      <div>
    <FlickityLocations cards={props.cards} groupCells={5}></FlickityLocations>
    </div>
  ); 
  else return null;
  } 
  else return(
    <div >       
          <div style={{ padding: "1rem 0"}}>
            {isPageWide ? <Carousel cards={cardsarr} twocards></Carousel> :<Carousel cards={props.cards}></Carousel> }
    </div>
  </div>
  )
  ;
}

export default LocationsBlog;
