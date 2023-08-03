import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';
import media from '../../media';
import LeftSideBar from './leftsidebar/Index';
import Poi from './poi/Index';

import Spinner from '../../Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import CurrentlyReplacing from './leftsidebar/CurrentlyReplacing';
import { connect } from 'react-redux';
import PoiDetails from './poidetails/Index';
import axiosaxtivitiesinstance from '../../../services/poi/reccommendedactivities';
import axiositineraryeditinstance from '../../../services/itinerary/edit';
import { ITINERARY_ELEMENT_TYPES } from '../../../services/constants';
import { openNotification } from '../../../store/actions/notification';
const GridContainer = styled.div`
@media screen and (min-width: 768px) {

    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-gap: 1rem;
    @media screen and (min-width: 768px) {
    
    }
`;

const OptionsContainer = styled.div`
    min-height; 40vh;
    overflow-x: hidden;
    width: 100%;
    position: relative;
    max-height: 65vh;

    @media screen and (min-width: 768px) {
        max-height: 80vh;

    }
`;
const ContentContainer = styled.div`
  min-height: 65vh;
  @media screen and (min-width: 768px) {
    min-height: max-content;
  }
`;
const PoiDetailsContainer = styled.div`
  border-radius: 5px;
  max-height: 80vh;
  overflow-y: scroll;
`;
const BackToResults = styled.div`
  &:hover {
    cursor: pointer;
  }
  @media screen and (min-width: 768px) {
    line-height: ;

    width: max-content;
  }
`;
const HeightContainer = styled.div`
  min-height: 65vh;
  @media screen and (min-width: 768px) {
    min-height: 80vh;
  }
`;

const Booking = (props) => {
  let isPageWide = media('(min-width: 768px)');

  const [optionsJSX, setOptionsJSX] = useState([]);
  const [loading, setLoading] = useState(true);

  const [updatePoiState, setUpdatePoiState] = useState(false);
  const [updateLoadingState, setUpdateLoadingState] = useState(true);

  const [noResults, setNoResults] = useState(false);

  const [showPoiDetails, setShowPoiDetails] = useState(false);

  const [poiDetails, setPoiDetails] = useState({});

  const EXPERIENCE_FILTERS = [
    'Isolated',
    'Romantic',
    'Heritage',
    'Spiritual',
    'Art and Culture',
    'Shopping',
    'Adventure and Outdoors',
    'Nature and Retreat',
    'Nightlife and Events',
    'Science and Knowledge',
  ];

  useEffect(() => {
    setOptionsJSX([]);
    setLoading(true);
    setNoResults(false);
    if (props.selectedPoi.city_id)
      axiosaxtivitiesinstance
        .post('/', {
          location: props.selectedPoi.city_id,
          duration: 10,
        })
        .then((res) => {
          setUpdateLoadingState(false);
          if (res.data.length) {
            setNoResults(false);
            let options = [];

            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].heading !== props.selectedPoi.name)
                // if(res.data.results[i].name !== props.selectedBooking.name)
                options.push(
                  <Poi
                    _updatePoiHandler={_updatePoiHandler}
                    _openPoiModal={_openPoiModal}
                    data={res.data[i]}
                    tailored_id={props.tailored_id}
                    updateLoadingState={updateLoadingState}
                    itinerary_id={
                      props.selectedBooking
                        ? props.selectedBooking.itinerary_id
                        : ''
                    }
                  ></Poi>
                );
            }
            setOptionsJSX(options);
          } else {
            setNoResults(true);

            setOptionsJSX([]);
          }
          setLoading(false);
        })
        .catch((err) => {});
  }, [props.selectedPoi]);

  const _updatePoiHandler = (poi) => {
    // setUpdateLoadingState(true);

    setUpdatePoiState(true);
    axiositineraryeditinstance
      .post(
        '/',
        {
          itinerary_id: props.itinerary_id,
          day_slab_index: props.selectedPoi.day_slab_index,
          slab_element_index: props.selectedPoi.slab_element_index,

          element_data: {
            ...poi,
            element_index: props.selectedPoi.element_index,
            keys: ['icon', 'heading', 'text', 'activity_data', 'meta'],
            element_type: ITINERARY_ELEMENT_TYPES.activity,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      .then((res) => {
        setUpdatePoiState(false);
        props.setItinerary(res.data);
        props.setHidePoiModal();
      })
      .catch((err) => {
        // setUpdateLoadingState(false);
        setUpdatePoiState(false);
        // window.alert('There seems to be a problem, please try again!');
         props.openNotification({
           type: "error",
           text: "There seems to be a problem, please try again!",
           heading: "Error!",
         });
      });
  };

  const _openPoiModal = (poi) => {
    setPoiDetails(poi);
    setShowPoiDetails(true);
  };

  return (
    <div>
      <Modal
        id="bookingedit-modal"
        show={props.showPoiModal}
        size="xl"
        onHide={props.setHidePoiModal}
        style={{ padding: '0' }}
      >
        {/* <Modal.Header>2</Modal.Header> */}
        <Modal.Body
          style={{
            padding: '0rem 0',
            borderStyle: 'solid',
            borderColor: '#F7e700',
            borderWidth: '0.5rem',
            borderRadius: '16px',
            backgroundColor: 'white',
          }}
        >
          <div style={{ padding: '0.25rem' }}>
            {!isPageWide ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {showPoiDetails ? (
                  <FontAwesomeIcon
                    className="hover-pointer"
                    icon={faChevronLeft}
                    onClick={() => setShowPoiDetails(false)}
                    style={{ margin: '0.5rem', position: 'sticky', top: '0' }}
                  ></FontAwesomeIcon>
                ) : (
                  <FontAwesomeIcon
                    className="hover-pointer"
                    icon={faChevronLeft}
                    onClick={props.setHidePoiModal}
                    style={{ margin: '0.5rem', position: 'sticky', top: '0' }}
                  ></FontAwesomeIcon>
                )}
                {showPoiDetails ? (
                  <div
                    onClick={() => setShowPoiDetails(false)}
                    className="font-lexend"
                  >
                    Back to results
                  </div>
                ) : null}
              </div>
            ) : (
              <FontAwesomeIcon
                className="hover-pointer"
                icon={faChevronLeft}
                onClick={props.setHidePoiModal}
                style={{ margin: '0.5rem', position: 'sticky', top: '0' }}
              ></FontAwesomeIcon>
            )}
            <GridContainer style={{ clear: 'right' }}>
              <LeftSideBar
                selectedPoi={props.selectedPoi}
                replacing={props.selectedPoi ? props.selectedPoi.name : ''}
                setHideBookingModal={props.setHidePoiModal}
              ></LeftSideBar>
              {/* {!isPageWide && !showPoiDetails ? <MobileFilters></MobileFilters> : null} */}
              <div style={{ display: showPoiDetails ? 'none' : 'block' }}>
                <ContentContainer style={{ position: 'relative' }}>
                  {loading ? (
                    <HeightContainer className="center-div">
                      <div
                        className="center-div"
                        style={{ width: 'max-content', margin: 'auto' }}
                      >
                        <Spinner></Spinner>Fetching activity recommendations for
                        you
                      </div>
                    </HeightContainer>
                  ) : null}
                  {updatePoiState ? (
                    <div
                      style={{
                        width: 'max-content',
                        margin: 'auto',
                        height: isPageWide ? '80vh' : '40vh',
                      }}
                      className="text-center font-lexend center-div"
                    >
                      <Spinner></Spinner>Please wait while we update your plan
                    </div>
                  ) : null}
                  {!noResults && !loading && !updatePoiState ? (
                    <OptionsContainer id="options">
                      <div style={{ clear: 'right' }}>
                        {optionsJSX.length ? optionsJSX : null}
                      </div>
                    </OptionsContainer>
                  ) : null}
                  {noResults ? (
                    <p className="font-lexend text-center">
                      Oops, we couldn't find what you were searching but we are
                      already adding new activities to our database everyday!
                    </p>
                  ) : null}
                </ContentContainer>
              </div>
              {showPoiDetails ? (
                <PoiDetailsContainer
                  style={{ display: showPoiDetails ? 'block' : 'none' }}
                >
                  {isPageWide ? (
                    <BackToResults
                      onClick={() => setShowPoiDetails(false)}
                      className="font-lexend"
                    >
                      <FontAwesomeIcon
                        style={{ marginRight: '0.5rem' }}
                        icon={faChevronLeft}
                      ></FontAwesomeIcon>
                      Back to results
                    </BackToResults>
                  ) : null}
                  <PoiDetails data={poiDetails}></PoiDetails>
                </PoiDetailsContainer>
              ) : null}
            </GridContainer>
            {!isPageWide ? (
              <CurrentlyReplacing
                selectedPoi={props.selectedPoi}
                replacing={props.selectedPoi ? props.selectedPoi.name : ''}
              ></CurrentlyReplacing>
            ) : null}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    name: state.auth.name,
    emailFail: state.auth.emailFail,
    token: state.auth.token,
    phone: state.auth.phone,
    email: state.auth.email,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
    emailfailmessage: state.auth.emailfailmessage,
    loginmessage: state.auth.loginmessage,
    hideloginclose: state.auth.hideloginclose,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(Booking);
