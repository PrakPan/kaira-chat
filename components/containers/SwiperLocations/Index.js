import React from "react";
import { LocationCard } from "../../cards/Location";
import media from "../../media";
import SwiperCarousel from "../../SwiperCarousel";
import Link from "next/link";
import { logEvent } from "../../../services/ga/Index";

const LocationsBlog = (props) => {
  let isPageWide = media("(min-width: 768px)");
  let cardsarr = [];

  const _handleRedirect = (location) => {
    logEvent({
      action: "View_Destination",
      params: {
        page: props?.page ? props.page : "",
        event_category: "Click",
        event_label: "View Destination",
        event_value: location?.name,
        event_action: `Top countries to visit${
          props.continent && " in " + props.continent
        }`,
      },
    });
  };

  for (var i = 0; i < props.locations.length; i++) {
    let name = "";
    let id;
    let path;
    if (props.locations[i].name) name = props.locations[i].name;
    if (props.locations[i].id) id = props.locations[i].id;
    if (props.locations[i].path) path = props.locations[i].path;

    if (props.locations[i].image)
      cardsarr.push(
        <Link href={"/" + path} style={{ textDecoration: "none" }}>
          <LocationCard
            key={i}
            location={props.locations[i]}
            name={props.locations[i].name ? props.locations[i].name : ""}
            heading={
              props.locations[i].tagline ? props.locations[i].tagline : ""
            }
            img={props.locations[i].image}
            onclick={() => _handleRedirect(props.locations[i])}
          ></LocationCard>
        </Link>
      );
  }

  if (isPageWide) {
    if (props.locations.length)
      return (
        <SwiperCarousel
          navigationButtons
          cards={cardsarr}
          slidesPerView={5}
          buttonSize={60}
        ></SwiperCarousel>
      );
    else return null;
  } else
    return (
      <div>
        <div style={{ padding: "1rem 0" }}>
          <SwiperCarousel
            slidesPerView={1.3}
            initialSlide={1}
            centeredSlides
            cards={cardsarr}
          ></SwiperCarousel>
        </div>
      </div>
    );
};

export default LocationsBlog;
