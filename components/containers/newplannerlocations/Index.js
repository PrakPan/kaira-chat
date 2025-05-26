import React, { useState, useEffect } from "react";
import Card from "./Card";
import { useRouter } from "next/router";
import SwiperCarousel from "../../SwiperCarousel";

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
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              {el.map((e, i) => (
                <div key={i}>{e}</div>
              ))}
            </div>
          );
          count++;
        }
        try {
          if (router.pathname !== props.locations[i].slug) {
            cardsarr.push(
              <>
                <Card
                  key={props.locations[i].name}
                  data={props.locations[i]}
                  location={props.locations[i].name}
                  heading={
                    props.locations[i]?.name
                      ? props.locations[i].name
                      : props.locations[i]?.name
                  }
                  img={props.locations[i].image}
                  path={
                    props.locations[i]?.path
                      ? props.locations[i].path
                      : props.locations[i].cta_path
                  }
                  tags={
                    props.locations[i].tags
                      ? props.locations[i].tags
                      : props.locations[i].most_popular_for
                  }
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
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          {el.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
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
          navButtonsTop={"40%"}
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
