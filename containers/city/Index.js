import React, { useState, useEffect } from 'react';
import FullScreenGallery from '../../components/fullscreengallery/Index';
import DesktopPersonaliseBanner from '../../components/containers/Banner' ;
import media from '../../components/media';
import { useRouter } from 'next/router';
import NewMenu from '../newcityplanner/Menu'
import MobileBanner from './Banner/Mobile'
import WhatsappFloating from '../../components/WhatsappFloating';
import HeroBanner from '../../components/containers/HeroBanner/HeroBanner';
import validateTextSize from '../../services/textSizeValidator';
import openTailoredModal from '../../services/openTailoredModal';
const Experience = (props) => {
  const [escapeState, setEscapeState] = useState(false);

  useEffect(() => {
    //Escape hatch for mobile images, do not remove
    setEscapeState(true)
   }, []);
   let isPageWide = media('(min-width: 768px)')
  const [galleryOpen, setGalleryOpen] = useState(false);
   const [galleryimages, setGalleryImages] = useState([]);
  const router = useRouter();
 
  const closeGalleryHandler = () => {
    let images = [];
    for(var i = 0 ; i<props.cityData.images.length; i++){
      images.push(props.cityData.images[i].image);
    }    setGalleryImages(images);
    setGalleryOpen(false);
  }
      if(galleryOpen) return(<FullScreenGallery closeGalleryHandler={closeGalleryHandler} images={galleryimages} ></FullScreenGallery >);
      else return (
        <div
          className="font-lexend"
          style={isPageWide ? { minHeight: "100vh" } : {}}
        >
          {isPageWide ? (
            <DesktopPersonaliseBanner
              onclick={() =>
                openTailoredModal(
                  router,
                  props.cityData.id,
                  props.cityData.name
                )
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
                openTailoredModal(
                  router,
                  props.cityData.id,
                  props.cityData.name
                )
              }
            />
          )}
          <WhatsappFloating message="Hey, I need help planning my trip." />
          <div>
            <HeroBanner
              image={props.cityData.images[0].image}
              page_id={props.cityData.id}
              destination={props.cityData.name}
              cities={props.reccomendedCitiesData}
              title={`${props.cityData.name} Trip Planner`}
            />

            <NewMenu
              data={props.cityData}
              destination={props.cityData.name}
              nearbyCities={props.reccomendedCitiesData}
            />
          </div>
        </div>
      );
  }

export default Experience;
