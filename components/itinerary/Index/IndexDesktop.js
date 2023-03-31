import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import CityContainer from '../CityContainer';
import theme from '../../../public/Themes';
import CityConnect from '../CityConnection';
import { Link, animateScroll as scroll } from 'react-scroll';
import media from '../../media';
import Timer from '../../../containers/itinerary/timer/Index';
import DesktopBanner from '../../containers/Banner';
import Banner from '../../../containers/homepage/banner/Mobile';
import { useRouter } from 'next/router';
import isinview from '../../isinview';
import { connect } from 'react-redux';

const Container = styled.div`
  @media screen and (min-width: 768px) {
    width: 80%;
    margin: auto;
    display: grid;
    grid-template-columns: 20% 80%;
    padding: 2rem 0;
  }
`;

const Itinerary = (props) => {
  let isPageWide = media('(min-width: 768px)');
  const router = useRouter();
  const [citySelected, setCitySelected] = useState(0);

  // const [showModal, setShowModal] = useState(false);

  // const [hideTimer, setHideTimer] = useState(false);

  // const _handleTimerClose = () => {
  //   window.scrollTo(0, window.innerHeight);
  //   setHideTimer(true);
  //   props._hideTimerHandler();
  // };
  // const showModalHandler = () => {
  //   setShowModal(true);
  // };
  // const hideModalHandler = () => {
  //   setShowModal(false);
  // };
  const _handleTailoredRedirect = (e) => {
    router.push('/tailored-travel');
  };

  // let links = [];
  // const StyledLink = styled(Link)`
  //   &:hover {
  //     cursor: pointer;
  //   }
  // `;
  let classnames = '';
  if (props.blur) classnames = 'blurry-text ';
  let LinksArr = [];
  let ContainerArr = [];
  if (props.city_slabs)
    for (var i = 0; i < props.city_slabs.length; i++) {
      const index = i;
      //Don't do anything if ending city
      if (props.city_slabs[i].is_trip_terminated) break;
      else {
        LinksArr.push(
          <Link
            to={props.city_slabs[i].city_name}
            smooth={true}
            duration={500}
            style={{
              display: 'block',
              padding: '0.5rem',
              margin: '0',
              color: 'white',
              textDecoration: 'none',
            }}
            onClick={() => setCitySelected(index)}
            className={`${
              citySelected === i
                ? classnames + 'city-active'
                : classnames + 'city-inactive'
            }`}
          >
            {props.city_slabs[i].city_name}
          </Link>
        );
        ContainerArr.push(
          <div>
            <div
              style={{ position: 'relative', top: '-66px' }}
              id={'city-scroller-' + i}
            ></div>
            <CityContainer
              is_registration_needed={props.is_registration_needed}
              selectedPoi={props.selectedPoi}
              is_auth={props.email === props.user_email ? true : false}
              setCitySelected={setCitySelected}
              id={'city-scroller-' + i}
              traveleritinerary={props.traveleritinerary}
              is_preview={props.is_preview}
              is_stock={props.is_stock}
              is_experience={props.is_experience}
              city_id={props.city_slabs[i].city_id}
              setShowPoiModal={props.setShowPoiModal}
              blur={props.blur}
              day_slabs={props.itinerary.day_slabs}
              city={props.city_slabs[i].city_name}
              startingslab={
                props.city_slabs[i].day_slab_location.start_day_slab_index
              }
              endingslab={
                props.city_slabs[i].day_slab_location.end_day_slab_index
              }
              startingindex={
                props.city_slabs[i].day_slab_location.start_element_index
              }
              endingindex={
                props.city_slabs[i].day_slab_location.end_element_index
              }
            ></CityContainer>
          </div>
        );
        if (i === props.city_slabs.length - 1) ContainerArr.push(null);
        else {
          //Don't show interconnection if next city is ending city
          if (props.city_slabs[i + 1].is_trip_terminated) break;
          else {
            //meta data present in newcity
            // if(props.itinerary.day_slabs[props.city_slabs[i+1].day_slab_location.start_day_slab_index].slab_elements[props.city_slabs[i+1].day_slab_location.start_element_index].meta)
            if (i) {
              if (
                props.itinerary.day_slabs[
                  props.city_slabs[i].day_slab_location.end_day_slab_index
                ].slab_elements[
                  props.city_slabs[i].day_slab_location.end_element_index
                ].meta
              ) {
                //distance present in meta data
                if (
                  props.itinerary.day_slabs[
                    props.city_slabs[i].day_slab_location.end_day_slab_index
                  ].slab_elements[
                    props.city_slabs[i].day_slab_location.end_element_index
                  ].meta.Distance
                ) {
                  ContainerArr.push(
                    <div id={props.city_slabs[i + 1].city_name}>
                      <CityConnect
                        blur={props.blur}
                        distance={
                          props.itinerary.day_slabs[
                            props.city_slabs[i].day_slab_location
                              .end_day_slab_index
                          ].slab_elements[
                            props.city_slabs[i].day_slab_location
                              .end_element_index
                          ].meta.Distance
                        }
                        time={
                          props.itinerary.day_slabs[
                            props.city_slabs[i].day_slab_location
                              .end_day_slab_index
                          ].slab_elements[
                            props.city_slabs[i].day_slab_location
                              .end_element_index
                          ].meta.Time
                        }
                      ></CityConnect>
                    </div>
                  );
                } else
                  ContainerArr.push(
                    <div id={props.city_slabs[i + 1].city_name}>
                      <CityConnect
                        blur={props.blur}
                        distance={
                          props.itinerary.day_slabs[
                            props.city_slabs[i].day_slab_location
                              .end_day_slab_index
                          ].slab_elements[
                            props.city_slabs[i].day_slab_location
                              .end_element_index
                          ].meta.Distance
                        }
                        time={
                          props.itinerary.day_slabs[
                            props.city_slabs[i].day_slab_location
                              .end_day_slab_index
                          ].slab_elements[
                            props.city_slabs[i].day_slab_location
                              .end_element_index
                          ].meta.Time
                        }
                      ></CityConnect>
                    </div>
                  );
              } else {
                ContainerArr.push(
                  <div id={props.city_slabs[i + 1].city_name}>
                    <CityConnect
                      blur={props.blur}
                      dsitance={null}
                    ></CityConnect>
                  </div>
                );
              }
            } else {
              if (props.itinerary.day_slabs[0].slab_elements[0].meta) {
                if (
                  props.itinerary.day_slabs[0].slab_elements[0].meta.Distance
                ) {
                  ContainerArr.push(
                    <div id={props.city_slabs[1].city_name}>
                      <CityConnect
                        blur={props.blur}
                        distance={
                          props.itinerary.day_slabs[0].slab_elements[0].meta
                            .Distance
                        }
                        time={
                          props.itinerary.day_slabs[0].slab_elements[0].meta
                            .Time
                        }
                      ></CityConnect>
                    </div>
                  );
                } else
                  ContainerArr.push(
                    <div id={props.city_slabs[1].city_name}>
                      <CityConnect
                        blur={props.blur}
                        distance={
                          props.itinerary.day_slabs[0].slab_elements[0].meta
                            .Distance
                        }
                        time={
                          props.itinerary.day_slabs[0].slab_elements[0].meta
                            .Time
                        }
                      ></CityConnect>
                    </div>
                  );
              } else
                ContainerArr.push(
                  <div id={props.city_slabs[0].city_name}>
                    <CityConnect
                      blur={props.blur}
                      dsitance={null}
                    ></CityConnect>
                  </div>
                );
            }
          }
        }
      }
    }

  if (isPageWide)
    return (
      <div id="Itinerary">
        {/*If timer not expired*/}
        {/* {props.showTimer? <Timer hours={props.hours} minutes={props.minutes} seconds={props.seconds} startingTimer={props.startingTimer} timeRequired={props.timeRequired} itineraryDate={props.itineraryDate} hideTimer={props.hideTimer} _handleTimerClose={_handleTimerClose} showTimer={props.showTimer} _hideTimerHandler={props._hideTimerHandler}></Timer> : null} */}

        <Container
          id="kochi-anchor"
          style={{
            marginTop: props.showTimer && !props.hideTimer ? '-50vh' : '0',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              position: 'sticky',
              top: '66px',
              height: 'max-content',
            }}
          >
            <div style={{ fontSize: theme.fontsizes.desktop.text.three }}>
              <div
                style={{ backgroundColor: '#F7e700', padding: '0.75rem' }}
                className={
                  props.blur ? 'font-opensans blurry-text' : 'font-opensans'
                }
              >
                <b>Locations Covered</b>
              </div>
              {LinksArr}
            </div>
          </div>
          <div>
            <div
              id={props.city_slabs ? props.city_slabs[0].city_name : ''}
            ></div>
            {ContainerArr}
          </div>
        </Container>
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
  else
    return (
      <div id="Itenary">
        {/*If timer not expired*/}
        {/* {props.showTimer? <Timer timeRequired={props.timeRequired} itineraryDate={props.itineraryDate} hideTimer={props.hideTimer} _handleTimerClose={_handleTimerClose} showTimer={props.showTimer} _hideTimerHandler={props._hideTimerHandler}></Timer> : null} */}

        <Container
          id="kochi-anchor"
          style={{
            marginTop: props.showTimer && !props.hideTimer ? '-50vh' : '0',
          }}
        >
          <div>
            <div
              id={props.city_slabs ? props.city_slabs[0].city_name : ''}
            ></div>
            {ContainerArr}
          </div>
        </Container>
      </div>
    );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
    email: state.auth.email,
  };
};
export default connect(mapStateToPros)(Itinerary);
