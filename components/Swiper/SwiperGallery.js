import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper';
import ImageLoader from '../ImageLoader';
const SwiperGallery = (props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  return (
    <div>
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {props.images.map((image, index) => (
          <SwiperSlide>
            <ImageLoader
              url={image}
              // dimensions={isPageWide ? {width: width_desktop, height: height_desktop} : {width: Math.round(width_mobile*1.5), height: Math.round(height_mobile*1.5)}}
              // width={isPageWide ? Math.round(window.innerHeight*0.6*imageLoaded) : width_mobile+"px"}
              //   maxheight="60vh"
              //   maxwidth={isPageWide ? '70vw' : '80vw'}
              fit="cover"
            />
            {/* <img src={image} /> */}
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={5}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {props.images.map((image, index) => (
          <SwiperSlide>
            <ImageLoader
              url={image}
              // dimensions={isPageWide ? {width: width_desktop, height: height_desktop} : {width: Math.round(width_mobile*1.5), height: Math.round(height_mobile*1.5)}}
              // width={isPageWide ? Math.round(window.innerHeight*0.6*imageLoaded) : width_mobile+"px"}
              //   maxheight="60vh"
              //   maxwidth={isPageWide ? '70vw' : '80vw'}
              fit="cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperGallery;
