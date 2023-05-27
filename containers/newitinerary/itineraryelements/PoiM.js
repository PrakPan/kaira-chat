import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { AiFillCar } from 'react-icons/ai';
import ImageLoader from '../../../components/ImageLoader';
import Button from '../../../components/ui/button/Index';
import { ITINERARY_ELEMENT_TYPES } from '../../../services/constants';
import { HiPencil } from 'react-icons/hi';
import Rating from './Rating';
import Tips from './Tips';
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

const Container = styled.div`
  @media screen and (min-width: 768px) {
  }
`;

const SectionOneText = styled.span``;
const GridContainer = styled.div`
  display: grid;

  grid-template-columns: ${(props) => (props.image ? '1.6fr 2.5fr' : '1fr')};
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
  font-weight: 500;
`;
const Heading = styled.span`
  margin-bottom: 0rem;
  margin-right: 0.25rem;
  font-weight: 400;
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
const ItineraryPoiElementM = (props) => {
  const [show, setShow] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDrawerListData, setshowDrawerListData] = useState(false);
  const [showDrawerData, setShowDrawerData] = useState(false);
  const [fetchingPoi, setFetchingPoi] = useState(false);
  const [optionsJSX, setOptionsJSX] = useState([]);
  const [viewMore, setViewMore] = useState(false);
  useEffect(() => {}, []);
  function ErrorNotDef(elem) {
    return elem === undefined || elem === null || !elem;
  }

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShow(false);
  };

  function Poi_activities() {
    setFetchingPoi(true);
    if (props.city_id) setShowDrawer(true);
    axiosaxtivitiesinstance
      .post('/', {
        location: props.city_id,
        duration: 10,
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
                  // _updatePoiHandler={_updatePoiHandler}
                  // _openPoiModal={_openPoiModal}
                  data={res.data[i]}
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
    <Container className="font-lexend">
      {/* <div style={{ display: 'flex', alignItems: 'center' }}>
        <SectionOneText>{props.time}</SectionOneText>
        <AiFillCar
          className="text-xl"
          style={{ margin: '-2px 0  0 0.5rem' }}
        ></AiFillCar>
        {props.booking ? (
          <div
            style={{
              flexGrow: '1',
              justifyContent: 'flex-end',
              display: 'flex',
            }}
          >
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
        ) : null}
      </div> */}
      <GridContainer image={props.image}>
        {props.image ? (
          <ImageLoader
            dimensions={{ width: 250, height: 200 }}
            dimensionsMobile={{ width: 250, height: 200 }}
            borderRadius="8px"
            hoverpointer
            onclick={() => console.log('')}
            width="70%"
            leftalign
            widthmobile="100%"
            url={props.image}
          ></ImageLoader>
        ) : null}
        <div>
          <div className=" " style={{ lineHeight: '1' }}>
            <div className="flex flex-row text-[1.2rem]">
              {props.heading}{' '}
              <div
                onClick={() => Poi_activities(props.index)}
                className="cursor-pointer min-w-max text-lg w-4 h-4 pl-3 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90"
              >
                <MdEdit className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500" />
              </div>
              {/* <HiPencil className="text-lg min-w-max"></HiPencil> */}
            </div>
          </div>

          {props?.rating && <StarRating initialRating={4}></StarRating>}
          <div className="flex flex-row">
            <div
              className="font-normal border-2 lg:text-base text-sm border-[#9F9F9F] rounded-md px-1 py-[2px] mt-2    block  bg-white text-[#9F9F9F]"
              // onClick={() => setViewMore(!viewMore)}
            >
              {true ? 'ATTRACTION' : 'View Less'}
            </div>
          </div>

          {props.poi ? <div></div> : null}
          {/* <Rating margin="0.25rem 0"></Rating> */}

          {/* {props.poi !== undefined ? (
          //   props.poi.experience_filters ? (
          //     <div
          //       className={`grid grid-flow-col grid-rows-${Math.ceil(
          //         props.poi.experience_filters.length / 2
          //       )} gap-0`}
          //     >
          //       {props.poi.experience_filters.map((element, index) =>
          //         element.toString() != 'Hidden Gem' ? (
          //           <div className="flex flex-row items-end min-w-max">
          //             <span className="font-bold text-xl pr-1">.</span>

          //             <div
          //               className="flex  items-center text-sm  font-bold"
          //               key={index}
          //             >
          //               {' '}
          //               {element.split(' ').length > 2
          //                 ? element.split(' ')[0]
          //                 : element}{' '}
          //             </div>
          //           </div>
          //         ) : (
          //           <div className="flex font-bold" key={index}>
          //             <div
          //               className="border-solid border-2 text-sm font-bold rounded-md px-2 border-[#9C54F6]"
          //               style={{ color: index % 2 ? '#9C54F6' : '#5363F5' }}
          //             >
          //               {element}
          //             </div>
          //           </div>
          //         )
          //       )}
          //     </div>
          //   ) : null
          // ) : null} */}
        </div>
      </GridContainer>
      <div
        className={`pt-2 text-md font-[350] ${
          viewMore ? 'line-clamp-0' : 'line-clamp-3'
        }`}
      >
        {props.text}
      </div>
      <span onClick={() => setViewMore(!viewMore)} className="font-semibold">
        {viewMore ? 'Less' : 'More'}
      </span>
      {props.poi.id && (
        <POIDetailsDrawer
          // show={props.showDrawer.isOpen}
          show={show}
          iconId={props.poi.id}
          // handleCloseDrawer={props.handleCloseDrawer}
          handleCloseDrawer={handleCloseDrawer}
          name={props.heading}
        />
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

      {/* {!ErrorNotDef(props.poi) ? (
        !ErrorNotDef(props.poi.tips) ? (
          <Tips tips={props.poi.tips}></Tips>
        ) : null
      ) : null} */}
    </Container>
  );
};

export default ItineraryPoiElementM;
