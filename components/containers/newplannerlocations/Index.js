import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Card from "./Card";
import { useRouter } from "next/router";
import SwiperCarousel from "../../SwiperCarousel";

const MobileCardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const LocationsBlog = (props) => {
  const router = useRouter();
  const [cardsToShowJSX, setCardsToShowJSX] = useState([]);
  const [cardsToShowJSXmobile, setCardsToShowJSXmobile] = useState([]);

  useEffect(() => {
    let cardsarr = [];
    let MobileCardsArr = [];

    var i = 0;
    let count = 0;

    if (props.locations) {
      for (i = 0; i < props.locations.length; i++) {
        if (i % 4 == 0 && i != 0) {
          let n = cardsarr.length;
          const el = cardsarr.slice(n - 4, n);
          MobileCardsArr.push(
            <MobileCardsContainer>
              {el.map((e, i) => (
                <div key={i}>{e}</div>
              ))}
            </MobileCardsContainer>
          );
          count++;
        }
        try {
          if (router.pathname !== props.locations[i].slug) {
            cardsarr.push(
              <>
                <Card
                  data={props.locations[i]}
                  key={props.locations[i].tagline}
                  location={props.locations[i].name}
                  heading={props.locations[i].tagline}
                  img={props.locations[i].image}
                  path={props.locations[i].path}
                  filters={props.locations[i].most_popular_for}
                  page={props?.page}
                  state={props?.state}
                ></Card>
              </>
            );
          }
        } catch {}
      }
    }
    if (count === 0 || count % 4 !== 0) {
      const el = cardsarr.slice(count * 4, cardsarr.length);
      MobileCardsArr.push(
        <MobileCardsContainer>
          {el.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </MobileCardsContainer>
      );
    }
    setCardsToShowJSX(cardsarr);
    setCardsToShowJSXmobile(MobileCardsArr);
  }, [props.locations]);

  return (
    <>
      <div className="hidden-mobile new-planner-location">
        <SwiperCarousel
          navigationButtons={true}
          slidesPerView={6}
          cards={cardsToShowJSX}
          navButtonsTop={"38%"}
        ></SwiperCarousel>
      </div>

      <div className="hidden-desktop">
        <div style={{ padding: "1rem 0" }}>
          <SwiperCarousel
            slidesPerView={1}
            pageDots
            cards={cardsToShowJSXmobile}
          ></SwiperCarousel>
        </div>
      </div>
    </>
  );
};

export default LocationsBlog;
