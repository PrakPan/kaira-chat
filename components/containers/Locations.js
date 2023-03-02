import React, { useState , useEffect} from 'react';
import styled from 'styled-components';
import Card from '../cards/Location';
import Carousel from '../FlickityCarousel';
import media from '../media';
import { useRouter } from 'next/router';
import Button from '../ui/button/Index';
import urls from '../../services/urls';
import * as ga from '../../services/ga/Index';
/* Used to display grid (desktop) / carousel of location images 
  inputs:locations (array of objects), viewall (guide page)
*/
const Container = styled.div`
display: grid;
height: 60vh;
  @media screen and (min-width: 768px){
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 1rem;
    height: 50vh;
    
  }
`;

const LocationsBlog= (props) => {
  let isPageWide = media('(min-width: 768px)')

   const router = useRouter();


    
      const _handlePlanning = (id, name, parent) => {
        localStorage.setItem('search_city_selected_id', id);
        localStorage.setItem('search_city_selected_name', name);
        localStorage.setItem('search_city_selected_parent', parent);
        router.push('/tailored-travel')
    }
    const _handlePlannerPage = (id,name,parent) => {
      router.push('/travel-planner/'+name)

    }
    const [cardsJSX, setCardsJSX] = useState([null, null, null, null , null]);
    useEffect(() => {
      let cardsarr = [];

    if(props.locations)
    props.locations.map( location => {
       cardsarr.push(              
          <Card
          key={location.tagline}
          location={location.name}
          heading={location.tagline}
          img={location.image}
          onclick={! props.planner ? () => _handlePlanning(location.id, location.name, location.state.name) : () => _handlePlannerPage(location.id, location.slug, location.state.name)}
          > 
          </Card>
        )
      
    });
setCardsJSX(cardsarr);
  }, [props.locations]);

// const router  = useRouter();
    const _handleTailoredRedirect = () => {
      router.push('/tailored-travel')
    }
    const _handleTailoredClick = () => {
      setLoading(true);
      setTimeout(_handleTailoredRedirect, 1000);
    
      ga.callback_event({
        action: 'TG-Locations',
        
        callback: _handleTailoredRedirect,
      })
    
    }
  // if(isPageWide) 
  return(
      <><div className='hidden-mobile'>
        <Container >  
               {cardsJSX}
      </Container>
      {props.viewall ? <Button boxShadow link={urls.travel_guide.BASE} hoverBgColor="black" hoverColor="white" borderWidth="1px" borderRadius="2rem" margin="1.5rem auto" padding="0.5rem 2rem" >View All</Button> : null}
      </div>
 
    <div className='hidden-desktop'>       
          <div style={{ padding: "1rem 0"}}>
            <Carousel cards={cardsJSX}></Carousel>
    </div>
    {props.viewall ? <Button  onclikc={_handleTailoredClick} onclickparams={null} boxShadow borderWidth="1px" borderRadius="2rem" margin="auto" padding="0.5rem 2rem" >View All</Button> : null}
  </div></>
  )
  ;
}

export default LocationsBlog;

{/* <Button link={'/travel-guide'} hoverBgColor="black" hoverColor="white" borderWidth="1px" borderRadius="2rem" margin="1.5rem auto" padding="0.5rem 2rem" onclick={_handleGuideRedirect} onclickparam={null}>View All</Button>  */}
{/* <Button borderWidth="1px" borderRadius="2rem" margin="auto" padding="0.5rem 2rem" onclick={_handleGuideRedirect} onclickparam={null}>View All</Button> */}