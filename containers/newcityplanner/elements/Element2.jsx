import styled from "styled-components";
import ElementCard from "./ElementCard.js";
import { useState } from "react";
import validateTextSize from "../../../services/textSizeValidator";
import openTailoredModal from "../../../services/openTailoredModal";
import { useRouter } from "next/router";
import SwiperCarousel from "../../../components/SwiperCarousel";
import ElementCard2 from "./ElementCard2.jsx";

const Button = styled.button`
  background: white;
  color: #01202b;
  border: 1.5px solid #01202b;
  font-size: 1rem;
  padding: 0.5rem 2rem;
  display: block;
  margin: 80px auto 0px auto;
  border-radius: 8px;
  &:hover {
    color: white;
    background: black;
  }
`;

const Element2 = (props) => {
  const [openDrawerId, setOpenDrawerId] = useState(null);

  const _handleOpen = (index) => {
    setOpenDrawerId(index);
  };

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation();
    setOpenDrawerId(null);
  };

  const cards = props.elements?.map((element, i) => (
    <ElementCard2
      key={i}
      data={element}
      index={i}
      isOpen={openDrawerId === i}
      _handleOpen={_handleOpen}
      handleCloseDrawer={handleCloseDrawer}
      page={props?.page}
      city={props?.city}
    />
  ));

  return (
    <div className="">
      <div className="hidden-mobile">
        <SwiperCarousel
          navigationButtons={true}
          slidesPerView={3}
          cards={cards}
          navButtonsTop={"50%"}
          spaceBetween={10}
        />
      </div>

      <div className="hidden-desktop">
        <SwiperCarousel slidesPerView={1.3} pageDots noPadding cards={cards} />
      </div>
    </div>
  );
};

export default Element2;
