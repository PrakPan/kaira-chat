import React , { useEffect, useState } from 'react'
import Card from '../../../components/containers/plannerlocations/Card';
import media from "../../../components/media"
import DesktopSkeleton,{MobileSkeleton} from '../../../components/containers/plannerlocations/LocationSkeleton'
import Button from '../../../components/ui/button/Index'
import styled from 'styled-components'
import Carousel from '../../../components/FlickityCarousel'
import PageDotsFlickity from '../../../components/PageDotsFlickity'
import openTailoredModal from '../../../services/openTailoredModal';
import { useRouter } from 'next/router';
const MobileCardsContainer = styled.div`
  display : grid;
grid-template-columns: 1fr 1fr ;
  gap: 0.5rem;
`
const Heading = styled.p`
  font-weight: 600;
  font-size: 25px;
  // line-height: 48px;
  margin-block: 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 32px;
    margin-block: 3.5rem;
  }
`;

const NearbyLocations = (props) => {

  if (!props.nearbyCities || props.nearbyCities?.length === 0) return <></>;
   
  const [MobilecardsToShowJSX, setMobileCardsToShowJSX] = useState([]);
  const [cards, setCards] = useState([])
  const [hide , setHide] = useState(false)

  useEffect(() => {
    
let cardsArr = []
let MobileCardsArr = []
let count = 0
for(let i = 0;i<props.nearbyCities.length;i++){
  if(i%4==0 && i!=0){
      let n = cardsArr.length;
      const el = cardsArr.slice(n-4,n)
      MobileCardsArr.push(<MobileCardsContainer>{el.map(e=>e)}</MobileCardsContainer>)
    count++
    }
  cardsArr.push(
    <Card
    key={props.nearbyCities[i].id}
    location={props.nearbyCities[i].name}
    heading={props.nearbyCities[i].most_popular_for[props.nearbyCities[i].most_popular_for.length-1]}
    img={props.nearbyCities[i].image}
    slug={props.nearbyCities[i].slug}
    link={props.nearbyCities[i].slug}
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

  }, []);


  let isPageWide = media('(min-width: 768px)')
const router = useRouter()
  return (
    <>
      <Heading>Nearby Locations to {props.data.name}</Heading>

      {isPageWide ? (
        <>
          {cards.length ? (
            <Carousel
              initialIndex={0}
              hideSides
              groupCells={6}
              numberOfCards={6}
              cards={cards}
            ></Carousel>
          ) : (
            <DesktopSkeleton />
          )}
          <Button
            onclick={() =>
              openTailoredModal(router, props.data.id, props.data.name)
            }
            borderWidth="1px"
            fontSizeDesktop="16px"
            fontWeight="600"
            borderRadius="6px"
            margin="2rem auto"
            padding="0.5rem 2rem"
          >
            Unlock your personalized adventure
          </Button>
        </>
      ) : (
        <div>
          {MobilecardsToShowJSX.length ? (
            <PageDotsFlickity
              padding={"0.2rem"}
              initialIndex
              cards={MobilecardsToShowJSX}
            ></PageDotsFlickity>
          ) : (
            <MobileSkeleton />
          )}
        </div>
      )}
    </>
  );
}

export default NearbyLocations