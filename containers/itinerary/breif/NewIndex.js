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
const DetailsContainer = styled.div`
  width: 100%;
  display: flex;
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

  @media screen and (min-width: 768px) {
    width: 100%;
    margin-left: 20px;
  }
`;
const ContainerBt = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const Details = (props) => {
  let offsets = {};
  const [offset, setOffset] = useState(null);

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
  const _handleTailoredRedirect = (e) => {
    router.push('/tailored-travel');
  };

  return (
    <div id="Brief">
      {/* <YellowNavbar   price={props.data.payment_info[0].total_cost}></YellowNavbar> */}
      {/* <PageNavigation price={props.data.payment_info[0].total_cost} /> */}
      {/* <HeaderExtraPadding></HeaderExtraPadding> */}
      <DetailsContainer>
        <RouteComponent>
          <div id="route">
            <Route breif={props.breif}></Route>
          </div>
        </RouteComponent>
        {/* <div>
          <div >
            
              {true ? <Overview breif={props.breif}></Overview> : null}
            
          </div>
        </div> */}
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
