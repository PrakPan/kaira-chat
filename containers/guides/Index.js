import React, { useState, useEffect } from 'react';
import Transition from 'react-transition-group/Transition';
import axios from 'axios';
import Loading from '../../components/LoadingPage';
import Menu from './Menu';
import DesktopPersonaliseBanner from '../../components/containers/Banner' ;
import media from '../../components/media';
import { useRouter } from 'next/router';
 import FullImage from '../../components/FullImage';
import FullImgContent from '../homepage/search/SearchFullImgContent';
import openTailoredModal from '../../services/openTailoredModal';
const Experience = (props) => {
   let isPageWide = media('(min-width: 768px)')

 


 
  const router = useRouter();

  //If experience data fetched
    if (isPageWide){
      //Open Gallery
      // if(galleryOpen) return(<FullScreenGallery closeGalleryHandler={closeGalleryHandler} images={galleryimages} ></FullScreenGallery >);
      //Open experience page
       return (
        <div style={{minHeight: '100vh'}}>
          <DesktopPersonaliseBanner onclick={()=>openTailoredModal(router)} text="Want to personalize your own experience?"></DesktopPersonaliseBanner>
          <div>
            <FullImage filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))"   center url={true ? 'media/website/Cropped guide home.png' : ""} >
            <FullImgContent tagline="Travel Guides" text="Wherever you go becomes a part of you somehow"/>

            </FullImage>
          {/* <ExperienceGallery  filter={experienceLoaded && experienceData.data.most_popular_for ? experienceData.data.most_popular_for[0] : null}  experienceLoaded={experienceLoaded} title={experienceData.data.name} region={experienceLoaded ? experienceData.data.state_name : null} duration={experienceLoaded ? experienceData.data.ideal_duration_days+" Days" : null} setGalleryOpen={setGalleryOpen} images={experienceData.data.images}  /> */}
            <Menu  data={props.guideData}      ></Menu>
        </div>
        {/* <Loading hide={experienceLoaded}></Loading> */}
          <Transition in={!props.guideData} timeout={1000} unmountOnExit>
              { state => 
              <div
              className="center-div"
              style={{
                backgroundColor: "#F7e700",
                 width: '100vw',
                 transition: 'all 1s ease-out',
                 zIndex: '1000',
                  height: '100vh',
                 position: 'fixed',
                 left: state=='exiting' ? '-100vw' : 0,

                 top: '0',
                 }}>
                 <Loading/>
                 </div>
              }
               {/* <div style={{backgroundColor: '#F7e700', height: '50vh'}}></div> */}
               </Transition>
        </div>
      );
      }
    else{
      // if(galleryOpen) return(<FullScreenGallery closeGalleryHandler={closeGalleryHandler} images={galleryimages}  ></FullScreenGallery>);
      return (

        <div style={{}}>
          {/* <ExperienceGallery   filter={experienceLoaded && experienceData.data.most_popular_for ? experienceData.data.most_popular_for[0] : null}  experienceLoaded={experienceLoaded} title={experienceData.data.name} region={experienceLoaded ? experienceData.data.state_name : null} duration={experienceLoaded ? experienceData.data.ideal_duration_days+" Days" : null}  setGalleryOpen={setGalleryOpen} images={experienceData.data.images}  /> */}
          <FullImage filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))"   url={true ? "media/website/Cropped guide home.png" : ""} >
              <FullImgContent tagline="Travel Guides" text="Wherever you go becomes a part of you somehow"/>
          </FullImage>
          <Menu   data={props.guideData}   ></Menu>
          <Transition in={!props.guideData} timeout={1000} unmountOnExit>
              { state => 
              <div
              className="center-div"
              style={{
                width: '100vw',
                backgroundColor: "#F7e700",
                 transition: 'all 1s linear',
                 zIndex: '2500',
                  height: '100vh',
                 position: 'fixed',
                 top: '0',
                 left: state=='exiting' ? '-100vw' : 0,
                 }}>
                 <Loading/>
                 </div>
              }
               {/* <div style={{backgroundColor: '#F7e700', height: '50vh'}}></div> */}
               </Transition>
        </div>
      );
    }
  }

export default Experience;
