import React, { useState, useEffect } from 'react';
import Row from '../../../components/experiencecity/info/Row';

import Overview from './overview/Index';

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
  justify-content: flex-end;
  gap: 10;
  flex-direction: column;
  margin: 0 auto 2vh auto;
  padding: 0 1rem;
  @media screen and (min-width: 768px) {
    flex-direction: row-reverse;
    padding: 0;
    margin: 10vh auto 10vh auto;
  }
`;
const RouteComponent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 768px) {
    width: 32%;
    margin-left: 5vw;
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
  console.log(`id mapp${active}`);
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
  const router = useRouter();
  let isPageWide = media('(min-width: 768px)');
  const _handleTailoredRedirect = (e) => {
    router.push('/tailored-travel');
  };
  const Locationlatlong = [];
  // setActive(props.breif.city_slabs[1].gmaps_place_id)
  for (var i = 0; i < props.breif.city_slabs.length; i++) {
    let postion = props.breif.city_slabs[i];

    if (!postion.is_departure_only && !postion.is_trip_terminated) {
      Locationlatlong.push({
        id: postion.gmaps_place_id,
        lat: postion.lat,
        long: postion.long,
        name: postion.city_name,
        duration: postion.duration,
        color: postion.color,
      });
    }
  }
  // props.breif.city_slabs.map(
  //   (postion) =>

  // );
  console.log(Locationlatlong);
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
  const MapCaller = ({ location }) => <LeafMap location={location} />;
  const LeafMap = dynamic(
    () => import('../../../components/LeafMap'), // replace '@components/map' with your component's location
    {
      loading: () => <p>A map is loading now</p>,

      ssr: false, // This line is important. It's what prevents server-side render
    }
  );
  return (
    <div>
      {/* <YellowNavbar   price={props.data.payment_info[0].total_cost}></YellowNavbar> */}
      {/* <PageNavigation price={props.data.payment_info[0].total_cost} /> */}
      {/* <HeaderExtraPadding></HeaderExtraPadding> */}
      <DetailsContainer>
        <RouteComponent>
          <div id="route">
            <Route
              breif={props.breif}
              setPlaceID={setActive}
              active={active}
            ></Route>
          </div>

          {/* <div className='svg-container'>
        <MapCaller
          // Data={MapData1}
          // Data2={MapData2}
          // SData={visibilities}
          location={Locationlatlong}
        />
        </div> */}

          <div id="MapcontainerRoute">
            <Map
              locations={Locationlatlong}
              defaultZoom={12}
              height={isPageWide ? '350px' : '230px'}
              InfoWindowContainer={InfoWindowContainer}
              active={active}
            ></Map>
          </div>
        </RouteComponent>
        {isPageWide ? (
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
        ) : null}
      </DetailsContainer>
      <ContainerBt style={{ padding: '30px 0px' }}>
        <ButtonYellow>View Day By Day Itinerary</ButtonYellow>
      </ContainerBt>
      <InclusionExclusion payment={props.payment} />
      <ContainerBt style={{ padding: '30px 0px' }}>
        <ButtonYellow>View All Bookings</ButtonYellow>
      </ContainerBt>
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
