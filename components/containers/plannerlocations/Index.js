import React, { useState , useEffect} from 'react';
import styled from 'styled-components';
import Card from './Card';
import Carousel from '../../FlickityCarousel';
import media from '../../media';
import { useRouter } from 'next/router';
import Button from '../../ui/button/Index';
import urls from '../../../services/urls';
import * as ga from '../../../services/ga/Index';
import axiospagelistinstance from '../../../services/pages/list';
/* Used to display grid (desktop) / carousel of location images 
  inputs:locations (array of objects), viewall (guide page)
*/
const Container = styled.div`
display: grid;
   @media screen and (min-width: 768px){
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 1rem;
      
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
    const [cardsToShowJSX, setCardsToShowJSX] = useState([]);
    const [offset, setOffset] = useState(0);
    let count =  0;

    useEffect(() => {
       let cardsarr = [];
      var i = 0;
    if(props.locations){
    for(i = 0 ; i < props.locations.length; i++){

        try{
           if(router.query.link!== props.locations[i].link){
            count++;
        cardsarr.push(
            <Card
            key={props.locations[i].tagline}
            location={props.locations[i].name}
            heading={props.locations[i].tagline}
            img={props.locations[i].image}
            slug={props.locations[i].slug}
            link={props.locations[i].link}

            // onclick={! props.planner ? () => _handlePlanning(props.locations[i].id, props.locations[i].name, props.locations[i].state.name) : () => _handlePlannerPage(props.locations[i].id, props.locations[i].slug, props.locations[i].state.name)}
            > 
            </Card>
        )
        if(count === 5) break;
      }
        }
        catch{

        }
    }
  }
   
// setCardsToShowJSX(cardsarr);
setOffset(i+1);
  }, [props.locations]);

  const [cardsJSX, setCardsJSX] = useState([]);

  useEffect(() => {
    let cards=[];
    // let count = 0;
    
    axiospagelistinstance
      .get(
        `/`
      )
      .then((res) => {

for(var i = 0 ; i < res.data.length; i++){
  if(res.data[i].id !== 1)
  if(router.query.link!== res.data[i].link){
// count++;
console.log('d', res.data[i])
  cards.push(
    <Card
    key={res.data[i].id}
    location={res.data[i].name}
    heading={res.data[i].name}
    img={res.data[i].image}
    slug={res.data[i].link}
    link={res.data[i].link}

    // onclick={! props.planner ? () => _handlePlanning(props.locations[i].id, props.locations[i].name, props.locations[i].state.name) : () => _handlePlannerPage(props.locations[i].id, props.locations[i].slug, props.locations[i].state.name)}
    > 
    </Card>
  
  )
  // if(count === 5) break;

  }

}
setCardsJSX(cards.slice());
setCardsToShowJSX(cards.slice(0,5));
setOffset(5);


      })
      .catch((error) => {
        // alert('Page could not be loaded. Please try again.');
      });

  }, []);

  const _showMoreLocations = () => {
    let cardsarr = cardsToShowJSX.slice();
    let c = cardsJSX.slice();
    // console.log(c)
    for(var i = offset; i < offset + 5; i++){
      // console.log(c[i])

        try{
          // if(router.pathname!== cardsJ[i].link)
        cardsarr.push(
            c[i]
        )
       
        }catch{
            
        }
    }
    console.log(cardsarr)
    setCardsToShowJSX(cardsarr.slice());
 setOffset(offset+6);
  }

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
               {cardsToShowJSX}
      </Container>
       {props.locations ? props.locations.length > offset ? <Button boxShadow onclick={_showMoreLocations} hoverBgColor="black" hoverColor="white" borderWidth="1px" borderRadius="2rem" margin="1.5rem auto" padding="0.25rem 2rem" >View More</Button> : null : null}
      </div>
 
    <div className='hidden-desktop'>       
          <div style={{ padding: "1rem 0"}}>
            <Carousel cards={cardsToShowJSX}></Carousel>
    </div>
    {props.viewall ? <Button  onclikc={_handleTailoredClick} onclickparams={null} boxShadow borderWidth="1px" borderRadius="2rem" margin="auto" padding="0.25rem 2rem" >View More</Button> : null}
  </div></>
  )
  ;
}

export default LocationsBlog;

