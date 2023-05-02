import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarker,
  faStar,
  faImages,
  faWifi,
  faMale,
  faBaby,
  faChild,
} from '@fortawesome/free-solid-svg-icons';

import { makeStyles } from '@mui/styles';
import MuiAccordion from '@material-ui/core/Accordion';

import { withStyles } from '@mui/styles';
import ImageContainer from './imagecontainer/Index';
// import Button from '../../Button';
import Button from '../../ui/button/Index';
import FullScreenGallery from '../../fullscreengallery/Index';
import { getHumanDate } from '../../../services/getHumanDate';
import { BsCheckLg } from 'react-icons/bs';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiPlus } from 'react-icons/bi';
import media from '../../media';
import Spinner from '../../Spinner';
const Container = styled.div`
  width: 100%;
  min-height: 40vh;
  background-color: white;
  border-radius: 10px;
  @media screen and (min-width: 768px) {
    border-radius: 10px;
    position: relative;
    min-height: max-content;
  }
`;

const DetailsContainer = styled.div`
  color: black;
  display: grid;
  grid-template-columns: auto max-content;
  padding: 0 0.5rem;
`;
const DetailsLeftContainer = styled.div``;
const DetailsRightContainer = styled.div`
  text-align: right;
`;
const Rating = styled.div`
  text-align: right;
`;
const IconsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  color: black;
`;
const Icon = styled.img`
  width: 40%;
  height: auto;
  display: block;
  margin: 0.5rem auto;
`;
const PhotosButton = styled.div`
  &:hover {
    cursor: pointer;
  }
`;
const Heading = styled.p`
  font-weight: 400;

  margin: 0 0 0.5rem 0;
`;

const Detail = styled.p`
  font-size: 0.75rem;
  margin: 0 0 0.25rem 0;
  font-weight: 300;
`;
const ButtonContainer = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
`;
const RatingContainer = styled.div`
  position: absolute;
  top: 26vh;
  right: 1vh;
  width: max-content;
  padding: 0.25rem;
  background-color: green;
  color: white;
  font-size: 0.75rem;
  border-radius: 2px;
`;
const Selected = styled.div`
  border-radius: 2rem;
  border-width: 1px;
  padding: 0.25rem 1rem;
  background-color: #f7e700;
  @media screen and (min-width: 768px) {
    font-size: 0.75rem;
    &:hover {
      cursor: pointer;
    }
  }
`;
const Select = styled.div`
 border: 1px solid black;
 border-radius: 2rem;
 padding:0.25rem 1rem;
 box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
 @media screen and (min-width: 768px){
    font-size: 0.75rem;
     &:hover{
        cursor: pointer;
     }
 
 `;
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: '1rem',
    fontWeight: '600',
  },
}));

const Booking = (props) => {
  let isPageWide = media('(min-width: 768px)');

  const [images, setImages] = useState(null);
  const RANDOM_RATING = [8.8, 8.9, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8];

  const classes = useStyles();

  const detailsarr = [];
  for (var i = 0; i < props.details.length; i++) {
    if (props.details[i].length)
      detailsarr.push(
        <li
          className={props.blur ? 'blurry-text' : ''}
          style={{
            fontSize: '0.75rem',
            margin: '0.5rem 0 0.5rem 0rem',
            fontWeight: '300',
          }}
        >
          {props.details[i]}
        </li>
      );
  }

  let imagesarr = [];
  if (props.images)
    for (var i = 0; i < props.images.length; i++) {
      imagesarr.push(props.images[i].image);
    }
  let mealplan = '';
  if (props.price_type === 'EP') mealplan = 'Room Only';
  else if (props.price_type === 'CP') mealplan = 'Breakfast Included';
  else if (props.price_type === 'MAP')
    mealplan = 'Breakfast and Lunch / Dinner included';
  else if (props.price_type === 'AP')
    mealplan = 'Breakfast, Lunch and Dinner Included';

  let color = 'green';
  if (props.rating) {
    if (props.rating < 4 && props.rating > 3) color = 'orange';
    else if (props.rating < 3) color = 'red';
  }

  const getDate = (date) => {
    let year = date.substring(0, 4);
    let month = date.substring(5, 7);
    let day = date.substring(8, 10);
    return getHumanDate(day + '/' + month + '/' + year) + ' ' + year;
  };
  let roomsJSX = [];
  const [RoomsJSX, setRoomsJSX] = useState([]);
  useEffect(() => {
    if (props.type === 'Accommodation')
      for (var i = 0; i < props.rooms.length; i++) {
        if (props.rooms[i].number_of_rooms)
          roomsJSX.push(
            <Detail key={i} className="font-lexend">
              {props.rooms[i].room_type
                ? props.rooms[i].number_of_rooms +
                  ' x ' +
                  props.rooms[i].room_type
                : props.rooms[i].number_of_rooms + ' x Private Room'}
            </Detail>
          );
        else
          roomsJSX.push(
            <Detail key={i} className="font-lexend">
              {props.rooms[i].room_type
                ? props.rooms[i].room_type
                : 'Private Room'}
            </Detail>
          );
      }
    setRoomsJSX(roomsJSX);
  }, [props.rooms]);
  const _handleTaxiSelection = () => {
    props._selectTaxiHandler(
      null,
      props.booking_id,
      props.booking_name,
      props.booking_type,
      props.itinerary_id,
      props.tailored_id,
      props.itinerary_name,
      props.taxi_type,
      props.transfer_type,
      props.city_id,
      props.destination_city_id,
      props.duration,
      props.check_in
    );
  };
  if (isPageWide)
    return (
      <Container
        className="border-thin"
        style={{
          borderColor: props.is_selected ? '#f7e700' : '#e4e4e4',
          borderWidth: '2px',
        }}
      >
        <ImageContainer
          star_category={props.star_category}
          duration={props.duration}
          tag={props.tag}
          are_prices_hidden={props.are_prices_hidden}
          _setImagesHandler={props.setImagesHandler}
          check_in={props.check_in}
          check_out={props.check_out}
          city={props.city}
          price={props.price}
          type={props.type}
          setShowBookingModal={props.setShowBookingModal}
          heading={props.heading}
          details={props.details}
          blur={props.blur}
          images={props.images}
          setImagesHandler={props.setImagesHandler}
        ></ImageContainer>
        <div>
          {/* <Accordion> */}
          <div
            style={{ padding: '0.5rem 0.5rem 0.5rem 0.5rem', height: '100%' }}
          >
            {props.type === 'Accommodation' &&
            props.rating &&
            color !== 'red' ? (
              <RatingContainer
                style={{ backgroundColor: color, lineHeight: '1' }}
              >
                <FontAwesomeIcon
                  icon={faStar}
                  style={{
                    fontSize: '0.75rem',
                    margin: '0 0.25rem 0 0',
                    color: 'white',
                  }}
                />
                {props.rating
                  ? props.rating + ' / 5'
                  : RANDOM_RATING[Math.floor(Math.random() * 10)]}
              </RatingContainer>
            ) : null}
            <Heading className="font-lexend">Details</Heading>
            {props.type === 'Accommodation' ? (
              <div>
                {props.check_in && !props.experience ? (
                  <Detail className="font-lexend">
                    {'Check in: ' + getDate(props.check_in)}
                  </Detail>
                ) : null}
                {props.check_out && !props.experience ? (
                  <Detail className="font-lexend">
                    {'Check out: ' + getDate(props.check_out)}
                  </Detail>
                ) : null}
                {props.duration && props.experience ? (
                  <Detail className="font-lexend">
                    {props.duration + ' Night(s)'}
                  </Detail>
                ) : null}

                {RoomsJSX}
                {props.plan ? (
                  <div style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <FontAwesomeIcon
                      icon={faMale}
                      style={{ marginRight: '0.25rem' }}
                    ></FontAwesomeIcon>
                    <p
                      className="font-lexend"
                      style={{
                        marginRight: '1rem',
                        display: 'inline',
                        fontWeight: '100',
                      }}
                    >
                      {props.plan.number_of_adults}
                    </p>
                    <FontAwesomeIcon
                      icon={faChild}
                      style={{ marginRight: '0.25rem' }}
                    ></FontAwesomeIcon>
                    <p
                      className="font-lexend"
                      style={{
                        marginRight: '1rem',
                        display: 'inline',
                        fontWeight: '100',
                      }}
                    >
                      {props.plan.number_of_children}
                    </p>
                    <FontAwesomeIcon
                      icon={faBaby}
                      style={{ marginRight: '0.25rem' }}
                    ></FontAwesomeIcon>
                    <p
                      className="font-lexend"
                      style={{
                        marginRight: '1rem',
                        display: 'inline',
                        fontWeight: '100',
                      }}
                    >
                      {props.plan.number_of_infants}
                    </p>
                  </div>
                ) : null}
                <Detail className="font-lexend">{mealplan}</Detail>
                <FontAwesomeIcon
                  icon={faWifi}
                  style={{ fontSize: '0.75rem', fontWeight: '300' }}
                ></FontAwesomeIcon>
              </div>
            ) : detailsarr.length ? (
              <ul style={{ padding: '0', marginLeft: '0.5rem' }}>
                {detailsarr}
              </ul>
            ) : null}
            {/* {detailsarr} */}
            <br></br>
            <br></br>

            {!props.experience ? (
              <ButtonContainer>
                {props.is_selected ? (
                  <Selected className="font-lexend">
                    <BsCheckLg
                      style={{ fontSize: '0.75rem', marginRight: '0.25rem' }}
                    ></BsCheckLg>
                    Selected
                  </Selected>
                ) : (
                  <Select
                    className="font-lexend"
                    onClick={_handleTaxiSelection}
                  >
                    {props.cardUpdateLoading === props.booking_id ? (
                      <Spinner
                        display="inline"
                        size={12}
                        margin="0 0.25rem 0 0"
                      ></Spinner>
                    ) : (
                      <AiOutlinePlus
                        style={{ fontSize: '1rem', marginRight: '0.25rem' }}
                      ></AiOutlinePlus>
                    )}
                    {/* <BiPlus style={{fontSize: '1rem', marginRight: '0.25rem', marginTop: '-0.1rem'}}></BiPlus> */}
                    Select
                  </Select>
                )
                //  null
                }

                {/* <Button boxShadow onclick={props.setShowBookingModal} onclickparams={null} fontSizeDesktop="0.75rem" borderRadius="2rem" borderWidth='1px' padding="0.25rem 1rem" hoverBgColor="#f7e700" hoverBorderColor="#f7e700" hoverColor='black'>Change</Button> */}
                {!props.is_stock && props.type == 'Accommodation' ? (
                  <Button
                    boxShadow
                    onclick={props.setShowBookingModal}
                    onclickparams={null}
                    fontSizeDesktop="0.75rem"
                    borderRadius="2rem"
                    borderWidth="1px"
                    padding="0.25rem 1rem"
                    hoverBgColor="black"
                    hoverBorderColor="black"
                    hoverColor="white"
                  >
                    Change
                  </Button>
                ) : null}
              </ButtonContainer>
            ) : null}
          </div>
          {/* </Accordion> */}
        </div>
        {/* <ButtonContainer>
                <Button>Change</Button>
            </ButtonContainer> */}
        {/* {props.showBookingModal ? <BookingModal replacing={props.heading} setShowBookingModal={props.setShowBookingModal} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal}></BookingModal> : null} */}
      </Container>
    );
  else
    return (
      <Container
        className="border-thin"
        style={{
          borderColor: props.is_selected ? '#f7e700' : '#e4e4e4',
          borderWidth: '2px',
        }}
      >
        <ImageContainer
          duration={props.duration}
          tag={props.tag}
          are_prices_hidden={props.are_prices_hidden}
          _setImagesHandler={props.setImagesHandler}
          check_in={props.check_in}
          check_out={props.check_out}
          city={props.city}
          price={props.price}
          type={props.type}
          setShowBookingModal={props.setShowBookingModal}
          heading={props.heading}
          details={props.details}
          blur={props.blur}
          images={props.images}
          setImagesHandler={props.setImagesHandler}
        ></ImageContainer>

        <div style={{ padding: '0.5rem 0.5rem 3rem 0.5rem' }}>
          {props.type === 'Accommodation' && props.rating && color !== 'red' ? (
            <RatingContainer style={{ backgroundColor: color }}>
              <FontAwesomeIcon
                icon={faStar}
                style={{
                  fontSize: '0.75rem',
                  margin: '0 0.25rem 0 0',
                  color: 'white',
                }}
              />

              {props.rating
                ? props.rating + ' / 5'
                : RANDOM_RATING[Math.floor(Math.random() * 10)]}
            </RatingContainer>
          ) : null}
          <Heading className="font-lexend">Details</Heading>
          {props.type === 'Accommodation' ? (
            <div>
              {props.check_in && !props.experience ? (
                <Detail className="font-lexend">
                  {'Check in: ' + getDate(props.check_in)}
                </Detail>
              ) : null}
              {props.check_out && !props.experience ? (
                <Detail className="font-lexend">
                  {'Check out: ' + getDate(props.check_out)}
                </Detail>
              ) : null}
              {props.experience && props.duration ? (
                <Detail className="font-lexend">{props.duration}</Detail>
              ) : null}
              {RoomsJSX}
              {props.plan ? (
                <div>
                  <FontAwesomeIcon
                    icon={faMale}
                    style={{ marginRight: '0.25rem' }}
                  ></FontAwesomeIcon>
                  <p
                    className="font-lexend"
                    style={{
                      marginRight: '1rem',
                      display: 'inline',
                      fontWeight: '100',
                    }}
                  >
                    {props.plan.number_of_adults}
                  </p>
                  <FontAwesomeIcon
                    icon={faChild}
                    style={{ marginRight: '0.25rem' }}
                  ></FontAwesomeIcon>
                  <p
                    className="font-lexend"
                    style={{
                      marginRight: '1rem',
                      display: 'inline',
                      fontWeight: '100',
                    }}
                  >
                    {props.plan.number_of_children}
                  </p>
                  <FontAwesomeIcon
                    icon={faBaby}
                    style={{ marginRight: '0.25rem' }}
                  ></FontAwesomeIcon>
                  <p
                    className="font-lexend"
                    style={{
                      marginRight: '1rem',
                      display: 'inline',
                      fontWeight: '100',
                    }}
                  >
                    {props.plan.number_of_infants}
                  </p>
                </div>
              ) : null}
              <Detail className="font-lexend">{mealplan}</Detail>
              <FontAwesomeIcon
                icon={faWifi}
                style={{ fontSize: '0.75rem', fontWeight: '300' }}
              ></FontAwesomeIcon>
            </div>
          ) : (
            <ul style={{ padding: '0', marginLeft: '0.5rem' }}>{detailsarr}</ul>
          )}
          {!props.experience ? (
            <ButtonContainer>
              {props.is_selected && !props.experience ? (
                <Selected className="font-lexend">
                  <BsCheckLg
                    style={{ fontSize: '0.75rem', marginRight: '0.25rem' }}
                  ></BsCheckLg>
                  Selected
                </Selected>
              ) : !props.experience ? (
                <Select className="font-lexend" onClick={_handleTaxiSelection}>
                  {props.cardUpdateLoading === props.booking_id ? (
                    <Spinner
                      display="inline"
                      size={12}
                      margin="0 0.25rem 0 0"
                    ></Spinner>
                  ) : (
                    <AiOutlinePlus
                      style={{ fontSize: '1rem', marginRight: '0.25rem' }}
                    ></AiOutlinePlus>
                  )}
                  {/* <BiPlus style={{fontSize: '1rem', marginRight: '0.25rem', marginTop: '-0.1rem'}}></BiPlus> */}
                  Select
                </Select>
              ) : null
              //  null
              }
              {!props.is_stock && props.type == 'Accommodation' ? (
                <Button
                  boxShadow
                  onclick={props.setShowBookingModal}
                  onclickparams={null}
                  hoverColor="black"
                  fontSizeMobile="0.75rem"
                  borderRadius="2rem"
                  borderWidth="1px"
                  padding="0.25rem 1rem"
                >
                  Change
                </Button>
              ) : null}
            </ButtonContainer>
          ) : null}
        </div>

        {/* {props.showBookingModal ? <BookingModal replacing={props.heading} setShowBookingModal={props.setShowBookingModal} showBookingModal={props.showBookingModal} setHideBookingModal={props.setHideBookingModal}></BookingModal> : null} */}
      </Container>
    );
  // }
  // else {
  //     return <FullScreenGallery closeGalleryHandler={closeGalleryHandler} images={images} ></FullScreenGallery>
  // }
};

export default Booking;
