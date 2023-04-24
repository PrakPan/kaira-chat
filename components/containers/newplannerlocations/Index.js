 
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
  console.log(props)
  let isPageWide = media('(min-width: 768px)')

    const router = useRouter();


    
      const _handleTailored = (location) => {
        //  localStorage.setItem('search_city_selected_id', location.id);
        // localStorage.setItem('search_city_selected_name', location.name);
        // localStorage.setItem('search_city_selected_parent', '');
        router.push('/tailored-travel?search_text='+location.name)
    }
    const _handlePlannerPage = (id,name,parent) => {
      router.push('/travel-planner/'+name)
    }
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
        MobileCardsArr.push(<MobileCardsContainer>{el.map(e=>e)}</MobileCardsContainer>)
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
            _handleTailored={_handleTailored}
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
    MobileCardsArr.push(<MobileCardsContainer>{el.map(e=>e)}</MobileCardsContainer>) 
  }
setCardsToShowJSX(cardsarr);
setCardsToShowJSXmobile(MobileCardsArr)

  }, [props.locations])

    const _handleTailoredRedirect = () => {
      router.push('/tailored-travel')
    }
  
   return(
      <><div className='hidden-mobile new-planner-location'>
        {/* <Container >  
               {cardsToShowJSX}
      </Container> */}
      <Carousel initialIndex={0} hideSides groupCells={6} numberOfCards={6} cards={cardsToShowJSX}></Carousel>
      {/* <Carousel hideSides initialIndex={0} groupCells={6} numberOfCards={6} cards={cards}></Carousel> */}

       {/* {props.locations && !props.planner ? props.locations.length > offset ?
        <Button   onclick={_showMoreLocations} fontSizeDesktop="16px" fontWeight="600" hoverBgColor="black" hoverColor="white" borderWidth="1px" borderRadius="6px" margin="0rem auto" padding="0.5rem 2rem" >View More</Button> : 
        <Button  link={isPageWide? '/tailored-travel' : props.onclick ?  null : '/tailored-travel'}  onclick={!isPageWide ? props.onclick ? props.onclick : null : null}  borderWidth="1px" fontSizeDesktop="16px" fontWeight="600" borderRadius="6px" margin="2rem auto" padding="0.5rem 2rem" >Build adventure!</Button> 

        : null} */}
      </div>
 
    <div className='hidden-desktop'>       
          <div style={{ padding: "1rem 0"}}>
            <PageDotsFlickity initialIndex={0} cards={cardsToShowJSXmobile}></PageDotsFlickity>
    </div>
    {/* {props.viewall ? <Button  onclikc={_handleTailoredClick} onclickparams={null} boxShadow borderWidth="1px" borderRadius="2rem" margin="auto" padding="0.25rem 2rem" >View More</Button> : null} */}
  </div>
  </>
  )
  ;
}

export default LocationsBlog;

 