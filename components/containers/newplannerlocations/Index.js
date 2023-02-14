import React, { useState , useEffect} from 'react';
import styled from 'styled-components';
import Card from './Card';
import Carousel from '../../FlickityCarousel';
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

const LocationsBlog= (props) => {
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
    const [cardsToShowJSX, setCardsToShowJSX] = useState([]);
    const [offset, setOffset] = useState(0);
    let count =  0;

    useEffect(() => {
       let cardsarr = [];
      var i = 0;
    if(props.locations){
    for(i = 0 ; i < props.locations.length; i++){
        try{
          if(router.pathname!== props.locations[i].slug){
            count++;
        cardsarr.push(
            <Card
            data={props.locations[i]}
            key={props.locations[i].tagline}
            location={props.locations[i].name}
            heading={props.locations[i].tagline}
            img={props.locations[i].image}
            slug={props.locations[i].slug}
            filters={props.locations[i].most_popular_for}
            _handleTailored={_handleTailored}

            // onclick={! props.planner ? () => _handlePlanning(props.locations[i].id, props.locations[i].name, props.locations[i].state.name) : () => _handlePlannerPage(props.locations[i].id, props.locations[i].slug, props.locations[i].state.name)}
            > 
            </Card>
        )
        if(count === 6) break;
      }
        }
        catch{

        }
    }
  }
    // setOffset(5);
    // props.locations.map( location => {
    //    cardsarr.push(              
    //       <Card
    //       key={location.tagline}
    //       location={location.name}
    //       heading={location.tagline}
    //       img={location.image}
    //       onclick={! props.planner ? () => _handlePlanning(location.id, location.name, location.state.name) : () => _handlePlannerPage(location.id, location.slug, location.state.name)}
    //       > 
    //       </Card>
    //     )
      
    // });
setCardsToShowJSX(cardsarr);
setOffset(i+1);
  }, [props.locations]);

  const _showMoreLocations = () => {
    let cardsarr = cardsToShowJSX.slice();
    for(var i = offset; i < offset + 6; i++){
        try{
          if(router.pathname!== props.locations[i].slug)

        cardsarr.push(
            <Card
            key={props.locations[i].tagline}
            location={props.locations[i].name}
            heading={props.locations[i].tagline}
            img={props.locations[i].image}
            slug={props.locations[i].slug}
            filters={props.locations[i].most_popular_for}
            _handleTailored={_handleTailored}

            // onclick={! props.planner ? () => _handlePlanning(props.locations[i].id, props.locations[i].name, props.locations[i].state.name) : () => _handlePlannerPage(props.locations[i].id, props.locations[i].slug, props.locations[i].state.name)}
            > 
            </Card>
        )
        }catch{
            
        }
    }
    setCardsToShowJSX(cardsarr);
setOffset(offset+6);
  }

// const router  = useRouter();
    const _handleTailoredRedirect = () => {
      router.push('/tailored-travel')
    }
  // if(isPageWide) 
   return(
      <><div className='hidden-mobil'>
        <Container >  
               {cardsToShowJSX}
      </Container>
       {props.locations && !props.planner ? props.locations.length > offset ? <Button  onclick={_showMoreLocations} fontSizeDesktop="12px" fontWeight="600" hoverBgColor="black" hoverColor="white" borderWidth="1px" borderRadius="6px" margin="0rem auto" padding="0.5rem 2rem" >View More</Button> : null : null}
      </div>
 
    {/* <div className='hidden-desktop'>       
          <div style={{ padding: "1rem 0"}}>
            <Carousel cards={cardsToShowJSX}></Carousel>
    </div>
    {props.viewall ? <Button  onclikc={_handleTailoredClick} onclickparams={null} boxShadow borderWidth="1px" borderRadius="2rem" margin="auto" padding="0.25rem 2rem" >View More</Button> : null}
  </div> */}
  </>
  )
  ;
}

export default LocationsBlog;

