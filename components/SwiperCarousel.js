import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'
import  { Pagination, Navigation } from "swiper";
import 'swiper/css'
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/swiper.min.css";
import styled from 'styled-components'


const SwiperContainer = styled.div`
  position: relative;
  ${props => props.pageDots && 'margin-bottom : 2rem' };
  @media screen and (max-width: 768px) {
    ${(props) => !props.noPadding && "margin-inline: 0.5rem;"}
  }
  .swiper,
  .swiper-wrapper {
    position: initial;
  }
  .swiper-button-prev {
    left: -20px;
  }
  .swiper-button-next {
    right: -20px;
  }
  .swiper-button-next,
  .swiper-button-prev {
    background: rgba(1, 32, 43, 0.7);
    border: none;
    color: white;
    border-radius: 100%;
    width: 40px;
    height: 40px;
    ${(props) => props.navButtonsTop && `top : ${props.navButtonsTop}`};
  }
  .swiper-button-next::after {
    font-size: 1rem;
    font-weight: 900;
    translate: 1px 0px;
  }
  .swiper-button-prev::after {
    font-size: 1rem;
    font-weight: 900;
    translate: -1px 0px;
  }
  .swiper-button-disabled {
    display: none;
  }
  .swiper-pagination {
    bottom: -25px !important;
  }
  .swiper-pagination-bullet-active {
    background: #f7e700;
    border: 1px solid;
  }
`;



const SwiperCarousel = (props) => {
     let cards=[];
    props.cards.map( (card,index) => {
      cards.push(
        <div key={index}><div>{card}</div></div>
      )
    });
  const handleNextClick = (swiper) => {
    const currentIndex = swiper.activeIndex -1;
    const slidesPerView = swiper.params.slidesPerView;
   const newIndex = currentIndex + slidesPerView; 
   swiper.slideTo(newIndex);
      };
        const handlePrevClick = (swiper) => {
          const currentIndex = swiper.activeIndex +1;
          const slidesPerView = swiper.params.slidesPerView;
          const newIndex = currentIndex - slidesPerView; 
          swiper.slideTo(newIndex);
        };
        return (
          <SwiperContainer
            pageDots={props.pageDots}
            style={props.style}
            navButtonsTop={props.navButtonsTop}
            noPadding={props.noPadding}
          >
            <Swiper
              onInit={(swiper) => {
                if (props.navigationButtons) {
                  swiper.params.navigation.nextEl.addEventListener(
                    "click",
                    () => handleNextClick(swiper)
                  );
                  swiper.params.navigation.prevEl.addEventListener(
                    "click",
                    () => handlePrevClick(swiper)
                  );
                }
              }}
              spaceBetween={12}
              centeredSlides={props.centeredSlides}
              initialSlide={props.initialSlide || 0}
              navigation={props.navigationButtons}
              pagination={props.pageDots ? { clickable: true } : false}
              slidesPerView={props.slidesPerView || 6}
              modules={[Navigation, Pagination]}
            >
              {cards.map((e) => (
                <SwiperSlide>{e}</SwiperSlide>
              ))}
            </Swiper>
          </SwiperContainer>
        );
   
  
}

export default SwiperCarousel;