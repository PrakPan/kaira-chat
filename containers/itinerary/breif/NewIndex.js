import React, { useState, useEffect } from 'react';
import Row from '../../../components/experiencecity/info/Row';

import Overview from './overview/Index';
import axiosPoiCityInstance from '../../../services/poi/city';
import axiosPoiRoutes from '../../../services/itinerary/brief/route';
// import InformationTextContainer from '../../components/experiencecity/info/InformationTextContainer';
// import RouteData from './Locations';

// import InclusionsData from './Inclusions';

import styled from 'styled-components';
import { Element } from 'react-scroll';
//  import Faqs from '../../components/experiencecity/info/faqs/Index';
// import Banner from './Banner/Index';
// import Howtoreach from '../../components/experiencecity/info/Howtoreach';
import { useRef } from 'react';
import media from '../../../components/media';
import { useRouter } from 'next/router';
// import Footer from '../../components/footer/Index';
// import DesktopPersonaliseBanner from '../../components/containers/Banner' ;
import DesktopBanner from '../../../components/containers/Banner';
import Banner from '../../homepage/banner/Mobile';
import Route from '../../newitinerary/breif/route/Index';
import ButtonYellow from '../../../components/ButtonYellow';
import InclusionExclusion from '../../../components/InclusionExclusion/InclusionExclusion';
import Map from '../../../components/Map';

import dynamic from 'next/dynamic';
const DetailsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10;
  flex-direction: column-reverse;
  margin: 0 auto 2vh auto;
  padding: 0 1rem;
  @media screen and (min-width: 768px) {
    flex-direction: row-reverse;
    padding: 0;
    margin: 4vh auto 4vh auto;
  }
`;
const RouteComponent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 768px) {
    width: 30%;
  }
`;
const ContainerBt = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const MapInfo = styled.div`
  b {
    font-weight: 600;
  }
`;

const Details = (props) => {
  let offsets = {};
  const [offset, setOffset] = useState(null);
  const [active, setActive] = useState(null);
  const [routes, setRoutes] = useState(false);
  const [transfers, setTransfers] = useState(false);

  const [currentPopup, setCurrentPopup] = useState(false);

  async function getRoutes(itinaryId) {
    const res = await axiosPoiRoutes.get(`/?itinerary_id=${itinaryId}`);
    const data = res.data;
    return data;
  }
  const routesData = [];
  const TransfersData = [];
  const router = useRouter();
  let isPageWide = media('(min-width: 768px)');
  const _handleTailoredRedirect = (e) => {
    router.push('/tailored-travel');
  };
  const Locationlatlong = [];
  const getdayId = (id) => {
    return props.itinerary?.day_slabs[id]?.slab_id;
  };
  const getdateId = (id) => {
    return props.itinerary?.day_slabs[id]?.slab;
  };
  async function getCityDetails(cityname) {
    const res = await axiosPoiCityInstance.get(`/?city_id=${cityname}`);
    const data = res.data;
    return data;
  }
  useEffect(() => {
    getRoutes(props.breif.tailor_made_id)
      .then((res) => {
        for (var i = 0; i < res.length; i++) {
          // console.log(`response city data${JSON.stringify(citydetails)}`);
          // console.log(`lat,long${citydetails.lat}`);
          if (res[i].long) {
            routesData.push(res[i]);
          } else {
            TransfersData.push(res[i]);
          }
        }

        setRoutes(routesData);
        setTransfers(TransfersData);
        // for (var i = 0; i < routes.length; i++) {
        //   var postion = props.breif.city_slabs[i + 1];

        //   // console.log(`response city data${JSON.stringify(citydetails)}`);
        //   // console.log(`lat,long${citydetails.lat}`);
        //   if (routes[i].duration && routes[i].duration !== '0') {
        //     Locationlatlong.push({
        //       dayId: getdayId(routes[i].start_day_slab_index),
        //       cityData: postion,
        //       id: routes[i].gmaps_place_id,
        //       city_id: routes[i].city_id,
        //       lat: routes[i].lat,
        //       long: routes[i].long,
        //       name: routes[i].city_name,
        //       duration: routes[i].duration,
        //       color: routes[i].color,
        //       date: getdateId(routes[i].start_day_slab_index),
        //     });
        //   }
        // }
      })
      .catch((err) => {
        console.log(`error in routes${err}`);
        // for (var i = 0; i < props.breif.city_slabs.length; i++) {
        //   var postion = props.breif.city_slabs[i];

        //   // console.log(`response city data${JSON.stringify(citydetails)}`);
        //   // console.log(`lat,long${citydetails.lat}`);
        //   if (
        //     !postion.is_departure_only &&
        //     !postion.is_trip_terminated &&
        //     postion.duration &&
        //     postion.duration !== '0'
        //   ) {
        //     Locationlatlong.push({
        //       dayId: getdayId(postion.day_slab_location.start_day_slab_index),
        //       cityData: postion,
        //       id: postion.gmaps_place_id,
        //       city_id: postion.city_id,
        //       lat: postion.lat ?? '18.5204',
        //       long: postion.long ?? '73.8567',
        //       name: postion.city_name,
        //       duration: postion.duration,
        //       color: postion.color,
        //     });
        //   }
        // }
      });
  }, []);

  // useEffect(()=> {

  //         window.addEventListener('scroll', _handleScroll);
  //          return () => {
  //         window.removeEventListener('scroll', _handleScroll);
  //       }
  // })
  //   const overviewRef = useRef();
  //   const routeRef = useRef();
  //   const locationsRef=useRef();
  //   const howtoreachRef = useRef();
  //   const inclusionsRef = useRef();
  //   const exclusionsRef = useRef();
  //   const faqsRef = useRef();

  //   const _handleScroll = () => {
  //     if(overviewRef && routeRef && howtoreachRef && exclusionsRef && inclusionsRef && faqsRef)
  //     offsets={
  //             'Overview': overviewRef.current.offsetTop,
  //             'Route':  routeRef.current.offsetTop,
  //             'How to reach': howtoreachRef.current.offsetTop,
  //             'Inclusions' : inclusionsRef.current.offsetTop,
  //             'Exclusions': exclusionsRef.current.offsetTop,
  //             'FAQ/s':  faqsRef.current.offsetTop
  //           }
  //           if(typeof window !== 'undefined')
  //       if(window.pageYOffset > 300 && !offset) setOffset(offsets);
  //   }

  if (routes) {
    console.log('itsrendering');
    for (var i = 0; i < routes.length; i++) {
      var postion = props.breif.city_slabs[i + 1];

      // console.log(`response city data${JSON.stringify(citydetails)}`);
      // console.log(`lat,long${citydetails.lat}`);
      if (routes[i].duration && routes[i].duration !== '0') {
        Locationlatlong.push({
          dayId: getdayId(routes[i].start_day_slab_index),
          cityData: postion,
          id: routes[i].gmaps_place_id,
          city_id: routes[i].city_id,
          lat: routes[i].lat,
          long: routes[i].long,
          name: routes[i].city_name,
          duration: routes[i].duration,
          color: routes[i].color,
          date: getdateId(routes[i].start_day_slab_index),
        });
      }
    }
  } else {
    for (var i = 0; i < props.breif.city_slabs.length; i++) {
      var postion = props.breif.city_slabs[i];

      // console.log(`response city data${JSON.stringify(citydetails)}`);
      // console.log(`lat,long${citydetails.lat}`);
      if (
        !postion.is_departure_only &&
        !postion.is_trip_terminated &&
        postion.duration &&
        postion.duration !== '0'
      ) {
        Locationlatlong.push({
          dayId: getdayId(postion.day_slab_location.start_day_slab_index),
          cityData: postion,
          id: postion.gmaps_place_id,
          city_id: postion.city_id,
          lat: postion.lat ?? '18.5204',
          long: postion.long ?? '73.8567',
          name: postion.city_name,
          duration: postion.duration,
          color: postion.color,
        });
      }
    }
  }

  // props.breif.city_slabs.map(
  //   (postion) =>

  // );
  // console.log(Locationlatlong);
  const InfoWindowContainer = (location) => (
    <MapInfo>
      <b>{location.name}</b>
      {/* <div>
        {location.experience_filters.map((e, i) =>
          i != 0 ? <span>{', ' + e}</span> : <span>{e}</span>
        )}
      </div> */}
      {location.duration && <p>Ideal duration : {location.duration} days</p>}
    </MapInfo>
  );
  // const MapCaller = ({ location, currentPopup, setCurrentPopup }) => (
  //   <LeafMap
  //     location={location}
  //     currentPopup={currentPopup}
  //     setCurrentPopup={setCurrentPopup}
  //   />
  // );
  const MapWithNoSSR = dynamic(() => import('../../../components/mapbox.js'), {
    ssr: true,
    suspense: true,
  });
  // const LeafMap = dynamic(
  //   () => import('../../../components/LeafMap'), // replace '@components/map' with your component's location
  //   {
  //     loading: () => <p>A map is loading now</p>,
  //     suspense: true,
  //     ssr: false, // This line is important. It's what prevents server-side render
  //   }
  // );

  return (
    <div>
      {/* <YellowNavbar   price={props.data.payment_info[0].total_cost}></YellowNavbar> */}
      {/* <PageNavigation price={props.data.payment_info[0].total_cost} /> */}
      {/* <HeaderExtraPadding></HeaderExtraPadding> */}

      <DetailsContainer>
        {Locationlatlong.length > 2 ? (
          <div
            className="sticky md:top-[70px] lg:w-[60vw] lg:h-[85vh]  w-[88vw] h-[23rem] lg:mt-20 mt-2  rounded-xl"
            id="MapcontainerRoute"
          >
            <div className="absolute w-[100%] h-[100%] rounded-xl">
              <MapWithNoSSR
                locations={Locationlatlong}
                currentPopup={currentPopup}
                setCurrentPopup={setCurrentPopup}
              />
            </div>
          </div>
        ) : null}

        <RouteComponent>
          {routes || props.itinerary?.day_slabs ? (
            <div id="route">
              <Route
                dayslab={props.itinerary?.day_slabs}
                breif={props.breif}
                routes={routes}
                transfers={transfers}
                setPlaceID={setActive}
                active={active}
                setCurrentPopup={setCurrentPopup}
              />
            </div>
          ) : null}

          <div className="svg-container"></div>

          {/* <div id="MapcontainerRoute">
            <Map
              locations={Locationlatlong}
              defaultZoom={12}
              height={isPageWide ? '350px' : '230px'}
              InfoWindowContainer={InfoWindowContainer}
              active={active}
            ></Map>
          </div> */}
          {/* {routes && (
            <div
              className="relative lg:w-[30rem] lg:h-[30rem]  w-[23rem] h-[23rem]  rounded-xl"
              id="MapcontainerRoute"
            >
              <div className="absolute w-[100%] h-[100%] rounded-xl">
                <MapWithNoSSR locations={Locationlatlong} />
              </div>
            </div>
          )} */}
        </RouteComponent>

        {/* {isPageWide ? (
          <div>
            <div>
              {true ? (
                <Overview
                  breif={props.breif}
                  daysSlab={props.itinerary.day_slabs}
                ></Overview>
              ) : null}
            </div>
          </div>
        ) : null} */}
      </DetailsContainer>
      {/* <ContainerBt style={{ padding: '30px 0px' }}>
        <ButtonYellow>View Day By Day Itinerary</ButtonYellow>
      </ContainerBt>
      <InclusionExclusion payment={props.payment} />
      <ContainerBt style={{ padding: '30px 0px' }}>
        <ButtonYellow>View All Bookings</ButtonYellow>
      </ContainerBt> */}

      {/* <div className="relative h-[12rem] w-[12rem]">
        <div
          id="MapContanier"
          name="MapContanierElement"
          className=" absolute  md:pt-12 md:pb-0 py-4"
        >
          <MapCaller
            // Data={MapData1}
            // Data2={MapData2}
            // SData={visibilities}
            locations={Locationlatlong}
          />
        </div>
      </div> */}

      {props.traveleritinerary ? (
        <DesktopBanner
          onclick={_handleTailoredRedirect}
          text="Want to personalize your own experience like this?"
        ></DesktopBanner>
      ) : null}
      {props.traveleritinerary ? (
        <div className="hidden-desktop">
          <Banner
            text="Want to craft your own travel experience like this?"
            buttontext="Start Now"
            color="black"
            buttonbgcolor="#f7e700"
          ></Banner>
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(Details);
