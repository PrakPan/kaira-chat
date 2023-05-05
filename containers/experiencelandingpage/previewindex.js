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
import axiosexperienceinstance from '../../services/experiences/getexperience';
const Experience = (props) => {
  let isPageWide = media('(min-width: 768px)');

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryimages, setGalleryImages] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [brief, setBreif] = useState(null);
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);

  const router = useRouter();
  const _handlePersonaliseRedirect = () => {
    router.push('/tailored-travel');
  };
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

  // Fetch experience on page load
  const [experienceData, setExperienceData] = useState();
  const [experienceLoaded, setExperienceLoaded] = useState();

  useEffect(() => {
    axiosexperienceinstance
      .get(`/?slug=` + props.id)
      .then((res) => {
        setExperienceData(res.data);
        _setItineraryHandler(res.data.itinerary_id);
        const images = [
          res.data.images.main_image,
          res.data.images.image_1,
          res.data.images.image_2,
          res.data.images.image_3,
          res.data.images.image_4,
        ];
        setGalleryImages(images);
        setExperienceLoaded(true);

        fetch(
          'https://suppliers.tarzanway.com/sales/bookings/?itinerary_id=' +
            res.data.itinerary_id,
          {}
        ).then((response) => {
          if (response.status === 200) {
            response.json().then((json) => {
              setBooking(json.bookings);
              window.scrollTo(0, 0);
            });
          }
        });
      })
      .catch((error) => {
        // props.history.push('/404')
      });

    window.scrollTo(0, 0);
  }, []);

  const closeGalleryHandler = () => {
    const images = [
      experienceData.images.main_image,
      experienceData.images.image_1,
      experienceData.images.image_2,
      experienceData.images.image_3,
      experienceData.images.image_4,
    ];
    setGalleryImages(images);
    setGalleryOpen(false);
  };

  //If experience data fetched
  if (isPageWide) {
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
          {/* <DesktopPersonaliseBanner onclick={_handlePersonaliseRedirect} text="Want to personalize your own experience?"></DesktopPersonaliseBanner> */}
          <div>
            {experienceLoaded ? (
              <ExperienceGallery
                filter={
                  experienceLoaded ? experienceData.experience_filters[0] : null
                }
                rating={experienceLoaded ? experienceData.rating : null}
                title={experienceLoaded ? experienceData.name : null}
                filters={
                  experienceLoaded ? experienceData.experience_filters : []
                }
                region={experienceData.experience_region}
                duration={experienceData.duration}
                setGalleryOpen={setGalleryOpen}
                images={experienceData.images}
              />
            ) : null}
            {experienceLoaded ? (
              <Menu
                setGalleryOpen={() => setGalleryOpen(true)}
                title={experienceData.name}
                data={experienceData}
                itinerary={itinerary}
                brief={brief}
                bookings={booking}
                payment={payment}
                images={experienceData.images}
                setGalleryImages={(imagesArr) => setGalleryImages(imagesArr)}
              ></Menu>
            ) : null}
          </div>
          <Transition in={!experienceLoaded} timeout={1000} unmountOnExit>
            {(state) => (
              <div
                className="center-div"
                style={{
                  backgroundColor: '#F7e700',
                  width: '100vw',
                  transition: 'all 1s ease-out',
                  zIndex: '1000',
                  height: '100vh',
                  position: 'fixed',
                  left: state == 'exiting' ? '-100vw' : 0,

                  top: '0',
                }}
              >
                <Loading />
              </div>
            )}
          </Transition>
        </div>
      );
    //   else return null;
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
          {/* <MobilePersonaliseBanner text="Want to personalize your own experience?"></MobilePersonaliseBanner> */}
          {experienceLoaded ? (
            <ExperienceGallery
              filter={
                experienceData ? experienceData.experience_filters[0] : null
              }
              rating={experienceData.rating}
              title={experienceData.name}
              region={experienceData.experience_region}
              duration={experienceData.duration}
              filters={experienceData.experience_filters}
              setGalleryOpen={setGalleryOpen}
              images={props.experienceData.images}
            />
          ) : null}
          {experienceLoaded ? (
            <Menu
              setGalleryOpen={() => setGalleryOpen(true)}
              setGalleryImages={(imagesArr) => setGalleryImages(imagesArr)}
              title={experienceData.name}
              data={experienceData}
              itinerary={itinerary}
              brief={brief}
              bookings={booking}
              payment={payment}
            ></Menu>
          ) : null}
          <Transition in={!experienceLoaded} timeout={1000} unmountOnExit>
            {(state) => (
              <div
                className="center-div"
                style={{
                  width: '100vw',
                  backgroundColor: '#F7e700',
                  transition: 'all 1s linear',
                  zIndex: '1000',
                  height: '100vh',
                  position: 'fixed',
                  top: '0',
                  left: state == 'exiting' ? '-100vw' : 0,
                }}
              >
                <Loading />
              </div>
            )}
          </Transition>
        </div>
      );
  }
};

export default Experience;
