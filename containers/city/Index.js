import React, { useState, useEffect } from 'react';
import Transition from 'react-transition-group/Transition';
 import Loading from '../../components/LoadingPage';
import ExperienceGallery from './landing/Index';
import Menu from './Menu';
import FullScreenGallery from '../../components/fullscreengallery/Index';
import DesktopPersonaliseBanner from '../../components/containers/Banner' ;
import media from '../../components/media';
import { useRouter } from 'next/router';
import POIModal from '../../components/modals/poi/Index';
import NewMenu from '../newcityplanner/Menu'
import MobileBanner from './Banner/Mobile'
import WhatsappFloating from '../../components/WhatsappFloating';
import HeroBanner from '../../components/containers/HeroBanner/HeroBanner';
import TailoredFormMobileModal from '../../components/modals/TailoredFomrMobile';
const Experience = (props) => {
  const [escapeState, setEscapeState] = useState(false);
  const [showMoiblePlanner, setShowMobilePlanner] = useState(false);

  useEffect(() => {
    //Escape hatch for mobile images, do not remove
    setEscapeState(true)
   }, []);
   let isPageWide = media('(min-width: 768px)')
  const [poiData, setPoiData] = useState();
  const [showPoiModal, setShowPoiModal] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
   const [galleryimages, setGalleryImages] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [brief, setBreif] = useState(null);
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [experienceData, setExperienceData] = useState({
    data: {
      name: null,
      experience_filters: ['']
    },
  });
  const router = useRouter();
  const _handlePersonaliseRedirect = () => {
     localStorage.setItem('search_city_selected_id', props.cityData.id)
    localStorage.setItem('search_city_selected_name', props.cityData.name)
    localStorage.setItem('search_city_selected_parent', props.cityData.state.name)


    router.push('/tailored-travel')
  }
  const _openPoiModal = (poi) => {
    setPoiData({...poi});
    document.getElementById("html").classList.add('overlfow-hidden');

    setShowPoiModal(true);
  }
  const _closePoiModal = () => {
    document.getElementById("html").classList.remove('overlfow-hidden');

    setShowPoiModal(false);
  }
 
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
                   onclick={_handlePersonaliseRedirect}
                   text={`Craft a trip to ${props.cityData.name} now!`}
                 ></DesktopPersonaliseBanner>
               ) : (
                 <MobileBanner cityName={props.cityData.name} onClick={()=>setShowMobilePlanner(true)} />
               )}
               <WhatsappFloating message="Hey, I need help planning my trip." />
               <div>

                 <HeroBanner
                   image={props.cityData.images[0].image}
                   page_id={props.cityData.id}
                   destination={props.cityData.name}
                   cities={props.reccomendedCitiesData}
                   //  children_cities={props.experienceData.children}
                   title={`${props.cityData.name} trip planner`}
                  setShowMobilePlanner={setShowMobilePlanner}

                 />


                 <NewMenu
                   data={props.cityData}
                   destination={props.cityData.name}
                   cities={props.reccomendedCitiesData}
                 />
               </div>

               <TailoredFormMobileModal
          page_id={props.cityData.id}
          destination={props.cityData.name}
          // cities={props.experienceData.locations}
          // children_cities={props.experienceData.children}
          onHide={() => setShowMobilePlanner(false)}
          show={showMoiblePlanner}
        ></TailoredFormMobileModal>

             </div>
           );
  }

export default Experience;
