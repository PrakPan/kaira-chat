import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import styled from "styled-components";
import LazyLoad from "react-lazyload";
import useChat from "../hook/UseChat";
import Flight from "./sub-components/Flight";
import Hotel from "./sub-components/Hotel";
import Activity from "./sub-components/Activity";
import Poi from "./sub-components/Poi";

const SwiperContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  margin-bottom:20px;
  ${(props) => props.pageDots && "margin-bottom : 2rem"};
  @media screen and (max-width: 768px) {
    ${(props) => !props.noPadding && "margin-inline: 0.5rem;"}
  }

  .swiper,
  .swiper-wrapper {
    position: initial;
    height: auto;
  }

  .swiper-button-next{
   right: 0px;
  }

  .swiper-button-prev  {
   left: 0px;
  }

  .swiper-button-next,
  .swiper-button-prev {
    background: #01202b;
    color: white;
    ${(props) =>
    props.navButtonBackground && `background : ${props.navButtonBackground}`};
    ${(props) => props.navButtonColor && `color : ${props.navButtonColor}`};
    border: none;
    border-radius: 100%;
    width: 40px;
    height: 40px;
    top: 90px;
  }

  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 0.7rem;
    font-weight: 900;

    @media screen and (min-width: 768px) {
      font-size: 1rem;
    }
  }

  .swiper-button-next::after {
    translate: 1px 0px;
  }

  .swiper-button-prev::after {
    translate: -1px 0px;
  }

  .swiper-button-disabled {
    display: none;
  }

  .swiper-pagination {
    top: 101% !important;
  }

  .swiper-pagination-bullet-active {
    background: #f7e700;
    border: 1px solid;
  }
`;


const SingleContainer = styled.div`
  padding: 18px;
  border-radius: 16px;
  border: 1px solid #ededed;
  width: 250px;
`;



const ClickableLink = styled.button`
font-weight: 500;
font-size: 14px;
color : #3A85FC;
border-bottom: 1px solid #3A85FC;
cursor : ${(props) => props.isDisabled ? "not-allowed !important" : "pointer"};
filter : ${(props) => props.isDisabled ? "grayscale(1)" : ""};
`

const Title = styled.p`
font-weight: 600 !important;
font-size: 20px !important;
margin-bottom: 10px !important;
`


const ProductSlider = (props) => {

  const { sendMessage, lastProductSliderPosition } = useChat();

  const titleTypeWise = {
    "activity_search": "Activities",
    "hotel_search": "Hotels",
    "flights_search": "Flights",
    "poi_search": "Suggested Places"
  }

  const handleSubmitQuery = (query) => {
    const userMsg = { is_bot: false, message: `View Details of ${query}` };
    sendMessage(userMsg);
  }

  return (
    <>
      <Title> {titleTypeWise[props.type]}
      </Title>
      <SwiperContainer
        pageDots={props.pageDots}
        style={props.style}
        navButtonsTop={props.navButtonsTop}
        navButtonBackground={props.navButtonBackground}
        navButtonColor={props.navButtonColor}
        noPadding={props.noPadding}
        buttonSize={props.buttonSize}
      >
        <Swiper
          slidesPerView="auto"
          spaceBetween={15}
          freeMode={true}
          centeredSlides={props.centeredSlides}
          initialSlide={props.initialSlide || 0}
          navigation={props.navigationButtons}
          pagination={props.pageDots ? { clickable: true } : false}
          modules={[Navigation, Pagination, FreeMode]}
          lazy="true"
        >
          {props?.data.map((item, index) => (
            <SwiperSlide key={`${index}-${lastProductSliderPosition}`} style={{ width: "250px" }}>
              <LazyLoad>
                <SingleContainer key={`${index}-${lastProductSliderPosition}`}>
                  {props.type === 'flights_search' && <Flight item={item} />}
                  {props.type === 'hotel_search' && <Hotel item={item} />}
                  {props.type === 'activity_search' && <Activity item={item} />}
                  {props.type === 'poi_search' && <Poi item={item} />}
                  <ClickableLink data-position={props.position} data-last-position={lastProductSliderPosition} isDisabled={props.isDisabled} disabled={props.isDisabled} onClick={() => props.isDisabled ? null : handleSubmitQuery(item.name)}>View Details</ClickableLink>
                </SingleContainer>
              </LazyLoad>
            </SwiperSlide>
          ))}
        </Swiper>
      </SwiperContainer>
    </>
  );
};

export default ProductSlider;
