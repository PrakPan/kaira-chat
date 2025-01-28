import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import SwiperGallery from "../Swiper/SwiperGallery";

const Cross = styled.p`
  color: white;
  text-align: right;
  margin: 0 1rem;
  font-size: 1.5rem;
  font-weight: 100;
`;

const FullScreenGallery = (props) => {
  return (
    <div className="fixed top-0 right-0 w-full md:w-[50%] h-[100vh] bg-black pt-[0.5rem]" style={{ zIndex: "2000" }}>
      <Cross>
        <FontAwesomeIcon
          icon={faTimes}
          onClick={props.closeGalleryHandler}
        ></FontAwesomeIcon>
      </Cross>

      <SwiperGallery images={props.images}></SwiperGallery>
    </div>
  );
};

export default React.memo(FullScreenGallery);
