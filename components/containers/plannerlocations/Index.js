import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Card from "./Card";
import media from "../../media";
import { useRouter } from "next/router";
import Button from "../../ui/button/Index";
import DesktopSkeleton, { MobileSkeleton } from "./LocationSkeleton";
import * as ga from "../../../services/ga/Index";
import openTailoredModal from "../../../services/openTailoredModal";
import SwiperCarousel from "../../SwiperCarousel";
/* Used to display grid (desktop) / carousel of location images 
  inputs:locations (array of objects), viewall (guide page)
*/

const MobileCardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const LocationsBlog = (props) => {
  let isPageWide = media("(min-width: 768px)");

  const router = useRouter();
  const [MobilecardsToShowJSX, setMobileCardsToShowJSX] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
<<<<<<< HEAD
    let cards=[];
    // let count = 0;
    
    axiospagelistinstance
      .get(
        ``
      )
      .then((res) => {

for(var i = 0 ; i < res.data.length; i++){
  if(res.data[i].page_type === "Destination")
  if(router.query.link!== res.data[i].link){
// count++;
// console.log('d', res.data[i])
  cards.push(
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
  console.log(props.locations.length, offset)
  return(
      <><div className='hidden-mobile'>
        <Container >  
               {cardsToShowJSX}
      </Container>
       { cardsJSX.length ? cardsJSX.length > offset ?  <Button  onclick={_showMoreLocations} hoverBgColor="black" fontSizeDesktop="12px" fontWeight="600" hoverColor="white" borderWidth="1px" borderRadius="6px" margin="1.5rem auto" padding="0.5rem 2rem" >View More</Button> :  null: null}
      </div>
 
    <div className='hidden-desktop'>       
          <div style={{ padding: "1rem 0"}}>
            <Carousel cards={cardsToShowJSX}></Carousel>
    </div>
    {props.viewall ? <Button  onclick={_showMoreLocations}  onclickparams={null} borderWidth="1px" fontSizeDesktop="12px" fontWeight="600" borderRadius="6px" margin="auto" padding="0.5rem 2rem" >View More</Button> : null}
  </div></>
  )
  ;
}
=======
    if (props.locations) {
      let cardsArr = [];
      let MobileCardsArr = [];
      let count = 0;
      for (let i = 0; i < props.locations.length; i++) {
        if (i % 4 == 0 && i != 0) {
          let n = cardsArr.length;
          const el = cardsArr.slice(n - 4, n);
          MobileCardsArr.push(
            <MobileCardsContainer>
              {el.map((e, i) => (
                <div key={i}>{e}</div>
              ))}
            </MobileCardsContainer>
          );
          count++;
        }
        cardsArr.push(
          <Card
            key={props.locations[i].id}
            ancestors={props.locations[i].ancestors}
            path={props.locations[i].path}
            location={props.locations[i].destination || props.locations[i].name}
            heading={props.locations[i].tagline}
            img={props.locations[i].image}
            slug={props.locations[i].link}
            link={props.locations[i].link}
            country={props.country}
          ></Card>
        );
      }
      if (count % 4 != 0 || count == 0) {
        const el = cardsArr.slice(count * 4, cardsArr.length);
        MobileCardsArr.push(
          <MobileCardsContainer>
            {el.map((e, i) => (
              <div key={i}>{e}</div>
            ))}
          </MobileCardsContainer>
        );
      }
      setCards(cardsArr);
      setMobileCardsToShowJSX(MobileCardsArr);
    }
  }, []);

  if (isPageWide)
    return (
      <div>
        {cards.length ? (
          <SwiperCarousel
            navigationButtons={true}
            slidesPerView={6}
            cards={cards}
          ></SwiperCarousel>
        ) : (
          <DesktopSkeleton />
        )}
        <Button
          onclick={() =>
            openTailoredModal(router, props.page_id, props.destination)
          }
          borderWidth="1px"
          fontSizeDesktop="16px"
          fontWeight="500"
          borderRadius="6px"
          margin="2rem auto"
          padding="0.5rem 2rem"
        >
          Unlock your personalized adventure
        </Button>
      </div>
    );
  else
    return (
      <div>
        <div style={{ padding: "1rem 0" }}>
          {MobilecardsToShowJSX.length ? (
            <SwiperCarousel
              slidesPerView={1}
              cards={MobilecardsToShowJSX}
              pageDots
            ></SwiperCarousel>
          ) : null}
        </div>
      </div>
    );
};
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707

export default LocationsBlog;
