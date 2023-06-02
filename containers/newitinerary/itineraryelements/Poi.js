import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { AiFillCar } from 'react-icons/ai';
import ImageLoader from '../../../components/ImageLoader';
import Button from '../../../components/ui/button/Index';
import { ITINERARY_ELEMENT_TYPES } from '../../../services/constants';
import { HiPencil } from 'react-icons/hi';
import Rating from './Rating';
import Tips from './Tips';
import {
  HLine,
  newDayContainerTextpadding,
} from '../../itinerary/New_Itenary_DBD/New_itenaryStyled';
import StarRating from '../../../components/StarRating';
import { MdEdit } from 'react-icons/md';
import Drawer from '../../../components/ui/Drawer';
import { TbArrowBack } from 'react-icons/tb';
import POIDetailsDrawer from '../../../components/drawers/poiDetails/POIDetailsDrawer';
import axiosaxtivitiesinstance from '../../../services/poi/reccommendedactivities';
import axiositineraryeditinstance from '../../../services/itinerary/edit';
import POIDetailsSkeleton from '../../../components/drawers/poiDetails/POIDetailsSkeleton';
import PoiList from './PoiList';
import PoiListSkeleton from './PoiListSkeleton';
import LogInModal from '../../../components/modals/Login';

const padding = {
  initialLeft: '60px',
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;

  padding: 0px 0px 0px 0px;
  color: #01202b;
`;
export const TInfoContainer = styled.div`
  @media screen and (min-width: 768px) {
    display: flex;

    flex-direction: row;
    & > div {
      padding-left: ${padding.initialLeft};
      width: 100%;
    }
  }
`;

const SectionOneText = styled.span``;
const GridContainer = styled.div`
  display: grid;
  width: 100%;
  margin-top: 1rem;

  grid-column-gap: 0.5rem;
`;
const Text = styled.p`
  overflow: hidden;
  line-height: 1.5;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 14px;
`;
const Heading = styled.span`
  margin-bottom: 0rem;
  margin-right: 0.25rem;
  font-weight: 500;
  line-height: 1;
`;
const Line = styled.div`
  border-style: none none solid none;
  border-color: #e4e4e4;
  border-width: 1px;
`;
const BoldTags = styled.p`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 0.25rem;
`;

const ColorTags = styled.span`
  border-style: solid;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 1px;

  font-weight: 400;
  padding: 0.25rem 0.5rem;
`;
const ItineraryPoiElement = (props) => {
  const [show, setShow] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDrawerListData, setshowDrawerListData] = useState(false);
  const [showDrawerData, setShowDrawerData] = useState(false);
  const [fetchingPoi, setFetchingPoi] = useState(false);
  const [optionsJSX, setOptionsJSX] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShow(false);
  };

  function stringCompare(arr, str) {}
  function ErrorNotDef(elem) {
    return elem === undefined || elem === null || !elem;
  }
  const _updatePoiHandler = (poi) => {
    // setUpdateLoadingState(true);

    axiositineraryeditinstance
      .post(
        '/',
        {
          itinerary_id: props.itinerary_id,
          day_slab_index: props.day_slab_index,
          slab_element_index: props.slab_elements_index,

          element_data: {
            ...poi,
            element_index: props.data.element_index,
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
        props.setItinerary(res.data);
      })
      .catch((err) => {
        // setUpdateLoadingState(false);

        window.alert('There seems to be a problem, please try again!');
      });
  };
  const _handleLoginClose = () => {
    // props.getPaymentHandler();
    setShowLoginModal(false);
  };
  function Poi_activities(activity) {
    setFetchingPoi(true);
    if (props.city_id) setShowDrawer(true);
    axiosaxtivitiesinstance
      .post('/', {
        location: props?.city_id,
        duration: 10,
        element_type: `${activity?.id ? 'Activity' : 'POI'}`,
      })
      .then((res) => {
        if (res.data.length) {
          let options = [];

          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].heading !== props.heading)
              // if(res.data.results[i].name !== props.selectedBooking.name)
              options.push(
                <PoiList
                  key={i}
                  _updatePoiHandler={_updatePoiHandler}
                  selectedData={props.data}
                  setShowDrawer={setShowDrawer}
                  getPaymentHandler={props.getPaymentHandler}
                  // _openPoiModal={_openPoiModal}
                  data={res.data[i]}
                  loginModal={showLoginModal}
                  setLoginModal={setShowLoginModal}
                  token={props.token}
                  // tailored_id={props.tailored_id}
                  // updateLoadingState={updateLoadingState}
                  // itinerary_id={
                  //   props.selectedBooking
                  //     ? props.selectedBooking.itinerary_id
                  //     : ''
                  // }
                ></PoiList>
              );
          }
          setOptionsJSX(options);
        } else {
          setOptionsJSX([]);
        }
        setFetchingPoi(false);
      })
      .catch((err) => {});
  }
  return (
    <Container>
      {/* <div>{props.time}</div> */}
      <div className="group flex flex-row items-center pt-3">
        <div className="bg-white w-[6rem]" onClick={() => setShow(true)}>
          {props.image ? (
            <ImageLoader
              dimensions={{ width: 300, height: 300 }}
              dimensionsMobile={{ width: 300, height: 300 }}
              borderRadius="8px"
              hoverpointer
              onclick={() => console.log('')}
              width="8rem"
              leftalign
              widthmobile="6rem"
              url={props.image}
            ></ImageLoader>
          ) : (
            <div className="w-[6rem]"></div>
          )}
        </div>

        <div style={{ paddingLeft: newDayContainerTextpadding.initialLeft }}>
          <div className="w-full ">
            <div className="w-full">
              <div
                className="flex flex-row w-full  justify-start items-center"
                style={{ lineHeight: '1' }}
              >
                <div
                  className="text-xl font-normal cursor-pointer"
                  onClick={() => setShow(true)}
                >
                  {props.heading}
                </div>
                {props.city_id && (
                  <div
                    onClick={() => Poi_activities(props?.activity)}
                    className="cursor-pointer min-w-max text-lg w-4 h-4 pl-3 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90"
                  >
                    <MdEdit className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500" />
                  </div>
                )}
              </div>
              <div className="flex flex-row">
                <div
                  className="font-normal border-2 border-[#9F9F9F] rounded-md px-2 py-[1px] mt-1    block  bg-white text-[#9F9F9F]"
                  // onClick={() => setViewMore(!viewMore)}
                >
                  {true ? 'ATTRACTION' : 'View Less'}
                </div>
              </div>
              {props.rating && <StarRating initialRating={4}></StarRating>}

              {/* {props.poi !== undefined ? (
                props.poi.experience_filters ? (
                  <div className={`flex gap-2 flex-row`}>
                    {props.poi.experience_filters.map((element, index) =>
                      element.toString() != 'Hidden Gem' ? (
                        <div className="flex flex-row items-end">
                          {index != 0 && (
                            <span className="font-bold text-xl pr-1">.</span>
                          )}

                          <div
                            className="flex  items-center text-sm  font-bold"
                            key={index}
                          >
                            {' '}
                            {element.split(' ').length > 2
                              ? element.split(' ')[0]
                              : element}{' '}
                          </div>
                        </div>
                      ) : (
                        <div className="flex font-bold" key={index}>
                          <div
                            className="border-solid text-center flex justify-center items-center   border-2 text-sm font-bold rounded-md px-2 border-[#9C54F6]"
                            style={{ color: index % 2 ? '#9C54F6' : '#5363F5' }}
                          >
                            {element}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : null
              ) : null} */}
            </div>
          </div>

          <div className="pt-1 line-clamp-3 font-normal text-sm mb-3">
            {props.text}
          </div>
        </div>
      </div>

      <POIDetailsDrawer
        // show={props.showDrawer.isOpen}
        show={show}
        iconId={props?.poi?.id ? props?.poi?.id : props?.activity_data?.id}
        ActivityiconId={props?.activity?.id}
        // handleCloseDrawer={props.handleCloseDrawer}
        handleCloseDrawer={handleCloseDrawer}
        name={props.heading}
      />
      {showLoginModal && (
        <div>
          <LogInModal show={true} onhide={_handleLoginClose}></LogInModal>
        </div>
      )}
      <Drawer
        show={showDrawer}
        anchor={'right'}
        backdrop
        style={{ zIndex: 1501 }}
        className="font-lexend"
        onHide={() => setShowDrawer(false)}
        // zIndex='1501'
      >
        <div>
          <TbArrowBack
            onClick={() => setShowDrawer(false)}
            className="hover-pointer"
            style={{
              margin: '0.5rem',
              fontSize: '1.75rem',
              textAlign: 'right',
            }}
          ></TbArrowBack>
        </div>
        {!fetchingPoi ? (
          // <POIDetails data={data} handleCloseDrawer={props.handleCloseDrawer} />
          optionsJSX
        ) : (
          <PoiListSkeleton name={'Activity'} />
        )}
      </Drawer>
      {/* <div style={{display: 'flex', alignItems: 'center'}}>
                <SectionOneText>{props.time}</SectionOneText>
                <AiFillCar style={{margin: '-2px 0  0 0.5rem'}}></AiFillCar>
                {
                    props.booking ? 
                    <div style={{flexGrow: '1', justifyContent: 'flex-end', display: 'flex'}}>
                         
                        <Button
                        borderRadius="8px"
                        fontWeight="700"
                        fontSize="12px"
                        borderWidth="1.5px"
                        padding="0.5rem 0.5rem"
                        onclick={() => console.log('')}
                        >
                        View Booking
                        </Button>
                        </div>
                    : null
                }
            </div> */}
    </Container>
  );
};

export default ItineraryPoiElement;
