 
import React, { useState , useEffect} from 'react';
import styled from 'styled-components';
import Card from './Card';
import Carousel from '../../FlickityCarousel';
import PageDotsFlickity from '../../PageDotsFlickity';
import media from '../../media';
import { useRouter } from 'next/router';
import Button from '../../ui/button/Index';
import urls from '../../../services/urls';
import * as ga from '../../../services/ga/Index';
/* Used to display grid (desktop) / carousel of location images 
  inputs:locations (array of objects), viewall (guide page)
*/
const Container = styled.div`
display: grid;
grid-template-columns: 1fr 1fr ;
grid-gap: 1rem;
padding: 0.5rem;

   @media screen and (min-width: 768px){
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 2rem;
    padding: 0rem;
      
  }
`;

const MobileCardsContainer = styled.div`
  display : grid;
grid-template-columns: 1fr 1fr ;
  gap: 0.5rem;
`


const LocationsBlog= (props) => {
  let isPageWide = media('(min-width: 768px)')

  const router = useRouter();
  
    const _handleCityRedirect = (name)=>{
      router.push(`/travel-guide/city/${name}`)
    }
    const [cardsToShowJSX, setCardsToShowJSX] = useState([]);
    const [cardsToShowJSXmobile, setCardsToShowJSXmobile] = useState([]);
    useEffect(() => {
       let cardsarr = [];
let MobileCardsArr = []

      var i = 0;
      let count = 0

    if(props.locations){
    for(i = 0 ; i < props.locations.length; i++){
      if(i%4==0 && i!=0){
        let n = cardsarr.length;
        const el = cardsarr.slice(n-4,n)
        MobileCardsArr.push(<MobileCardsContainer>{el.map((e,i) => <div key={i}>{e}</div>)}</MobileCardsContainer>)
        count++

      }
        try{
          if(router.pathname!== props.locations[i].slug){
        cardsarr.push(
          <>
            <Card
            data={props.locations[i]}
            key={props.locations[i].tagline}
            location={props.locations[i].name}
            heading={props.locations[i].tagline}
            img={props.locations[i].image}
            slug={props.locations[i].slug}
            filters={props.locations[i].most_popular_for}
            _handleCityRedirect={_handleCityRedirect}

            // onclick={! props.planner ? () => _handlePlanning(props.locations[i].id, props.locations[i].name, props.locations[i].state.name) : () => _handlePlannerPage(props.locations[i].id, props.locations[i].slug, props.locations[i].state.name)}
            > 
            </Card>
          </>
          )
      }
        }
        catch{

        }
    }
  }
  if(count%4 !=0){
    const el = cardsarr.slice(count*4,cardsarr.length)
    MobileCardsArr.push(
      <MobileCardsContainer>
        {el.map((e, i) => (
          <div key={i}>{e}</div>
        ))}
      </MobileCardsContainer>
    ); 
  }
setCardsToShowJSX(cardsarr);
setCardsToShowJSXmobile(MobileCardsArr)

  }, [props.locations])
  
   return (
     <>
       <div className="hidden-mobile new-planner-location">
         {/* <Container >  
               {cardsToShowJSX}
      </Container> */}
         <Carousel
           hideSides
           initialIndex={0}
           groupCells={6}
           numberOfCards={6}
           cards={cardsToShowJSX}
         ></Carousel>
       </div>

       <div className="hidden-desktop">
         <div style={{ padding: "1rem 0" }}>
           <PageDotsFlickity
             initialIndex={0}
             cards={cardsToShowJSXmobile}
           ></PageDotsFlickity>
         </div>
         {/* {props.viewall ? <Button  onclikc={_handleTailoredClick} onclickparams={null} boxShadow borderWidth="1px" borderRadius="2rem" margin="auto" padding="0.25rem 2rem" >View More</Button> : null} */}
       </div>
     </>
   );
}

export default LocationsBlog;

 