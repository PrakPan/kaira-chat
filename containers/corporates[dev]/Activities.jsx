import { useState } from "react";
import ActivityCard from "../newcityplanner/activities/ActivityCard.js";
import SwiperCarousel from "../../components/SwiperCarousel";

const Activities = (props) => {
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
      setEnquiryOpen={props.setEnquiryOpen}
    ></ActivityCard>
  ));

  return (
    <div className="mx-2">
      <div className="hidden-mobile">
        <SwiperCarousel
          navigationButtons={true}
          slidesPerView={4}
          cards={cards}
          navButtonsTop={"50%"}
          spaceBetween={10}
        ></SwiperCarousel>
      </div>
      <div className="hidden-desktop">
        <SwiperCarousel slidesPerView={1} pageDots noPadding cards={cards} />
      </div>
    </div>
  );
};

export default Activities;
