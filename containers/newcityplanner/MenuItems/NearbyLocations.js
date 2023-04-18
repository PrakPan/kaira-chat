import React , { useEffect, useState } from 'react'
import axiosrecommendedinstance from '../../../services/poi/reccommededcities';
import Card from '../../../components/containers/plannerlocations/Card';
import media from "../../../components/media"
import DesktopSkeleton,{MobileSkeleton} from '../../../components/containers/plannerlocations/LocationSkeleton'
import Button from '../../../components/ui/button/Index'
import styled from 'styled-components'
import Carousel from '../../../components/FlickityCarousel'
import PageDotsFlickity from '../../../components/PageDotsFlickity'
const MobileCardsContainer = styled.div`
  display : grid;
grid-template-columns: 1fr 1fr ;
  gap: 0.5rem;
`

const NearbyLocations = (props) => {
  
  const [MobilecardsToShowJSX, setMobileCardsToShowJSX] = useState([]);
  const [cards,setCards] = useState([])

  useEffect(() => {
    
    axiosrecommendedinstance
      .get(
        `/?slug=`+props.data.slug
      )
      .then((res) => {
        console.log(res,'resres')
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
    location={res.data[i].name}
    heading={res.data[i].most_popular_for[res.data[i].most_popular_for.length-1]}
    img={res.data[i].image}
    slug={res.data[i].slug}
    link={res.data[i].slug}
    city={true}
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


  let isPageWide = media('(min-width: 768px)')

  return (
    <>
    {isPageWide?<>
    {cards.length?<Carousel initialIndex={0} hideSides groupCells={6} numberOfCards={6} cards={cards}></Carousel> : <DesktopSkeleton />}
   <Button  link={isPageWide? '/tailored-travel' : props.onclick ?  null : '/tailored-travel'}  onclick={!isPageWide ? props.onclick ? props.onclick : null : null} borderWidth="1px" fontSizeDesktop="16px" fontWeight="600" borderRadius="6px" margin="2rem auto" padding="0.5rem 2rem" >Unlock your personalized adventure</Button> 
</>
 : 
     <div>
       {MobilecardsToShowJSX.length?<PageDotsFlickity padding={'0.2rem'} initialIndex cards={MobilecardsToShowJSX}></PageDotsFlickity>:<MobileSkeleton />}
</div>

}
</>)
}

export default NearbyLocations