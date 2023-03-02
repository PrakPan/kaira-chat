import React, { useState, useEffect } from 'react';
import Transition from 'react-transition-group/Transition';
import axios from 'axios';
import Loading from '../../components/LoadingPage';
import ChatBot from '../../components/chatbot/Experience';
import ExperienceGallery from './landing/Index';
import Menu from './Menu';
import FullScreenGallery from '../../components/fullscreengallery/Index';
import DesktopPersonaliseBanner from '../../components/containers/Banner' ;
import media from '../../components/media';
import { useRouter } from 'next/router';
import axioscityinstance from '../../services/poi/city'
const Experience = (props) => {
   let isPageWide = media('(min-width: 768px)')

 
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [experienceLoaded, setExperienceLoaded] = useState(false); //True when expereince data fetched
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
    router.push('/tailored-travel')
  }
  //Close full screen gallery
  

  //Fetch itinerary and breif 


  //Fetch bookings

  //Fetch bookings if breif and itinerary fetched

//Fetch payment info once itinerary, brief, bookings fetched

// if(brief && booking && itinerary && !payment){

//   fetch("https://suppliers.tarzanway.com/payment/info/?itinerary_type=Experience&experience_id="+props.match.params.id)
//   .then(response =>  {
//       if(response.status === 200){
//         response.json().then(json => {
//           setPayment(json);
//       })
//       }
//     })
// }

// Fetch experience on page load
  useEffect(() => {
  


    axioscityinstance
      .get(
        `/?slug=`+props.id
      )
      .then((res) => {

        setExperienceData({
          ...experienceData,
          data: res.data,
        });
        setExperienceLoaded(true);
        //Fetch itinerary and breif once experience loaded
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
    for(var i = 0 ; i<experienceData.data.images.length; i++){
      images.push(experienceData.data.images[i].image);
    }    setGalleryImages(images);
    setGalleryOpen(false);
  }

  //If experience data fetched
    if (isPageWide){
      //Open Gallery
      if(galleryOpen) return(<FullScreenGallery closeGalleryHandler={closeGalleryHandler} images={galleryimages} ></FullScreenGallery >);
      //Open experience page
      else return (
        <div>
          <DesktopPersonaliseBanner onclick={_handlePersonaliseRedirect} text="Want to personalize your own experience?"></DesktopPersonaliseBanner>
          <div>
          <ExperienceGallery  filter={'Adveture & Test'}  experienceLoaded={experienceLoaded} title={experienceData.data.name} region={'Himachal Test'} duration={'Test'}  setGalleryOpen={setGalleryOpen} images={experienceData.data.images}  />
            <Menu  setGalleryOpen={() => setGalleryOpen(true)} title={experienceData.data.name} data={experienceData.data} experienceLoaded={experienceLoaded} itinerary={itinerary} brief={brief} bookings={booking} payment={payment}  images={experienceData.data.images} setGalleryImages={(imagesArr) => setGalleryImages(imagesArr)}></Menu>
          <ChatBot history={props.history} />
        </div>
        {/* <Loading hide={experienceLoaded}></Loading> */}
          <Transition in={!experienceLoaded} timeout={1000} unmountOnExit>
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
      if(galleryOpen) return(<FullScreenGallery closeGalleryHandler={closeGalleryHandler} images={galleryimages}  ></FullScreenGallery>);
      else
      return (

        <div style={{}}>
          <ExperienceGallery  filter={'Adveture & Test'}  experienceLoaded={experienceLoaded} title={experienceData.data.name} region={'Himachal Test'} duration={'Test'}  setGalleryOpen={setGalleryOpen} images={experienceData.data.images}  />
          <Menu setGalleryOpen={() => setGalleryOpen(true)} setGalleryImages={(imagesArr) => setGalleryImages(imagesArr)} title={experienceData.data.name} data={experienceData.data} experienceLoaded={experienceLoaded} itinerary={itinerary} brief={brief} bookings={booking} payment={payment}  images={experienceData.data.images}></Menu>
          <Transition in={!experienceLoaded} timeout={1000} unmountOnExit>
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
