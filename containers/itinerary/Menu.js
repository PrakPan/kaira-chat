import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { makeStyles, Theme } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Booking from './booking1/CheckLoginWrapper';
import Register from './register/Index';
import Breif from './breif/OldIndex';
import ItineraryContainer from '../../components/itinerary/Index/IndexDesktop';
import ItineraryContainerMobile from '../../components/itinerary/newmobile/Index';
import media from '../../components/media';
import PoiEditModal from '../../components/modals/editpoi/Index';
import { getIndianPrice } from '../../services/getIndianPrice';
import Button from '../../components/ui/button/Index';
import PriceBannerMobile from './PriceBannerMobile';
// import Accommodation from '../../components/modals/accommodation/Index';
import axiosbookingupdateinstance from '../../services/bookings/UpdateBookings';
import * as ga from '../../services/ga/Index';
import { useRouter } from 'next/router';
import { CONTENT_SERVER_HOST } from '../../services/constants';

const Location = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
const LocationsContainer = styled.div`
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100vw;
  overflow-x: scroll;
`;

const CostContainer = styled.div`
  display: none;
  @media screen and (min-width: 768px) {
    position: absolute;
    right: 0;

    display: flex;
    flex-direction: row;
    z-index: 1000;
    align-items: center;
  }
`;
const StrikedCost = styled.p`
  position: relative;
  width: max-content;
  flex-grow: 1;
  margin-bottom: 0;
  margin-right: 6px;
  font-weight: 400;
  font-size: 1.25rem;
  line-height: 1.5;
  text-align: center;
  &:before {
    position: absolute;
    content: '';
    left: 0;
    top: 23%;
    right: 0;
    border-top: 2px solid;
    border-color: inherit;
    -webkit-transform: skewY(-12deg);
    -moz-transform: skewY(-12deg);
    transform: skewY(-12deg);
  }

  @media screen and (min-width: 768px) {
    font-size: 1rem;
    &:before {
      position: absolute;
      content: '';
      left: 0;
      top: 20%;
      right: 0;
      border-top: 2px solid;
      border-color: inherit;
      -webkit-transform: skewY(-10deg);
      -moz-transform: skewY(-10deg);
      transform: skewY(-10deg);
    }
  }
`;

const Cost = styled.div`
  text-align: right;
  line-height: 1.5;
  font-weight: 800;
  font-size: 1.25rem;
  &:after {
    content: 'per person';
    display: block;
    font-size: 0.9rem;
    font-weight: 300;
  }
`;
const GITCost = styled.div`
  text-align: right;
  line-height: 1.5;
  font-weight: 800;
  font-size: 1.25rem;
  &:after {
    content: 'per member';
    display: block;
    font-size: 0.9rem;
    font-weight: 300;
  }
`;
const DiscountContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 0.5rem;
`;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: 'black !important',
    color: 'white !important',
    height: '66px !important',
    justifyContent: 'center',
    top: '0 !important',
  },
}));

const SimpleTabs = (props) => {
  let isPageWide = media('(min-width: 768px)');

  const [isGroup, setIsGroup] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (router.query.payment_status) {
      if (isPageWide) window.scrollTo(0, window.innerHeight);
      else window.scrollTo(0, window.innerHeight / 2);
      setValue(2);
    }
    // change after is_group field activated in itinerary APIs
    // if(props.match.params.id === "LX1513cBeVVjRPY09EhI" || props.match.params.id === "AY2n7HcBeVVjRPY0MgwO"  || props.match.params.id==="9OjdZ3gBeVVjRPY01cew") setIsGroup(true);
    if (props.showbooking) {
      setValue(2);
      window.scrollTo(0, window.innerHeight);
    }
  }, []);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [show, setShow] = useState(true);
  const [location, setLocation] = useState(0);
  const [hours, setHours] = useState('-');
  const [minutes, setMinutes] = useState('-');
  const [seconds, setSeconds] = useState('-');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [blurItinerary, setBlurItinerary] = useState(true);
  const [showItineraryTimer, setShowItineraryTimer] = useState(true);
  const [minimiseTimer, setMinimiseTimer] = useState(false);
  const [minimseBookingTimer, setMinimiseBookingTimer] = useState(false);
  const [blurBooking, setBlurBooking] = useState(false);
  const [showBookingTimer, setShowBookingTimer] = useState(true);

  const [timerValid, setTimerValid] = useState(false);

  const [selectedPoi, setSelectedPoi] = useState({ name: 'Kasol' });

  const _setLocationHandler = (event) => {
    window.scrollTo(0, window.innerHeight / 2);
    setLocation(event.target.id);
  };

  const handleChange = (event, newValue) => {
    const tabs = ['brief', 'itinerary', 'booking'];
    {
      process.env.NODE_ENV === "production" &&
        !CONTENT_SERVER_HOST.includes("dev") &&
        ga.event({
          action: "Itinerary-tabs-" + tabs[newValue],
          params: {},
        });
    }
    if (isPageWide) window.scrollTo(0, window.innerHeight);
    else window.scrollTo(0, window.innerHeight / 2);

    if (newValue === 1) {
    }
    if (newValue === 2) {
      props.getPaymentHandler();
      if (timerValid) {
        setShowBookingTimer(true);
        setBlurBooking(true);
      }
      if (isPageWide) window.scrollTo(0, window.innerHeight);
      else window.scrollTo(0, window.innerHeight / 2);
    }
    setValue(newValue);
  };
  const openBookingDesktop = () => {
    {process.env.NODE_ENV === "production" &&
      !CONTENT_SERVER_HOST.includes('dev') &&
    ga.event({
      action: 'Itinerary-tabs-Book_Now',
      params: {
        Key: '',
      },
    });}
    window.scrollTo(0, window.innerHeight);
    props.getPaymentHandler();
    setValue(2);
  };
  const openBookingMobile = () => {
    {process.env.NODE_ENV === "production" &&
      !CONTENT_SERVER_HOST.includes('dev') &&
    ga.event({
      action: 'Itinerary-tabs-Book_Now',
      params: {
        key: '',
      },
    });}
    window.scrollTo(0, window.innerHeight / 2);

    setValue(2);
  };

  //Location tabs for mobile
  let locationsArr = [];
  let totalcityslabs = 0;
  if (props.breif)
    if (props.breif.city_slabs)
      for (var j = 0; j < props.breif.city_slabs.length; j++) {
        if (!props.breif.city_slabs[j].is_trip_terminated) {
          totalcityslabs += 1;
        }
      }
  const locationtabwidth = 100 / totalcityslabs + 'vw';
  if (props.breif)
    if (props.breif.city_slabs)
      for (var i = 0; i < props.breif.city_slabs.length; i++) {
        if (!props.breif.city_slabs[i].is_trip_terminated) {
          locationsArr.push(
            <Location
              id={i}
              style={{ minWidth: locationtabwidth }}
              className={
                'font-lexend center-div border-top ' +
                (location == i ? 'bg-yellow font-bold' : 'bg-white')
              }
              onClick={(event) => _setLocationHandler(event)}
            >
              {props.breif.city_slabs[i].city_name}
            </Location>
          );
        }
      }

  useEffect(() => {
    if (props.itineraryReleased) {
      setShowItineraryTimer(false);
      setShowBookingTimer(false);
      setBlurBooking(false);
      setBlurItinerary(false);
      setTimerValid(false);
    } else {
    }
    return () => {};
  }, [props.itineraryDate, props.itineraryReleased, props.timeRequired]);

  const _previewItineraryHandler = () => {
    setBlurItinerary(false);
    setValue(1);
  };
  const _minimiseTimerHandler = () => {
    setBlurItinerary(false);
    setMinimiseTimer(true);
  };
  const _minimiseBookingTimerHandler = () => {
    setMinimiseBookingTimer(true);
  };

  const _handlePoiEditModalOpen = (poi) => {
    {process.env.NODE_ENV === "production" &&
      !CONTENT_SERVER_HOST.includes('dev') &&
    ga.event({
      action: 'Itinerary-poiedit-open',
      params: {
        poi: poi.name,
        city: poi.city_id,
      },
    });}
    setSelectedPoi({
      name: poi.name,
      city_id: poi.city_id,
      day_slab_index: poi.day_slab_index,
      slab_element_index: poi.slab_element_index,
      element_index: poi.element_index,
    });
    props.setShowPoiModal(true);
  };
  const _handleFlighModalShow = () => {
    props.setShowFlightModal(true);
  };
  const _handleFlightModalClose = () => {
    props.setShowFlightModal(false);
  };
  return (
    <div className={classes.root}>
      <AppBar position="sticky" className={classes.appbar}>
        <Tabs
          id="itinerary-tabs"
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          centered
          style={{ zIndex: '2' }}
          indicatorColor=""
        >
          <Tab label="Brief" className="font-lexend experience-tab" />
          <Tab label="Itinerary" className="font-lexend experience-tab" />
          {!isGroup ? (
            <Tab label="Booking" className="font-lexend experience-tab" />
          ) : (
            <Tab label="Register" className="font-lexend experience-tab" />
          )}
        </Tabs>
        {value !== 2 && props.payment ? (
          <CostContainer>
            {true ? (
              <DiscountContainer>
                <div style={{ display: 'flex' }}>
                  {props.payment ? (
                    props.payment.is_registration_needed ? (
                      <StrikedCost>
                        {'₹ ' +
                          getIndianPrice(
                            Math.round(
                              Math.round(
                                props.payment.per_person_total_cost / 100
                              ) * 2
                            )
                          )}
                      </StrikedCost>
                    ) : null
                  ) : null}

                  {props.payment ? (
                    !props.payment.is_registration_needed ? (
                      <Cost className="font-lexend">
                        {'₹ ' +
                          getIndianPrice(
                            Math.round(
                              props.payment.per_person_total_cost / 100
                            )
                          ) +
                          ' /-'}
                      </Cost>
                    ) : (
                      <GITCost className="font-lexend">
                        {'₹ ' +
                          getIndianPrice(
                            Math.round(
                              props.payment.per_person_total_cost / 100
                            )
                          ) +
                          ' /-'}
                      </GITCost>
                    )
                  ) : null}
                </div>
              </DiscountContainer>
            ) : null}
            <Button
              onclick={openBookingDesktop}
              hoverBgColor="white"
              hoverColor="black"
              bgColor="#F7e700"
              borderStyle="none"
              borderRadius="5px"
              margin="0 2rem 0 0"
              padding="0.25rem 1rem"
            >
              {props.payment
                ? props.payment.paid_user
                  ? 'Details'
                  : props.payment.bookings_count
                  ? 'View ' + props.payment.bookings_count + ' bookings'
                  : 'Book Now'
                : 'Book Now'}
            </Button>
          </CostContainer>
        ) : null}
      </AppBar>
      {!isPageWide && value !== 2 ? (
        <PriceBannerMobile
          hasUserPaid={props.payment ? props.payment.paid_user : false}
          is_registration_needed={
            props.payment ? props.payment.is_registration_needed : false
          }
          openBooking={openBookingMobile}
          payment={props.payment}
        ></PriceBannerMobile>
      ) : null}
      <TabPanel value={value} index={0}>
        <Breif
          traveleritinerary={props.traveleritinerary}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          breif={props.breif}
          hideTimer={minimiseTimer}
          timeRequired={props.timeRequired}
          itineraryReleased={props.itineraryReleased}
          itineraryDate={props.itineraryDate}
          showTimer={showItineraryTimer}
          _hideTimerHandler={_minimiseTimerHandler}
          blur={blurItinerary}
        ></Breif>
      </TabPanel>
      <TabPanel value={value} index={1} style={{ padding: '0' }}>
        {
          isPageWide ? (
            <ItineraryContainer
              is_registration_needed={
                props.payment ? props.payment.is_registration_needed : false
              }
              selectedPoi={selectedPoi}
              user_email={props.user_email}
              is_preview={props.preview}
              is_stock={props.is_stock}
              setShowPoiModal={_handlePoiEditModalOpen}
              traveleritinerary={props.traveleritinerary}
              hideTimer={minimiseTimer}
              timeRequired={props.timeRequired}
              itineraryReleased={props.itineraryReleased}
              itineraryDate={props.itineraryDate}
              showTimer={false}
              _hideTimerHandler={_minimiseTimerHandler}
              blur={false}
              city_slabs={props.breif.city_slabs}
              itinerary={props.itinerary}
              newData={props.newData}
              demoitinerary={props.demoitinerary}
            ></ItineraryContainer>
          ) : (
            <div>
              <ItineraryContainerMobile
                is_registration_needed={
                  props.payment ? props.payment.is_registration_needed : false
                }
                selectedPoi={selectedPoi}
                user_email={props.user_email}
                is_preview={props.preview}
                is_stock={props.is_stock}
                setShowPoiModal={_handlePoiEditModalOpen}
                traveleritinerary={props.traveleritinerary}
                day_slabs={props.itinerary.day_slabs}
                hours={hours}
                minutes={minutes}
                seconds={seconds}
                timeRequired={props.timeRequired}
                hideTimer={minimiseTimer}
                itineraryDate={props.itineraryDate}
                showTimer={false}
                _hideTimerHandler={_minimiseTimerHandler}
                blur={false}
                location_selected={location}
                city_slabs={props.breif.city_slabs}
                itinerary={props.itinerary}
                newData={props.newData}
                demoitinerary={props.demoitinerary}
              ></ItineraryContainerMobile>
              {/* <LocationsContainer >
                {locationsArr}
              </LocationsContainer> */}
            </div>
          )
          // <NewMobileItinerary city_slabs={props.breif.city_slabs} day_slabs={props.itinerary.day_slabs} hours={hours} minutes={minutes} seconds={seconds}  timeRequired={props.timeRequired}  hideTimer={minimiseTimer} itineraryDate={props.itineraryDate}  showTimer={showItineraryTimer}   _hideTimerHandler={_minimiseTimerHandler} blur={blurItinerary} location_selected={location} city_slabs={props.breif.city_slabs}  itinerary={props.itinerary} newData={props.newData} demoitinerary={props.demoitinerary}/>
        }
      </TabPanel>
      <TabPanel value={value} index={2}>
        {isGroup ? (
          <Register></Register>
        ) : (
          <Booking
            itinerary={props.itinerary}
            _updateStayBookingHandler={props._updateStayBookingHandler}
            _updateFlightBookingHandler={props._updateFlightBookingHandler}
            hasUserPaid={props.payment ? props.payment.paid_user : false}
            payment_status={router.query.payment_status}
            plan={props.plan}
            isDatePresent={props.isDatePresent}
            _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
            showTaxiModal={props.showTaxiModal}
            setShowTaxiModal={props.setShowTaxiModal}
            paymentLoading={props.paymentLoading}
            budget={props.budget}
            _deselectActivityBookingHandler={
              props._deselectActivityBookingHandler
            }
            activityFlickityIndex={props.activityFlickityIndex}
            _deselectFlightBookingHandler={props._deselectFlightBookingHandler}
            flightFlickityIndex={props.flightFlickityIndex}
            _deselectTransferBookingHandler={
              props._deselectTransferBookingHandler
            }
            transferFlickityIndex={props.transferFlickityIndex}
            stayFlickityIndex={props.stayFlickityIndex}
            setStayFlickityIndex={props.setStayFlickityIndex}
            selectingBooking={props.selectingBooking}
            _deselectStayBookingHandler={props._deselectStayBookingHandler}
            getPaymentHandler={props.getPaymentHandler}
            flightLoading={props.flightLoading}
            transferLoading={props.transferLoading}
            cardUpdateLoading={props.cardUpdateLoading}
            activityBookings={props.activityBookings}
            flightBookings={props.flightBookings}
            transferBookings={props.transferBookings}
            stayBookings={props.stayBookings}
            _selectTaxiHandler={props._selectTaxiHandler}
            showFlightModal={props.showFlightModal}
            setShowFlightModal={_handleFlighModalShow}
            setHideFlightModal={_handleFlightModalClose}
            user_email={props.user_email}
            no_bookings={props.no_bookings}
            traveleritinerary={props.traveleritinerary}
            preview={props.preview}
            id={props.id}
            is_stock={props.is_stock}
            _updatePaymentHandler={props._updatePaymentHandler}
            _updateBookingHandler={props._updateBookingHandler}
            setShowBookingModal={() => props.setShowBookingModal(true)}
            showBookingModal={props.showBookingModal}
            setHideBookingModal={props.setHideBookingModal}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            timeRequired={props.timeRequired}
            hideTimer={minimseBookingTimer}
            showTimer={false}
            itineraryDate={props.itineraryDate}
            blur={false}
            openItinerary={_previewItineraryHandler}
            _handleTimerClose={_minimiseBookingTimerHandler}
            setImagesHandler={props.setImagesHandler}
            payment={props.payment}
            booking={props.booking}
          ></Booking>
        )}
      </TabPanel>
      {!props.preview ? (
        <PoiEditModal
          setItinerary={props.setItinerary}
          itinerary_id={props.id}
          selectedPoi={selectedPoi}
          tailored_id={
            props.booking ? props.booking[0]['tailored_itinerary'] : ''
          }
          _updatePaymentHandler={props._updatePaymentHandler}
          setShowPoiModal={() => _handlePoiEditModalOpen({ name: 'kasol' })}
          showPoiModal={props.showPoiModal}
          setHidePoiModal={props.setHidePoiModal}
        ></PoiEditModal>
      ) : null}
      {/* <Accommodation show={true} ></Accommodation> */}
    </div>
  );
};

export default SimpleTabs;
