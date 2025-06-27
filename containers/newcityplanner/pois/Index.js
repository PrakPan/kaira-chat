import styled from "styled-components";
import PoiCard from "./PoiCard";
import { useState } from "react";
import validateTextSize from "../../../services/textSizeValidator";
import WeatherWidget from "../../../components/WeatherWidget/WeatherWidget";
import SwiperCarousel from "../../../components/SwiperCarousel";

const GridContainer = styled.div`
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 3fr;
    gap: 2.5rem;
  }
`;

const Items = styled.div`
  display: grid;
  gap: 22px;

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const TextBold = styled.p`
  line-height: 24px;
  font-weight: 600;
  margin: 0;
  color: rgb(1, 32, 43);
`;

const Button = styled.button`
  background: white;
  color: #01202b;
  border: 1.5px solid #01202b;
  font-size: 1rem;
  padding: 0.5rem 2rem;
  display: block;
  margin: 15px auto 0px auto;
  border-radius: 8px;
  &:hover {
    color: white;
    background: black;
  }
`;

const WeatherContainer = styled.div`
  border: 1px solid #eceaea;
  border-radius: 10px;
  padding: 25px;
  height: max-content;
  margin-bottom: 1.7rem;
`;

const Poi = (props) => {
  const [more, setMore] = useState(6);

  const drawerShowArr = props.pois?.map((e) => {
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

  const cards = props.pois?.map((e, i) => (
    <PoiCard
      key={e.id}
      data={e}
      showDrawer={showDrawer[i]}
      setShowDrawer={setShowDrawer}
      _handleOpen={_handleOpen}
      handleCloseDrawer={handleCloseDrawer}
      page={props?.page}
      city={props?.city}
      removeDelete={props?.removeDelete}
      removeChange={props?.removeChange}
    />
  ));

  return (
    <GridContainer>
      <div className="hidden-mobile">
        <Items>
          {props.pois
            .filter((e, i) => i < more)
            ?.map((e, i) => (
              <PoiCard
                key={e.id}
                data={e}
                showDrawer={showDrawer[i]}
                setShowDrawer={setShowDrawer}
                _handleOpen={_handleOpen}
                handleCloseDrawer={handleCloseDrawer}
                removeDelete={props?.removeDelete}
                removeChange={props?.removeChange}
              />
            ))}
        </Items>

        {/* <Button
          onClick={() => {
            more < props.pois.length
              ? setMore(more + 4)
              : props.data
              ? props.handlePlanButtonClick(`Places to visit in ${props.city}`)
              : console.log("");
          }}
        >
          {more < props.pois.length
            ? "View More"
            : validateTextSize(
                `Craft a trip to ${props.city} now!`,
                8,
                "Craft a trip now!"
              )}
        </Button> */}
      </div>

      <div className="hidden-desktop">
        <SwiperCarousel slidesPerView={1} pageDots noPadding cards={cards} />
      </div>

      <div>
        {props.thingsToDoPage && (
          <WeatherContainer elevation={props.elevation}>
            <WeatherWidget
              city={props.data.name}
              lat={props.data.lat}
              lon={props.data.long}
            />
            {props.data.elevation &&
              props.data.elevation.length &&
              props.data.elevation[0]?.elevation && (
                <div style={{ marginTop: "20px" }}>
                  <TextBold>Altitude</TextBold>
                  <p style={{ fontWeight: "300", marginBottom: "0" }}>
                    {Math.floor(props.data.elevation[0]?.elevation)} metres (
                    {Math.floor(props.data.elevation[0]?.elevation * 3.281)}{" "}
                    feet) above sea level
                  </p>
                </div>
              )}
          </WeatherContainer>
        )}
      </div>
    </GridContainer>
  );
};

export default Poi;
