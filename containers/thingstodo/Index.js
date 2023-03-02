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


  const closeGalleryHandler = () => {
    let images = [];
    for(var i = 0 ; i<props.cityData.images.length; i++){
      images.push(props.cityData.images[i].image);
    }    setGalleryImages(images);
    setGalleryOpen(false);
  }
     if (isPageWide){
      //Open Gallery
      if(galleryOpen) return(<FullScreenGallery closeGalleryHandler={closeGalleryHandler} images={galleryimages} ></FullScreenGallery >);
      //Open experience page
      else return (
        <div style={{minHeight: '100vh'}}>
          <DesktopPersonaliseBanner onclick={_handlePersonaliseRedirect} text="Want to personalize your own experience?"></DesktopPersonaliseBanner>
          <div>
          <FullImage center url={cityLoaded ? props.cityData.images[0].image  : ''}>
            <FullImageContent city tagline={props.cityData.nicknames.length ? props.cityData.nicknames[0] : ''} text={props.cityData.tagline}/>
          </FullImage>            
          <Menu slug={props.id}    setGalleryOpen={() => setGalleryOpen(true)} title={props.cityData.name} data={props.cityData} experienceLoaded={cityLoaded} itinerary={itinerary} brief={brief} bookings={booking} payment={payment}  images={props.cityData.images} setGalleryImages={(imagesArr) => setGalleryImages(imagesArr)}></Menu>
          <ChatBot history={props.history} />
          {/* <POIModal poi={poiData} show={showPoiModal} onHide={_closePoiModal}></POIModal> */}
        </div>
        {/* <Loading hide={experienceLoaded}></Loading> */}
          <Transition in={!cityLoaded} timeout={1000} unmountOnExit>
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
               </Transition>
        </div>
      );
      }
    else{
      if(galleryOpen) return(<FullScreenGallery closeGalleryHandler={closeGalleryHandler} images={galleryimages}  ></FullScreenGallery>);
      else
      return (

        <div style={{}}>
          <FullImage center url={cityLoaded ? props.cityData.images[0].image : null}>
            <FullImageContent city tagline={props.cityData.nickname} text={props.cityData.tagline}/>
          </FullImage>
          <Menu slug={props.id} _openPoiModal={(poi) => _openPoiModal(poi)} setGalleryOpen={() => setGalleryOpen(true)} setGalleryImages={(imagesArr) => setGalleryImages(imagesArr)} title={props.cityData.name} data={props.cityData} experienceLoaded={cityLoaded} itinerary={itinerary} brief={brief} bookings={booking} payment={payment}  images={cityData.data.images}></Menu>
          {/* <POIModal poi={poiData} show={showPoiModal} onHide={_closePoiModal}></POIModal> */}
          <Transition in={!cityLoaded} timeout={1000} unmountOnExit>
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

export default React.memo(Experience);
