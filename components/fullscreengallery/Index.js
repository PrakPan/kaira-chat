import React from "react";
import styled from "styled-components";
import SwiperGallery from "../Swiper/SwiperGallery";

const Cross = styled.p`
  color: white;
  text-align: right;
  margin: 0 1rem;
  font-size: 1.5rem;
  font-weight: 100;
`;

const svgIcons = {
  'close': <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M14.25 4.8075L13.1925 3.75L9 7.9425L4.8075 3.75L3.75 4.8075L7.9425 9L3.75 13.1925L4.8075 14.25L9 10.0575L13.1925 14.25L14.25 13.1925L10.0575 9L14.25 4.8075Z" fill="black" />
  </svg>
}

const FullScreenGallery = (props) => {
  return (
    <div
      className="fixed top-0 right-0 w-full h-[100vh] bg-trans-black_70 pt-[0.5rem] max-ph:bg-text-white"
      style={{ zIndex: "2000" }}
    >
      <div className="container mt-7xl cursor-pointer max-ph:!p-0">
        <span onClick={props.closeGalleryHandler} className="w-[30px] h-[30px] bg-text-white flex items-center justify-center rounded-circle absolute right-[20%]  max-ph:top-[25px] max-ph:right-[20px]">
          {svgIcons.close}
        </span>


        <SwiperGallery
          images={props.images}
          mercury={props.mercury}
          imgUrlEndPoint={props.imgUrlEndPoint}
        ></SwiperGallery>
      </div>
    </div>
  );
};

export default React.memo(FullScreenGallery);

