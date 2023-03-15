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
const Experience = (props) => {
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
        <div style={isPageWide?{minHeight: '100vh'}:{}}>
          {isPageWide ? <DesktopPersonaliseBanner onclick={_handlePersonaliseRedirect} text="Want to personalize your own experience?"></DesktopPersonaliseBanner>:<MobileBanner/>}
      <WhatsappFloating message="Hey, I need help planning my trip." />
          <div>
          <ExperienceGallery  filter={ props.cityData.most_popular_for ? props.cityData.most_popular_for[0] : null}  experienceLoaded={true} title={props.cityData.name} region={ props.cityData.state_name } duration={ props.cityData.ideal_duration_days+" Days" } setGalleryOpen={setGalleryOpen} images={props.cityData.images}  />
            
            {/* New city */}

<NewMenu data={props.cityData} />
            
            {/* old city */}



            {/* <Menu slug={props.id} _openPoiModal={(poi) => _openPoiModal(poi)}   setGalleryOpen={() => setGalleryOpen(true)} title={props.cityData.name} data={props.cityData} experienceLoaded={true} itinerary={itinerary} brief={brief} bookings={booking} payment={payment}  images={props.cityData.images} setGalleryImages={(imagesArr) => setGalleryImages(imagesArr)}></Menu>
          <POIModal poi={poiData} show={showPoiModal} onHide={_closePoiModal}></POIModal>

          <Transition in={!props.cityData} timeout={1000} unmountOnExit>
              { state => 
              <div
              className="center-div"
              style={{
                backgroundColor: "#F7e700",
                 width: '100vw',
                 transition: 'all 1s ease-out',
                 zIndex: '2500',
                  height: '100vh',
                 position: 'fixed',
                 left: state=='exiting' ? '-100vw' : 0,
                 top: '0',
                 }}>
                 <Loading/>
                 </div>
              }
               </Transition> */}
            </div>
        </div>
      );
  }

export default Experience;
