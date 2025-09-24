import React, { useState } from "react";
import FullScreenGallery from "../../components/fullscreengallery/Index";
import DesktopPersonaliseBanner from "../../components/containers/Banner";
import media from "../../components/media";
import { useRouter } from "next/router";
import NewMenu from "../newcityplanner/Menu";
import MobileBanner from "./Banner/Mobile";
import HeroBanner from "../../components/containers/HeroBanner/HeroBanner";
import validateTextSize from "../../services/textSizeValidator";
import openTailoredModal from "../../services/openTailoredModal";
import { convertDbNameToCapitalFirst } from "../../helper/convertDbnameToCapitalFirst";

const Experience = (props) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryimages, setGalleryImages] = useState([]);
  const router = useRouter();
  let isPageWide = media("(min-width: 768px)");

  const closeGalleryHandler = () => {
    let images = [];
    for (var i = 0; i < props.cityData.images.length; i++) {
      images.push(props.cityData.images[i].image);
    }
    setGalleryImages(images);
    setGalleryOpen(false);
  };

  if (galleryOpen)
    return (
      <FullScreenGallery
        closeGalleryHandler={closeGalleryHandler}
        images={galleryimages}
      ></FullScreenGallery>
    );
  else
    return (
      <div
        className=""
        style={isPageWide ? { minHeight: "100vh" } : {}}
      >
        {isPageWide ? (
          <DesktopPersonaliseBanner
            onclick={() =>
              openTailoredModal(router, props.cityData.id, props.cityData.name,props.type)
            }
            text={validateTextSize(
              `Craft a personalized itinerary to ${props.cityData.name} now!`,
              9,
              `Craft a trip to ${props.cityData.name} now!`
            )}
          ></DesktopPersonaliseBanner>
        ) : (
          <MobileBanner
            cityName={props.cityData.name}
            onClick={() =>
              openTailoredModal(router, props.cityData.id, props.cityData.name,props.type)
            }
          />
        )}
        <div>
          <HeroBanner
            image={props.cityData.images[0].image}
            destination={convertDbNameToCapitalFirst(props.cityData.name)}
            cities={props.reccomendedCitiesData}
            title={`${props.cityData.name} Trip Planner`}
            page={"City Page"}
            page_id={props?.page_id}
            type={props?.type}
          />

          <NewMenu
            data={props.cityData}
            destination={props.cityData.name}
            nearbyCities={props.reccomendedCitiesData}
            removeDelete={true}
          />
        </div>
      </div>
    );
};

export default Experience;
