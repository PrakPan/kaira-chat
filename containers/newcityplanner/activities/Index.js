import styled from "styled-components";
import ActivityCard from "./ActivityCard.js";
import { useState } from "react";
import validateTextSize from "../../../services/textSizeValidator";
import openTailoredModal from "../../../services/openTailoredModal";
import { useRouter } from "next/router";
import SwiperCarousel from "../../../components/SwiperCarousel";

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

const Activity = (props) => {
  const router = useRouter();
  const drawerShowArr = props.activities?.map((e) => {
    return { ...e, isOpen: false };
  });
  const [showDrawer, setShowDrawer] = useState(drawerShowArr);

  const _handleOpen = (id) => {
    setShowDrawer(
      drawerShowArr.map((e) => {
        if (e.id == id) return { ...e, isOpen: true };
        return e;
      })
    );
  };

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation();
    setShowDrawer(drawerShowArr);
  };

  const cards = props.activities?.map((activity, i) => (
    <ActivityCard
      key={activity.id}
      data={activity}
      showDrawer={showDrawer[i]}
      setShowDrawer={setShowDrawer}
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
          slidesPerView={5}
          cards={cards}
          navButtonsTop={"50%"}
          spaceBetween={10}
        ></SwiperCarousel>

        <Button
          onClick={() => {
            props?.data
              ? props.handlePlanButtonClick(
                  `Things to do in ${props.data.name}`
                )
              : null;
          }}
        >
          {validateTextSize(
            `Craft a trip to ${props.city} now!`,
            8,
            "Craft a trip now!"
          )}
        </Button>
      </div>

      <div className="hidden-desktop">
        <SwiperCarousel slidesPerView={1} pageDots noPadding cards={cards} />
        <Button
          onClick={() => {
            props?.data
              ? openTailoredModal(router, props.data.id, props.data.name)
              : null;
          }}
        >
          {validateTextSize(
            `Craft a trip to ${props.city} now!`,
            8,
            "Craft a trip now!"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Activity;
