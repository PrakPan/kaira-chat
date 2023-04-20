import React, { useState, useEffect } from 'react';
import Transition from 'react-transition-group/Transition';
 import Loading from '../../components/LoadingPage';
import ChatBot from '../../components/chatbot/Experience';
 import FullImageContent from '../homepage/search/SearchFullImgContent';
import FullImage from '../../components/FullImage';
import Menu from './Menu';
import FullScreenGallery from '../../components/fullscreengallery/Index';
import DesktopPersonaliseBanner from '../../components/containers/Banner' ;
import media from '../../components/media';
import { useRouter } from 'next/router';
import axioscityinstance from '../../services/poi/city'
 import POIModal from '../../components/modals/poi/Index';
import validateTextSize from '../../services/textSizeValidator';
import HeroBanner from '../../components/containers/HeroBanner/HeroBanner';
import NewMenu from '../newcityplanner/Menu'
import TailoredFormMobileModal from '../../components/modals/TailoredFomrMobile';
import MobileBanner from './Banner/Mobile'
import WhatsappFloating from '../../components/WhatsappFloating';

const Experience = (props) => {
   let isPageWide = media('(min-width: 768px)')
  // const [poiData, setPoiData] = useState();
  // const [showPoiModal, setShowPoiModal] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [scroll, setScroll] = useState(0);
  const [cityLoaded, setCityLoaded] = useState(false); //True when expereince data fetched
  const [galleryimages, setGalleryImages] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [brief, setBreif] = useState(null);
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);


  const [cityData, setCityData] = useState({
    data: {
      name: null,
      experience_filters: ['']
    },
  });
  const [showMoiblePlanner, setShowMobilePlanner] = useState(false);
  const router = useRouter();
  const _handlePersonaliseRedirect = () => {

    localStorage.setItem('search_city_selected_id', props.cityData.id)
    localStorage.setItem('search_city_selected_name',  props.cityData.name)
    localStorage.setItem('search_city_selected_parent',  props.cityData.state.name)


    router.push('/tailored-travel')
  }



  useEffect(() => {
    // if(!showPoiModal) window.scrollTo(0,scroll);

  });

  useEffect(() => {


    axioscityinstance
      .get(
        `/?slug=`+props.id
      )
      .then((res) => {

        setCityData({
          ...cityData,
          data: res.data,
        });
        setCityLoaded(true);
        let images = [ ]
        for(var i = 0 ; i<res.data.images.length; i++){
          images.push(res.data.images[i].image);
        }
        setGalleryImages(images);
        window.scrollTo(0, 0);

      })
      .catch((error) => {
        alert('Page could not be loaded. Please try again.');
      });


 
  }, []);
console.log(props , 'rrprops')

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
            text={validateTextSize(`Craft a personalized itinerary to ${props.cityData.name} now!`,9,`Craft a trip to ${props.cityData.name} now!`)}
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
            title={`Things to do in ${props.cityData.name}`}
            _startPlanningFunction={()=>setShowMobilePlanner(true)}
          />
          <NewMenu
            data={props.cityData}
            destination={props.cityData.name}
            cities={props.reccomendedCitiesData}
            thingsToDoPage={true}
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
  // }

export default React.memo(Experience);
