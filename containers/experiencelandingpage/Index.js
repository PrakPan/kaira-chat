import React, { useState, useEffect } from 'react';
import Transition from 'react-transition-group/Transition';
import axios from 'axios';
import Loading from '../../components/LoadingPage';
// import ChatBot from '../../components/chatbot/Experience';
import ExperienceGallery from './landing/Index';
import Menu from './Menu';
import FullScreenGallery from '../../components/fullscreengallery/Index';
import DesktopPersonaliseBanner from '../../components/containers/Banner';
import media from '../../components/media';
import { useRouter } from 'next/router';
const Experience = (props) => {
  let isPageWide = media('(min-width: 768px)');

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryimages, setGalleryImages] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [brief, setBreif] = useState(null);
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);

  const router = useRouter();

  //Close full screen gallery

  //Fetch itinerary and breif
  const _setItineraryHandler = (id) => {
    axios
      .get(
        'https://suppliers.tarzanway.com/sales/itinerary/preview/day_by_day/?itinerary_id=' +
          id
      )
      .then((res) => {
        setItinerary(res.data);
      })
      .catch((error) => {});
    axios
      .get(
        `https://suppliers.tarzanway.com/sales/itinerary/preview/brief/?itinerary_id=` +
          id
      )
      .then((res) => {
        setBreif(res.data);
      })
      .catch((error) => {});
  };

  //Fetch bookings

  //Fetch bookings if breif and itinerary fetched
  if (brief && itinerary && !booking) {
    fetch(
      'https://suppliers.tarzanway.com/sales/bookings/?itinerary_id=' +
        props.experienceData.itinerary_id,
      {}
    ).then((response) => {
      if (response.status === 200) {
        response.json().then((json) => {
          setBooking(json.bookings);
          window.scrollTo(0, 0);
        });
      }
    });
  }
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
    _setItineraryHandler(props.experienceData.itinerary_id);
    const images = [
      props.experienceData.images.main_image,
      props.experienceData.images.image_1,
      props.experienceData.images.image_2,
      props.experienceData.images.image_3,
      props.experienceData.images.image_4,
    ];
    setGalleryImages(images);
    window.scrollTo(0, 0);
  }, []);

  const closeGalleryHandler = () => {
    const images = [
      props.experienceData.images.main_image,
      props.experienceData.images.image_1,
      props.experienceData.images.image_2,
      props.experienceData.images.image_3,
      props.experienceData.images.image_4,
    ];
    setGalleryImages(images);
    setGalleryOpen(false);
  };

  //If experience data fetched
  if (true) {
    //Open Gallery
    if (galleryOpen)
      return (
        <FullScreenGallery
          closeGalleryHandler={closeGalleryHandler}
          images={galleryimages}
        ></FullScreenGallery>
      );
    //Open experience page
    else
      return (
        <div>
          <div>
            <ExperienceGallery
              filter={props.experienceData.experience_filters[0]}
              rating={props.experienceData.rating}
              title={props.experienceData.name}
              filters={props.experienceData.experience_filters}
              region={props.experienceData.experience_region}
              duration={props.experienceData.duration}
              setGalleryOpen={setGalleryOpen}
              images={props.experienceData.images}
            />
            <Menu
              setGalleryOpen={() => setGalleryOpen(true)}
              title={props.experienceData.name}
              data={props.experienceData}
              itinerary={itinerary}
              brief={brief}
              bookings={booking}
              payment={payment}
              images={props.experienceData.images}
              setGalleryImages={(imagesArr) => setGalleryImages(imagesArr)}
            ></Menu>
            {/* <ChatBot history={props.history} /> */}
          </div>
          {/* <Transition in={!brief} timeout={1000} unmountOnExit>
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
               </Transition> */}
        </div>
      );
  } else {
    if (galleryOpen)
      return (
        <FullScreenGallery
          closeGalleryHandler={closeGalleryHandler}
          images={galleryimages}
        ></FullScreenGallery>
      );
    else
      return (
        <div>
          <ExperienceGallery
            filter={props.experienceData.experience_filters[0]}
            rating={props.experienceData.rating}
            title={props.experienceData.name}
            region={props.experienceData.experience_region}
            duration={props.experienceData.duration}
            filters={props.experienceData.experience_filters}
            setGalleryOpen={setGalleryOpen}
            images={props.experienceData.images}
          />
          <Menu
            setGalleryOpen={() => setGalleryOpen(true)}
            setGalleryImages={(imagesArr) => setGalleryImages(imagesArr)}
            title={props.experienceData.name}
            data={props.experienceData}
            itinerary={itinerary}
            brief={brief}
            bookings={booking}
            payment={payment}
          ></Menu>
          {/* <Transition in={!brief} timeout={1000} unmountOnExit>
              { state => 
              <div
              className="center-div"
              style={{
                width: '100vw',
                backgroundColor: "#F7e700",
                 transition: 'all 1s linear',
                 zIndex: '1000',
                  height: '100vh',
                 position: 'fixed',
                 top: '0',
                 left: state=='exiting' ? '-100vw' : 0,
                 }}>
                 <Loading/>
                 </div>


              }
               </Transition> */}
        </div>
      );
  }
};

export default Experience;
