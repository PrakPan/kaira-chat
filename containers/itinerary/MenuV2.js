import React, { useState, useEffect, useLayoutEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link as ScrollLink, scroller } from 'react-scroll';

import { AppBar } from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import GITSummaryContainer from './booking1/gittailored/Index';
import SummaryContainer from './booking1/TailoredDetails';
import axiosPoiCityInstance from '../../services/poi/city';
import Booking from './booking1/CheckLoginWrapper';
import Register from './register/Index';
import Breif from './breif/NewIndex';
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
import Spinner from '../../components/Spinner';
import { useRouter } from 'next/router';
import CustomMenu from './CustomMenu';
import { useSticky } from '../../hooks/useSticky';
import StackedComponents from './StackedComponents';
import NewItenary from './New_Itenary_DBD/NewItenaryDBDMob';
import NewItenaryDBD from './New_Itenary_DBD/NewItenaryDBDMob';
import useMediaQuery from '../../hooks/useMedia';
import NewItenaryDBDMob from './New_Itenary_DBD/NewItenaryDBDMob';
import NewItenaryMain from './New_Itenary_DBD/NewItenaryMain';
import ScrollableMenuTabs from '../../components/ScrollableMenuTabs';
import NewBooking from './HotelsBooking/HotelsBooking';
import ActivityBookings from './ActivityBookings/ActivitiesBookings';

import HotelsBooking from './HotelsBooking/HotelsBooking';
import { SplitScreen } from '../../components/SplitScreen';
import BookingContainer from '../../components/BookingContainer/BookingContainer';
import ButtonYellow from '../../components/ButtonYellow';
import { Navigation } from '../../components/NewNavigation';
import TransfersContainer from './TransfersContainer/TransfersContainer';
import LogInModal from '../../components/modals/Login';
import Modal from '../../components/ui/Modal';
import { ClaimItinary } from '../../store/actions/auth';
import { ITINERARY_STATUSES } from '../../services/constants';
import MakeYourPersonalised from '../../components/MakeYourPersonalised';
import useFieldOfView from '../../hooks/useFieldOfView';
import useInView from '../../hooks/useInView';
import { getCityDetails } from './getCityDetails';
const Container = styled.div`
  margin-top: 1rem;
  display: grid;
  position: sticky;
  top: 0;
  padding-top: 0.5rem;
  background-color: white;
  z-index: 10 !important;
  height: max-content;
  max-width: 100vw;
  overflow-x: hidden;
  grid-template-columns: max-content max-content max-content max-content max-content max-content;
  @media screen and (min-width: 768px) {
    top: 10vh;
  }
`;
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
const SelectedMenu = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #f7e700;
  background-color: #262626;
  padding: 0.75rem 1.5rem;
  border-style: none none solid none;
  border-width: 4px;
  border-color: #f7e700;
  border-radius: 10px 10px 0 0;
`;
const NotSelectedMenu = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: rgb(122, 122, 122);

  background-color: transparent;
  padding: 0.75rem 1.5rem;
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

const useStyles = {
  root: `
  flex-grow-1
  `,
};

const SimpleTabsV2 = (props) => {
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

  const classes = useStyles;
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
  const [Newitinerary, setNewitinerary] = useState(false);
  const [blurBooking, setBlurBooking] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBookingTimer, setShowBookingTimer] = useState(true);
  const [showFooterBannerMobile, setShowFooterBannerMobile] = useState(false);

  const [timerValid, setTimerValid] = useState(false);
  const [mapArray, setmapArray] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState({ name: 'Kasol' });

  const scrollToElement = (elementId) => {
    scroller.scrollTo(elementId, {
      duration: 500,
      smooth: false,
      spy: true,
      offset: -50,
    });
  };

  useLayoutEffect(() => {
    const { t, booking, scroll } = router.query;

    if (booking) {
      setShowFooterBannerMobile(true);
    } else if (scroll) {
      scrollToElement(scroll);
    }
  }, [router.query]);

  const _hidePaymentHandler = () => {
    setShowFooterBannerMobile(true);
    setShowpayment(false);
  };

  const _setLocationHandler = (event) => {
    window.scrollTo(0, window.innerHeight / 2);
    setLocation(event.target.id);
  };

  const handleChange = (event, newValue) => {
    // console.log('nw', event, newValue)
    const tabs = ['brief', 'itinerary', 'booking'];
    ga.event({
      action: 'Itinerary-tabs-' + tabs[newValue],
      params: {},
    });
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
    ga.event({
      action: 'Itinerary-tabs-Book_Now',
      params: {
        Key: '',
      },
    });
    window.scrollTo(0, window.innerHeight);
    props.getPaymentHandler();
    setValue(2);
  };
  const openBookingMobile = () => {
    ga.event({
      action: 'Itinerary-tabs-Book_Now',
      params: {
        key: '',
      },
    });
    window.scrollTo(0, window.innerHeight / 2);

    setValue(2);
  };
  const replaceLatLong = (source, destination) => ({
    ...source,
    lat: destination.lat,
    long: destination.long,
  });
  //Location tabs for mobile
  let locationsArr = [];
  let RoutesData = [];
  let TransfersData = [];
  let totalcityslabs = 0;
  console.log('brief idssss', props.breif);
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
      if (props.routes) {
        // console.log('inside routes');
        // console.log(props.routes);

        async function processRoutes(props) {
          for (var i = 0; i < props.routes.length; i++) {
            // console.log('routes one', props.routes[i]);
            if (props.routes[i].element_type !== 'transfer') {
              if (props.routes[i].long) {
                // console.log(props.routes[i].long);
                RoutesData.push(props.routes[i]);
              } else {
                if (props.routes[i].city_id) {
                  try {
                    const data = await getCityDetails(props.routes[i].city_id);
                    // console.log('fetchdata data');
                    // console.log(props.routes[i], data);
                    const updatedRoutes = replaceLatLong(props.routes[i], data);
                    RoutesData.push(updatedRoutes);
                    // console.log('fetchdata data in', updatedRoutes);
                  } catch (error) {
                    console.error(error);
                  }
                }
              }
            } else {
              TransfersData.push(props.routes[i]);
            }
          }
          console.log('routes finished');
          console.log(RoutesData);
          console.log(TransfersData);
        }

        processRoutes(props);
      }
  for (var i = 0; i < props?.breif?.city_slabs?.length; i++) {
    if (!props.breif.city_slabs[i].is_trip_terminated) {
      locationsArr.push(
        <Location
          id={i}
          style={{ minWidth: locationtabwidth }}
          className={
            'font-opensans center-div border-top ' +
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
  useLayoutEffect(() => {
    const handleScroll = () => {
      const currentPos = window.scrollY;
      items.forEach((item) => {
        const element = document.getElementById(item.link);
        if (
          element.offsetTop - 100 <= currentPos &&
          element.offsetTop + element.offsetHeight > currentPos
        ) {
          setActiveItem(item.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [items]);
  // if (
  //   props.token &&
  //   !props.payment.user_allowed_to_pay &&
  //   props.payment.itinerary_status == ITINERARY_STATUSES.itinerary_unclaimed
  // ) {
  //   ClaimItinary(props.id, props.token);
  // }
  const _handleLoginClose = () => {
    // props.getPaymentHandler();
    setShowLoginModal(false);
  };
  const isInView = useInView('Booking_container');
  const [activeItem, setActiveItem] = useState(1);
  const items = props?.activityBookings
    ? [
        { id: 1, label: 'Brief', link: 'Brief' },
        { id: 2, label: 'Itinerary', link: 'Itenary' },
        // { id: 3, label: 'Flights',link: 'Flights' },
        { id: 3, label: 'Stays', link: 'Stays' },
        { id: 4, label: 'Transfers', link: 'Transfers' },
        {
          id: 5,
          label: 'Activities',
          link: 'Activities',
        },
      ]
    : [
        { id: 1, label: 'Brief', link: 'Brief' },
        { id: 2, label: 'Itinerary', link: 'Itenary' },
        // { id: 3, label: 'Flights',link: 'Flights' },
        { id: 3, label: 'Stays', link: 'Stays' },
        { id: 4, label: 'Transfers', link: 'Transfers' },
        // {
        //   id: 6,
        //   label: 'Book Now',
        //   link: 'staysBooking',
        // },
      ];

  const { ref, isSticky } = useSticky(90);
  const isDesktop = useMediaQuery('(min-width:1148px)');
  const handleSelect = (itemId) => {
    setActiveItem(itemId);
  };
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
    ga.event({
      action: 'Itinerary-poiedit-open',
      params: {
        poi: poi.name,
        city: poi.city_id,
      },
    });
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
  const Navbar = styled.div`
    position: ${({ sticky }) => (sticky ? 'sticky' : 'inherit')};
    z-index: ${({ sticky }) => (sticky ? '1000' : '997')};
    top: 15px;
    display: flex;
    ::-webkit-scrollbar {
      display: none;
    }
    background-color: white;
    height: 50px;
    margin: 0px -20px 0px -20px;
    overflow-x: scroll;
    align-items: center;

    background-color: white;
  `;
  const MenuContainer = styled.div`
    border-bottom: 1px solid #f0f0f0;
    width: 100vw;
    margin-left: -1rem;
    margin-bottom: 1rem;
    > div {
      margin: 0px 0px 0px -50px;
    }
  `;
  const AppContainer = styled.div`
    width: 100vw;
    height: 100vh;
    overflow: scroll;
    font-family: sans-serif;
  `;

  // const getdayId = (id) => {
  //   return props.itinerary?.day_slabs[id]?.slab_id;
  // };
  // const getdateId = (id) => {
  //   return props.itinerary?.day_slabs[id]?.slab;
  // };
  // const Locationlatlong = [];
  // useEffect(() => {
  //   if (RoutesData.length >= 1) {
  //     console.log('itsrendering');
  //     for (var i = 0; i < RoutesData.length; i++) {
  //       var postion = props.breif.city_slabs[i + 1];

  //       // console.log(`response city data${JSON.stringify(citydetails)}`);
  //       // console.log(`lat,long${citydetails.lat}`);
  //       if (RoutesData[i].duration && RoutesData[i].duration !== '0') {
  //         Locationlatlong.push({
  //           dayId: getdayId(
  //             RoutesData[i].day_slab_location.start_day_slab_index
  //           ),
  //           cityData: postion,
  //           id: RoutesData[i].gmaps_place_id,
  //           city_id: RoutesData[i].city_id,
  //           lat: RoutesData[i].lat,
  //           long: RoutesData[i].long,
  //           name: RoutesData[i].city_name,
  //           duration: RoutesData[i].duration,
  //           color: RoutesData[i].color,
  //           date: getdateId(
  //             RoutesData[i].day_slab_location.start_day_slab_index
  //           ),
  //         });
  //       }
  //     }
  //   } else {
  //     for (var i = 0; i < props.breif.city_slabs.length; i++) {
  //       var postion = props.breif.city_slabs[i];

  //       // console.log(`response city data${JSON.stringify(citydetails)}`);
  //       // console.log(`lat,long${citydetails.lat}`);
  //       if (
  //         !postion.is_departure_only &&
  //         !postion.is_trip_terminated &&
  //         postion.duration &&
  //         postion.duration !== '0'
  //       ) {
  //         Locationlatlong.push({
  //           dayId: getdayId(postion.day_slab_location.start_day_slab_index),
  //           cityData: postion,
  //           id: postion.gmaps_place_id,
  //           city_id: postion.city_id,
  //           lat: postion.lat ?? '18.5204',
  //           long: postion.long ?? '73.8567',
  //           name: postion.city_name,
  //           duration: postion.duration,
  //           color: postion.color,
  //           date: getdateId(postion.day_slab_location.start_day_slab_index),
  //         });
  //       }
  //     }
  //   }
  //   setmapArray(true);
  // }, []);

  // console.log(Locationlatlong);
  console.log('payment', props.payment);
  console.log('isInView', isInView);
  return (
    <div className={classes.root} style={{ paddingTop: '20px' }}>
      <div className="  z-10 sticky z-2 md:top-[0px] top-[1px]">
        {isPageWide ? (
          <Navigation items={items} BarName="TabsName" />
        ) : (
          <ScrollableMenuTabs
            icons={false}
            offset={isDesktop ? '0px' : '0px'}
            items={items}
            BarName="TabsName"
          />
        )}
      </div>
      {isPageWide && !isInView && (
        <div className="w-full z-[20] sticky flex flex-row top-[2px] justify-end -mt-[55px] ">
          <div className="z-[99] absolute  md:top-[0px] top-[0px] w-[20rem]">
            <div className="flex flex-row justify-between ">
              <div className="flex flex-col">
                <div className="text-[0.725rem]">
                  {props?.payment?.pay_only_for_one ||
                  props?.payment?.show_per_person_cost
                    ? 'Per Person'
                    : props.payment?.is_estimated_price
                    ? `${
                        props.payment.total_cost == 0 ? '' : 'Estimated Price'
                      }`
                    : 'Total Cost'}
                </div>
                {props.payment ? (
                  <div>
                    <span className="font-bold">
                      ₹{' '}
                      {props?.payment?.pay_only_for_one ||
                      props?.payment?.show_per_person_cost
                        ? getIndianPrice(
                            Math.round(
                              Math.round(
                                props.payment.per_person_discounted_cost
                              ) / 100
                            )
                          )
                        : getIndianPrice(
                            Math.round(
                              Math.round(props.payment.discounted_cost) / 100
                            )
                          )}
                      {'/-'}
                    </span>
                  </div>
                ) : null}
              </div>
              {props?.token && props?.payment?.paid_user && (
                <div className="border-[1px] flex my-2 justify-center items-center text-[#04AA32] text-center  text-medium border-[#04AA32] px-[2px] py-[1px]">
                  PAID
                </div>
              )}
              {!props.token ? (
                <div>
                  <Button
                    color="#111"
                    fontWeight="400"
                    fontSize="0.45rem"
                    borderWidth="2px"
                    width="12rem"
                    borderRadius="10px"
                    bgColor="#F7E700"
                    onclick={() => setShowLoginModal(true)}
                  >
                    Log in to proceed
                  </Button>
                </div>
              ) : null}

              {props.payment && props.token ? (
                props.payment.itinerary_status ===
                  ITINERARY_STATUSES.itinerary_finalized &&
                !props.payment.paid_user &&
                props.payment.user_allowed_to_pay ? (
                  props.payment.total_cost > 0 ? (
                    <div>
                      <Button
                        color="#111"
                        fontWeight="400"
                        fontSize="0.45rem"
                        borderWidth="2px"
                        width="13rem"
                        borderRadius="10px"
                        bgColor="#F7E700"
                        onclick={() => scrollToElement('Stays-Head')}
                        onclickparams={null}
                      >
                        Proceed to Book
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        color="#111"
                        fontWeight="400"
                        fontSize="0.45rem"
                        borderWidth="2px"
                        width="9rem"
                        borderRadius="10px"
                        bgColor="#F7E700"
                        onclick={() => scrollToElement('Stays-Head')}
                      >
                        Add Hotels
                      </Button>
                    </div>
                  )
                ) : !props.payment.paid_user ? (
                  props.payment.is_registration_needed ? (
                    <div className="">
                      <Button
                        color="#111"
                        fontWeight="600"
                        fontSize="0.85rem"
                        borderWidth="2px"
                        width="11rem"
                        borderRadius="8px"
                        bgColor="#f8e000"
                        onclick={() => scrollToElement('Stays-Head')}
                      >
                        Proceed to Book
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        color="#111"
                        fontWeight="400"
                        fontSize="0.45rem"
                        borderWidth="2px"
                        width="12rem"
                        borderRadius="10px"
                        bgColor="#F7E700"
                        onclick={() => setNewitinerary(!Newitinerary)}
                      >
                        Craft a new trip!
                      </Button>
                    </div>
                  )
                ) : (
                  <Button
                    color="#111"
                    fontWeight="400"
                    fontSize="0.45rem"
                    borderWidth="2px"
                    width="9rem"
                    borderRadius="10px"
                    bgColor="#F7E700"
                    onclick={() => scrollToElement('Stays-Head')}
                  >
                    View Bookings
                  </Button>
                )
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* {!isPageWide && value !== 2 ? (
          <PriceBannerMobile
            hasUserPaid={props.payment ? props.payment.paid_user : false}
            is_registration_needed={
              props.payment ? props.payment.is_registration_needed : false
            }
            openBooking={openBookingMobile}
            payment={props.payment}
          ></PriceBannerMobile>
        ) : null} */}
      <div id={items[0].link}>
        {/* {mapArray ? ( */}
        {
          <Breif
            plan={props.plan}
            routesData={RoutesData}
            transfersData={TransfersData}
            routes={props.routes}
            payment={props.payment}
            traveleritinerary={props.traveleritinerary}
            // Locationlatlong={Locationlatlong}
            // hours={hours}
            // minutes={minutes}
            // seconds={seconds}
            itinerary={props.itinerary}
            breif={props.breif}
            // hideTimer={minimiseTimer}
            // timeRequired={props.timeRequired}
            // itineraryReleased={props.itineraryReleased}
            // itineraryDate={props.itineraryDate}
            // showTimer={showItineraryTimer}
            // _hideTimerHandler={_minimiseTimerHandler}
            // blur={blurItinerary}
          ></Breif>
        }

        {/* ) : null} */}
      </div>
      {/* // for 0000000000000000000000  mobile */}
      {isPageWide ? null : (
        <>
          <div id={items[1].link}>
            <NewItenaryDBDMob
              plan={props.plan}
              payment={props.payment}
              token={props.token}
              setShowLoginModal={setShowLoginModal}
              // is_registration_needed={
              //   props.payment ? props.payment.is_registration_needed : false
              // }
              // selectedPoi={selectedPoi}
              // user_email={props.user_email}
              // is_preview={props.preview}
              // is_stock={props.is_stock}
              // setShowPoiModal={_handlePoiEditModalOpen}
              // traveleritinerary={props.traveleritinerary}
              // day_slabs={props.itinerary.day_slabs}
              // hours={hours}
              // minutes={minutes}
              // seconds={seconds}
              // timeRequired={props.timeRequired}
              // hideTimer={minimiseTimer}
              // itineraryDate={props.itineraryDate}
              // showTimer={false}
              // _hideTimerHandler={_minimiseTimerHandler}
              // blur={false}
              // location_selected={location}
              city_slabs={props?.breif?.city_slabs}
              itinerary={props.itinerary}
              setItinerary={props.setItinerary}
              getPaymentHandler={props.getPaymentHandler}
              // newData={props.newData}
              // demoitinerary={props.demoitinerary}
            ></NewItenaryDBDMob>
          </div>

          <div id={items[2].link}>
            <HotelsBooking
              setShowLoginModal={setShowLoginModal}
              plan={props.plan}
              hasUserPaid={
                props.payment ? (props.payment.paid_user ? true : false) : false
              }
              budget={props.budget}
              breif={props.breif}
              stayBookings={props.stayBookings}
              _updateBookingHandler={props._updateBookingHandler}
              _updateStayBookingHandler={props._updateStayBookingHandler}
              _updatePaymentHandler={props._updatePaymentHandler}
              getPaymentHandler={props.getPaymentHandler}
              setShowBookingModal={() => props.setShowBookingModal(true)}
              showBookingModal={props.showBookingModal}
              setHideBookingModal={props.setHideBookingModal}
              payment={props.payment}
              booking={props.booking}
            ></HotelsBooking>
          </div>
          {props.transferBookings && (
            <div id={items[3].link}>
              <TransfersContainer
                setShowLoginModal={setShowLoginModal}
                plan={props.plan}
                dayslab={props?.itinerary?.day_slabs}
                breif={props?.breif}
                routesData={RoutesData}
                transfers={TransfersData}
                routes={props.routes}
                showTaxiModal={props.showTaxiModal}
                getPaymentHandler={props.getPaymentHandler}
                _updateFlightBookingHandler={props._updateFlightBookingHandler}
                setShowTaxiModal={props.setShowTaxiModal}
                _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
                _updatePaymentHandler={props._updatePaymentHandler}
                _updateBookingHandler={props._updateBookingHandler}
                showFlightModal={props.showFlightModal}
                setShowFlightModal={_handleFlighModalShow}
                setHideFlightModal={_handleFlightModalClose}
                setShowBookingModal={() => props.setShowBookingModal(true)}
                setHideBookingModal={props.setHideBookingModal}
                payment={props.payment}
                transferBookings={props.transferBookings}
              />
            </div>
          )}
          {props.activityBookings && (
            <div id={items[4].link}>
              <ActivityBookings
                plan={props.plan}
                hasUserPaid={
                  props.payment
                    ? props.payment.paid_user
                      ? true
                      : false
                    : false
                }
                budget={props.budget}
                stayBookings={props.stayBookings}
                _updateBookingHandler={props._updateBookingHandler}
                _updateStayBookingHandler={props._updateStayBookingHandler}
                _updatePaymentHandler={props._updatePaymentHandler}
                flightLoading={props.flightLoading}
                flightBookings={props.flightBookings}
                getPaymentHandler={props.getPaymentHandler}
                setShowBookingModal={() => props.setShowBookingModal(true)}
                showBookingModal={props.showBookingModal}
                setHideBookingModal={props.setHideBookingModal}
                activityBookings={props.activityBookings}
                payment={props.payment}
                booking={props.booking}
              />
            </div>
          )}
          <Modal
            centered
            show={showFooterBannerMobile}
            mobileWidth="90%"
            backdrop
            closeIcon={true}
            onCLose={() => setShowFooterBannerMobile(false)}
            onHide={_handleLoginClose}
            borderRadius={'12px'}
          >
            {props.payment ? (
              <div className=" ">
                {/* <BookingContainer
        payment={props.payment}
        plan={props.plan}
        stayBookings={props.stayBookings}
        flightBookings={props.flightBookings}
        activityBookings={props.activityBookings}
        transferBookings={props.transferBookings}
      ></BookingContainer> */}
                <RxCross2
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => setShowFooterBannerMobile(false)}
                />

                {!props.payment.is_registration_needed || true ? (
                  <SummaryContainer
                    setUserDetails={props.setUserDetails}
                    id={props.id}
                    stayBookings={props.stayBookings}
                    flightBookings={props.flightBookings}
                    activityBookings={props.activityBookings}
                    transferBookings={props.transferBookings}
                    setShowFooterBannerMobile={() =>
                      setShowFooterBannerMobile(true)
                    }
                    getPaymentHandler={props.getPaymentHandler}
                    payment={props.payment}
                    traveleritinerary={props.traveleritinerary}
                    blur={props.blur}
                    hide={_hidePaymentHandler}
                    experienceId={props.experienceId}
                    token={props.token}
                    setShowLoginModal={setShowLoginModal}
                    plan={props.plan}
                  ></SummaryContainer>
                ) : (
                  // width 27vw
                  <div>
                    <GITSummaryContainer
                      hasUserPaid={
                        props.payment
                          ? props.payment.paid_user
                            ? true
                            : false
                          : false
                      }
                      payment_status={props.payment_status}
                      plan={props.plan}
                      itinerary={props.itinerary}
                      getPaymentHandler={props.getPaymentHandler}
                      setUserDetails={props.setUserDetails}
                      id={props.id}
                      stayBookings={props.stayBookings}
                      flightBookings={props.flightBookings}
                      activityBookings={props.activityBookings}
                      transferBookings={props.transferBookings}
                      setShowFooterBannerMobile={() =>
                        setShowFooterBannerMobile(true)
                      }
                      payment={props.payment}
                      traveleritinerary={props.traveleritinerary}
                      blur={props.blur}
                      hide={_hidePaymentHandler}
                      experienceId={props.experienceId}
                      token={props.token}
                      setShowLoginModal={setShowLoginModal}
                    ></GITSummaryContainer>
                  </div>
                )}
              </div>
            ) : null}
          </Modal>
        </>
      )}
      {/* // for 0000000000000000000000  desktop */}
      {isPageWide ? (
        <SplitScreen
          classStyle="min-h-[600px]"
          isPageWide
          leftWidth={8}
          rightWidth={4}
        >
          <div>
            {isPageWide ? (
              <div id={items[1].link}>
                {props?.itinerary && (
                  <NewItenaryMain
                    setShowLoginModal={setShowLoginModal}
                    plan={props.plan}
                    payment={props.payment}
                    city_slabs={props?.breif?.city_slabs}
                    itinerary={props?.itinerary}
                    setItinerary={props.setItinerary}
                    getPaymentHandler={props.getPaymentHandler}
                    token={props.token}
                  ></NewItenaryMain>
                )}
              </div>
            ) : (
              <div id={items[1].link}>
                <NewItenaryDBDMob
                  plan={props.plan}
                  payment={props.payment}
                  token={props.token}
                  setShowLoginModal={setShowLoginModal}
                  // is_registration_needed={
                  //   props.payment ? props.payment.is_registration_needed : false
                  // }
                  // selectedPoi={selectedPoi}
                  // user_email={props.user_email}
                  // is_preview={props.preview}
                  // is_stock={props.is_stock}
                  // setShowPoiModal={_handlePoiEditModalOpen}
                  // traveleritinerary={props.traveleritinerary}
                  // day_slabs={props.itinerary.day_slabs}
                  // hours={hours}
                  // minutes={minutes}
                  // seconds={seconds}
                  // timeRequired={props.timeRequired}
                  // hideTimer={minimiseTimer}
                  // itineraryDate={props.itineraryDate}
                  // showTimer={false}
                  // _hideTimerHandler={_minimiseTimerHandler}
                  // blur={false}
                  // location_selected={location}
                  city_slabs={props?.breif?.city_slabs}
                  itinerary={props.itinerary}
                  setItinerary={props.setItinerary}
                  // newData={props.newData}
                  getPaymentHandler={props.getPaymentHandler}

                  // demoitinerary={props.demoitinerary}
                ></NewItenaryDBDMob>
              </div>
            )}
            {/* {isPageWide ? (
          <div id={items[1].link}>
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
          </div>
        ) : (
          <div id={items[1].link}>
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
          </div>
        )} */}
            {isGroup ? (
              <div id={items[2].link}>
                <Register></Register>
              </div>
            ) : (
              <div id={items[2].link}>
                <HotelsBooking
                  setShowLoginModal={setShowLoginModal}
                  plan={props.plan}
                  hasUserPaid={
                    props.payment
                      ? props.payment.paid_user
                        ? true
                        : false
                      : false
                  }
                  breif={props.breif}
                  budget={props.budget}
                  stayBookings={props.stayBookings}
                  _updateBookingHandler={props._updateBookingHandler}
                  _updateStayBookingHandler={props._updateStayBookingHandler}
                  _updatePaymentHandler={props._updatePaymentHandler}
                  getPaymentHandler={props.getPaymentHandler}
                  setShowBookingModal={() => props.setShowBookingModal(true)}
                  showBookingModal={props.showBookingModal}
                  setHideBookingModal={props.setHideBookingModal}
                  payment={props.payment}
                  booking={props.booking}
                ></HotelsBooking>
              </div>
            )}

            {props.transferBookings && (
              <div id={items[3].link}>
                <TransfersContainer
                  setShowLoginModal={setShowLoginModal}
                  plan={props.plan}
                  dayslab={props?.itinerary?.day_slabs}
                  breif={props?.breif}
                  showTaxiModal={props.showTaxiModal}
                  routesData={RoutesData}
                  transfers={TransfersData}
                  routes={props.routes}
                  _updateFlightBookingHandler={
                    props._updateFlightBookingHandler
                  }
                  setShowTaxiModal={props.setShowTaxiModal}
                  getPaymentHandler={props.getPaymentHandler}
                  _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
                  _updatePaymentHandler={props._updatePaymentHandler}
                  _updateBookingHandler={props._updateBookingHandler}
                  showFlightModal={props.showFlightModal}
                  setShowFlightModal={_handleFlighModalShow}
                  setHideFlightModal={_handleFlightModalClose}
                  setShowBookingModal={() => props.setShowBookingModal(true)}
                  setHideBookingModal={props.setHideBookingModal}
                  payment={props.payment}
                  transferBookings={props?.transferBookings}
                />
              </div>
            )}
            {props.activityBookings && (
              <div id={items[4].link}>
                <ActivityBookings
                  plan={props.plan}
                  hasUserPaid={
                    props.payment
                      ? props.payment.paid_user
                        ? true
                        : false
                      : false
                  }
                  budget={props.budget}
                  stayBookings={props.stayBookings}
                  _updateBookingHandler={props._updateBookingHandler}
                  _updateStayBookingHandler={props._updateStayBookingHandler}
                  _updatePaymentHandler={props._updatePaymentHandler}
                  flightLoading={props.flightLoading}
                  flightBookings={props.flightBookings}
                  getPaymentHandler={props.getPaymentHandler}
                  setShowBookingModal={() => props.setShowBookingModal(true)}
                  showBookingModal={props.showBookingModal}
                  setHideBookingModal={props.setHideBookingModal}
                  activityBookings={props.activityBookings}
                  payment={props.payment}
                  booking={props.booking}
                />
              </div>
            )}
          </div>

          {props.payment ? (
            <div
              id="Booking_container"
              className="sticky top-[6rem] mt-40 ml-4"
            >
              {/* <BookingContainer
                  payment={props.payment}
                  plan={props.plan}
                  stayBookings={props.stayBookings}
                  flightBookings={props.flightBookings}
                  activityBookings={props.activityBookings}
                  transferBookings={props.transferBookings}
                ></BookingContainer> */}
              {!props.payment.is_registration_needed || true ? (
                <SummaryContainer
                  setUserDetails={props.setUserDetails}
                  id={props.id}
                  stayBookings={props.stayBookings}
                  flightBookings={props.flightBookings}
                  activityBookings={props.activityBookings}
                  transferBookings={props.transferBookings}
                  setShowFooterBannerMobile={() =>
                    setShowFooterBannerMobile(true)
                  }
                  getPaymentHandler={props.getPaymentHandler}
                  payment={props.payment}
                  traveleritinerary={props.traveleritinerary}
                  blur={props.blur}
                  hide={_hidePaymentHandler}
                  experienceId={props.experienceId}
                  token={props.token}
                  setShowLoginModal={setShowLoginModal}
                  plan={props.plan}
                ></SummaryContainer>
              ) : (
                // width 27vw
                <div>
                  <GITSummaryContainer
                    hasUserPaid={
                      props.payment
                        ? props.payment.paid_user
                          ? true
                          : false
                        : false
                    }
                    payment_status={props.payment_status}
                    plan={props.plan}
                    itinerary={props.itinerary}
                    getPaymentHandler={props.getPaymentHandler}
                    setUserDetails={props.setUserDetails}
                    id={props.id}
                    stayBookings={props.stayBookings}
                    flightBookings={props.flightBookings}
                    activityBookings={props.activityBookings}
                    transferBookings={props.transferBookings}
                    setShowFooterBannerMobile={() =>
                      setShowFooterBannerMobile(true)
                    }
                    payment={props.payment}
                    traveleritinerary={props.traveleritinerary}
                    blur={props.blur}
                    hide={_hidePaymentHandler}
                    experienceId={props.experienceId}
                    token={props.token}
                    setShowLoginModal={setShowLoginModal}
                  ></GITSummaryContainer>
                </div>
              )}
            </div>
          ) : null}
        </SplitScreen>
      ) : null}

      {/* {isGroup ? (
          <div id={items[2].link}>
            <Register></Register>
          </div>
        ) : (
          <div id={items[2].link}>
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
              _deselectFlightBookingHandler={
                props._deselectFlightBookingHandler
              }
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
              payment={props.payment}
              booking={props.booking}
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
            ></Booking>
          </div>
        )} */}

      <div className="  z-10 sticky shadow-lg z-2 bottom-[0px] bg-white px-1 py-2 md:hidden -mx-5">
        <div className="flex flex-row justify-between items-center mx-3">
          <div className="flex flex-col">
            <div className="text-sm">
              {props?.payment?.pay_only_for_one ||
              props?.payment?.show_per_person_cost
                ? 'Per Person'
                : props.payment?.is_estimated_price
                ? `${props.payment.total_cost == 0 ? '' : 'Estimated Price'}`
                : 'Total Cost'}
            </div>
            {props.payment ? (
              <div>
                <span className="font-bold">
                  ₹{' '}
                  {props?.payment?.pay_only_for_one ||
                  props?.payment?.show_per_person_cost
                    ? getIndianPrice(
                        Math.round(
                          Math.round(props.payment.per_person_discounted_cost) /
                            100
                        )
                      )
                    : getIndianPrice(
                        Math.round(
                          Math.round(props.payment.discounted_cost) / 100
                        )
                      )}
                  {'/-'}
                </span>
              </div>
            ) : null}
          </div>
          {props?.token && props?.payment?.paid_user && (
            <div className="border-[3px] flex  justify-center items-center text-[#04AA32] text-center font-medium  text-sm border-[#04AA32] px-[9px] py-[0px]">
              PAID
            </div>
          )}
          {!props.token ? (
            <div className="">
              <Button
                color="#111"
                fontWeight="600"
                fontSize="0.85rem"
                borderWidth="3px"
                width="10rem"
                borderRadius="8px"
                bgColor="#f8e000"
                onclick={() => setShowLoginModal(true)}
              >
                Log in to proceed
              </Button>
            </div>
          ) : null}

          {props.payment && props.token ? (
            props.payment.itinerary_status ===
              ITINERARY_STATUSES.itinerary_finalized &&
            !props.payment.paid_user &&
            props.payment.user_allowed_to_pay ? (
              props.payment.total_cost > 0 ? (
                <div className="">
                  <Button
                    color="#111"
                    fontWeight="600"
                    fontSize="0.85rem"
                    borderWidth="2px"
                    width="10rem"
                    borderRadius="8px"
                    bgColor="#f8e000"
                    onclick={() =>
                      setShowFooterBannerMobile(!showFooterBannerMobile)
                    }
                  >
                    Proceed to Book
                  </Button>
                </div>
              ) : (
                <div className="">
                  <Button
                    color="#111"
                    fontWeight="600"
                    fontSize="0.85rem"
                    borderWidth="2px"
                    width="10rem"
                    borderRadius="8px"
                    bgColor="#f8e000"
                    onclick={() => scrollToElement('Stays-Head')}
                  >
                    Add Hotels
                  </Button>
                </div>
              )
            ) : !props.payment.paid_user ? (
              props.payment.is_registration_needed ? (
                <div className="">
                  <Button
                    color="#111"
                    fontWeight="600"
                    fontSize="0.85rem"
                    borderWidth="2px"
                    width="10rem"
                    borderRadius="8px"
                    bgColor="#f8e000"
                    onclick={() =>
                      setShowFooterBannerMobile(!showFooterBannerMobile)
                    }
                  >
                    Proceed to Book
                  </Button>
                </div>
              ) : (
                <div className="">
                  <Button
                    color="#111"
                    fontWeight="600"
                    fontSize="0.85rem"
                    borderWidth="2px"
                    width="10rem"
                    borderRadius="8px"
                    bgColor="#f8e000"
                    onclick={() => setNewitinerary(!Newitinerary)}
                  >
                    Craft a new trip!
                  </Button>
                </div>
              )
            ) : (
              <Button
                color="#fff"
                fontWeight="600"
                fontSize="0.85rem"
                borderWidth="0px"
                width="8rem"
                borderRadius="8px"
                bgColor="#04AA32"
                onclick={() =>
                  setShowFooterBannerMobile(!showFooterBannerMobile)
                }
              >
                View Bookings
              </Button>
            )
          ) : null}
        </div>
      </div>

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
      {props.token && Newitinerary && (
        <MakeYourPersonalised
          date={props?.payment?.meta_info?.start_date}
          onHide={() => setNewitinerary(false)}
          show={Newitinerary}
        />
      )}
      {/* <Accommodation show={true} ></Accommodation> */}
      <div className="width-[100%]">
        <LogInModal
          show={showLoginModal}
          onhide={_handleLoginClose}
          itinary_id={props.id}
        ></LogInModal>
      </div>
    </div>
  );
};

export default SimpleTabsV2;
