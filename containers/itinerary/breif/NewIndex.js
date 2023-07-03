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
// import DesktopPersonaliseBanner from '../../components/containers/Banner' ;
import DesktopBanner from '../../../components/containers/Banner';
import Banner from '../../homepage/banner/Mobile';
import Route from '../../newitinerary/breif/route/Index';
import ButtonYellow from '../../../components/ButtonYellow';
import InclusionExclusion from '../../../components/InclusionExclusion/InclusionExclusion';

import dynamic from 'next/dynamic';
import CityDetails from './CityDetails';
import POIDetailsSkeleton from '../../../components/drawers/poiDetails/POIDetailsSkeleton';
import Drawer from '../../../components/drawers/cityDetails/CityDetailsDrawer';
import { TbArrowBack } from 'react-icons/tb';
const DetailsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10;
  flex-direction: column-reverse;
  margin: 0 auto 2vh auto;
  padding: 0 0rem;
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
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDrawerData, setShowDrawerData] = useState(false);
  const [currentPopup, setCurrentPopup] = useState(false);

  // async function getRoutes(itinaryId) {
  //   const res = await axiosPoiRoutes.get(`/?itinerary_id=${itinaryId}`);
  //   const data = res.data;
  //   return data;
  // }

  const router = useRouter();
  let isPageWide = media('(min-width: 768px)');
  const _handleTailoredRedirect = (e) => {
    router.push('/tailored-travel');
  };
  const getdayId = (id) => {
    return props.itinerary?.day_slabs[id]?.slab_id;
  };
  const getdateId = (id) => {
    return props.itinerary?.day_slabs[id]?.slab;
  };

  const Locationlatlong = [];
  if (props.routesData.length >= 1) {
    console.log('itsrendering');
    for (var i = 0; i < props.routesData.length; i++) {
      var postion = props.breif.city_slabs[i + 1];

      // console.log(`response city data${JSON.stringify(citydetails)}`);
      // console.log(`lat,long${citydetails.lat}`);
      if (
        props.routesData[i].duration &&
        props.routesData[i].duration !== '0'
      ) {
        Locationlatlong.push({
          dayId: getdayId(
            props.routesData[i].day_slab_location.start_day_slab_index
          ),
          cityData: postion,
          id: props.routesData[i].gmaps_place_id,
          city_id: props.routesData[i].city_id,
          lat: props.routesData[i].lat,
          long: props.routesData[i].long,
          name: props.routesData[i].city_name,
          duration: props.routesData[i].duration,
          color: props.routesData[i].color,
          date: getdateId(
            props.routesData[i].day_slab_location.start_day_slab_index
          ),
        });
      }
    }
  } else {
    console.log('inside else', props.breif.city_slabs);
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
          lat: postion.lat != null ? postion?.lat : 33.75,
          long: postion.long != null ? postion?.long : 78.66,
          name: postion.city_name,
          duration: postion.duration,
          color: postion.color,
          date: getdateId(postion.day_slab_location.start_day_slab_index),
        });
      }
    }
  }
  // const getdayId = (id) => {
  //   return props.itinerary?.day_slabs[id]?.slab_id;
  // };
  // const getdateId = (id) => {
  //   return props.itinerary?.day_slabs[id]?.slab;
  // };
  // async function getCityDetails(cityname) {
  //   const res = await axiosPoiCityInstance.get(`/?city_id=${cityname}`);
  //   const data = res.data;
  //   return data;
  // }

  // useEffect(() => {
  //   console.log('its useeffect');
  //   console.log(props.routesData);

  // }, []);

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
  const LeafMap = dynamic(() => import('../../../components/mapbox.js'), {
    ssr: false,
  });
  const MapWithNoSSR = ({
    locations,
    currentPopup,
    setCurrentPopup,
    setShowDrawer,
    setShowDrawerData,
  }) => (
    <LeafMap
      locations={Locationlatlong}
      currentPopup={currentPopup}
      setCurrentPopup={setCurrentPopup}
      setShowDrawer={setShowDrawer}
      setShowDrawerData={setShowDrawerData}
    />
  );
  // const LeafMap = dynamic(
  //   () => import('../../../components/LeafMap'), // replace '@components/map' with your component's location
  //   {
  //     loading: () => <p>A map is loading now</p>,
  //     suspense: true,
  //     ssr: false, // This line is important. It's what prevents server-side render
  //   }
  // );
  console.log('Locationlatlong');
  console.log(Locationlatlong);
  return (
    <div>
      {/* <YellowNavbar   price={props.data.payment_info[0].total_cost}></YellowNavbar> */}
      {/* <PageNavigation price={props.data.payment_info[0].total_cost} /> */}
      {/* <HeaderExtraPadding></HeaderExtraPadding> */}

      <DetailsContainer>
        {Locationlatlong.length >= 1 ? (
          <div
            className="sticky md:top-[70px] lg:w-[50vw] lg:h-[70vh]  w-[88vw] h-[23rem] lg:mt-20 mt-8  rounded-xl"
            id="MapcontainerRoute"
          >
            <div className="absolute w-[100%] h-[100%] rounded-xl">
              <MapWithNoSSR
                locations={Locationlatlong}
                currentPopup={currentPopup}
                setCurrentPopup={setCurrentPopup}
                setShowDrawer={setShowDrawer}
                setShowDrawerData={setShowDrawerData}
              />
            </div>
          </div>
        ) : null}

        <RouteComponent>
          {props.routes.length >= 1 || props.itinerary?.day_slabs ? (
            <div id="route">
              <Route
                plan={props.plan}
                dayslab={props.itinerary?.day_slabs}
                breif={props.breif}
                routesData={props.routesData}
                transfers={props.transfersData}
                routes={props.routes}
                setPlaceID={setActive}
                active={active}
                setCurrentPopup={setCurrentPopup}
                setShowDrawer={setShowDrawer}
                setShowDrawerData={setShowDrawerData}
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
      <Drawer
        show={showDrawer}
        onHide={() => setShowDrawer(false)}
        city_id={showDrawerData.city_id}
      ></Drawer>
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
