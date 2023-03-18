 
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
let cardsArr = []
let MobileCardsArr = []
let count = 0
for(let i = 0;i<res.data.length;i++){
  if(i%4==0 && i!=0){
      let n = cardsArr.length;
      const el = cardsArr.slice(n-4,n)
      MobileCardsArr.push(<MobileCardsContainer>{el.map(e=>e)}</MobileCardsContainer>)
    count++
    }
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
if(count%4 !=0){
  const el = cardsArr.slice(count*4,cardsArr.length)
  MobileCardsArr.push(<MobileCardsContainer>{el.map(e=>e)}</MobileCardsContainer>)
  
}
setCards(cardsArr)
setMobileCardsToShowJSX(MobileCardsArr)

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

{cards.length?<Carousel initialIndex hideSides groupCells={6} numberOfCards={6} cards={cards}></Carousel> : <DesktopSkeleton />}
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

 