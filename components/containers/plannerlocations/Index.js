 
import React, { useState , useEffect} from 'react';
import styled from 'styled-components';
import Card from './Card';
import Carousel from '../../FlickityCarousel';
import media from '../../media';
import { useRouter } from 'next/router';
import Button from '../../ui/button/Index';
import urls from '../../../services/urls';
import PageDotsFlickity from '../../PageDotsFlickity';
import DesktopSkeleton,{MobileSkeleton} from './LocationSkeleton'
import * as ga from '../../../services/ga/Index';
import axiospagelistinstance from '../../../services/pages/list';
/* Used to display grid (desktop) / carousel of location images 
  inputs:locations (array of objects), viewall (guide page)
*/

const MobileCardsContainer = styled.div`
  display : grid;
grid-template-columns: 1fr 1fr ;
  gap: 0.5rem;
`

const LocationsBlog= (props) => {
  let isPageWide = media('(min-width: 768px)')

   const router = useRouter();
    const [MobilecardsToShowJSX, setMobileCardsToShowJSX] = useState([]);
    const [cards,setCards] = useState([])

  useEffect(() => {
    
    axiospagelistinstance
      .get(
        ``
      )
      .then((res) => {

let z = 0
let MobileArr = []
while(z < res.data.length){
  let elem = <MobileCardsContainer>
     <Card
    key={res.data[z].id}
    location={res.data[z].destination}
    heading={res.data[z].tagline}
    img={res.data[z].image}
    slug={res.data[z].link}
    link={res.data[z].link}
     > 
    </Card>
    {res.data[z+1] &&<Card
    key={res.data[z+1].id}
    location={res.data[z+1].destination}
    heading={res.data[z+1].tagline}
    img={res.data[z+1].image}
    slug={res.data[z+1].link}
    link={res.data[z+1].link}
     > 
    </Card>}
    {res.data[z+2] &&<Card
    key={res.data[z+2].id}
    location={res.data[z+2].destination}
    heading={res.data[z+2].tagline}
    img={res.data[z+2].image}
    slug={res.data[z+2].link}
    link={res.data[z+2].link}

     > 
    </Card>}
   {res.data[z+3] && <Card
    key={res.data[z+3].id}
    location={res.data[z+3].destination}
    heading={res.data[z+3].tagline}
    img={res.data[z+3].image}
    slug={res.data[z+3].link}
    link={res.data[z+3].link}
     > 
    </Card>}
  </MobileCardsContainer>
  MobileArr.push(elem)
  z=z+4

}
setMobileCardsToShowJSX(MobileArr)

let cardsArr = []
for(let i = 0;i<res.data.length;i++){
  cardsArr.push(
    <Card
    key={res.data[i].id}
    location={res.data[i].destination}
    heading={res.data[i].tagline}
    img={res.data[i].image}
    slug={res.data[i].link}
    link={res.data[i].link}
     > 
    </Card>
  )
}
setCards(cardsArr)

      })
      .catch((error) => {
      });

  }, []);

// const router  = useRouter();
    // const _handleTailoredRedirect = () => {
    //   router.push('/tailored-travel')
    // }
    // const _handleTailoredClick = () => {
    //   setLoading(true);
    //   setTimeout(_handleTailoredRedirect, 1000);
    
    //   ga.callback_event({
    //     action: 'TG-Locations',
        
    //     callback: _handleTailoredRedirect,
    //   })
    
    // }
  // if(isPageWide) 
  return(
      <><div className='hidden-mobile'>
               {cards.length?<Carousel hideSides groupCells={6} numberOfCards={6} cards={cards}></Carousel> : <DesktopSkeleton />}
              <Button  link={isPageWide? '/tailored-travel' : props.onclick ?  null : '/tailored-travel'}  onclick={!isPageWide ? props.onclick ? props.onclick : null : null} borderWidth="1px" fontSizeDesktop="16px" fontWeight="600" borderRadius="6px" margin="2rem auto" padding="0.5rem 2rem" >Unlock your personalized adventure</Button> 

      </div>
 
    <div className='hidden-desktop'>       
          <div style={{ padding: "1rem 0"}}>
            {MobilecardsToShowJSX.length?<PageDotsFlickity initialIndex cards={MobilecardsToShowJSX}></PageDotsFlickity>:<MobileSkeleton />}
    </div>
  </div></>
  )
  ;
}

export default LocationsBlog;

 