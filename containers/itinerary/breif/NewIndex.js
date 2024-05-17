import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import DesktopBanner from "../../../components/containers/Banner";
import Banner from "../../homepage/banner/Mobile";
import Route from "../../newitinerary/breif/route/Index";
import dynamic from "next/dynamic";
import Drawer from "../../../components/drawers/cityDetails/CityDetailsDrawer";
import SkeletonCard from "../../../components/ui/SkeletonCard";
import RouteEditSection from "../../newitinerary/breif/route/RouteEditSection.js";
const LeafMap = dynamic(() => import("../../../components/mapbox.js"), {
  ssr: false,
});

const DetailsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10;
  flex-direction: column-reverse;
  margin: 0 auto 2vh auto;
  padding: 0 0rem;
  @media screen and (min-width: 768px) {
    flex-direction: row-reverse;
    padding: 0;
    margin: auto auto auto auto;
  }
`;

const RouteComponent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 768px) {
    width: 30%;
  }
`;

const Details = (props) => {
  const [active, setActive] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDrawerData, setShowDrawerData] = useState(false);
  const [currentPopup, setCurrentPopup] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const router = useRouter();

  const _handleTailoredRedirect = (e) => {
    router.push("/tailored-travel");
  };

  const getdayId = (id) => {
    return props.itinerary?.day_slabs[id]?.slab_id;
  };

  const getdateId = (id) => {
    return props.itinerary?.day_slabs[id]?.slab;
  };

  const Locationlatlong = [];
  if (props.routesData.length >= 1) {
    for (var i = 0; i < props.routesData.length; i++) {
      var postion = props.breif.city_slabs[i + 1];
      if (
        props.routesData[i].duration &&
        props.routesData[i].duration !== "0"
      ) {
        Locationlatlong.push({
          dayId: getdayId(
            props.routesData[i].day_slab_location.start_day_slab_index
          ),
          cityData: postion,
          id: props.routesData[i].gmaps_place_id,
          city_id: props.routesData[i].city_id,
          lat: props.routesData[i].lat,
          long: props.routesData[i].long,
          name: props.routesData[i].city_name,
          duration: props.routesData[i].duration,
          color: props.routesData[i].color,
          date: getdateId(
            props.routesData[i].day_slab_location.start_day_slab_index
          ),
        });
      }
    }
  } else {
    if (props.CityData.length >= 1) {
      for (var i = 0; i < props.CityData.length; i++) {
        var postion = props.CityData[i];
        if (
          !postion.is_departure_only &&
          !postion.is_trip_terminated &&
          postion.duration &&
          postion.duration !== "0"
        ) {
          Locationlatlong.push({
            dayId: getdayId(postion.day_slab_location.start_day_slab_index),
            cityData: postion,
            id: postion.gmaps_place_id,
            city_id: postion.city_id,
            lat: postion.lat,
            long: postion.long,
            name: postion.city_name,
            duration: postion.duration,
            color: postion.color,
            date: getdateId(postion.day_slab_location.start_day_slab_index),
          });
        }
      }
    }
  }

  function findDayIdByCityId(cityId) {
    for (const item of Locationlatlong) {
      if (item.city_id === cityId) {
        return item.dayId;
      }
    }
    return null; // Return null if city_id is not found in the array
  }

  const MapWithNoSSR = ({
    currentPopup,
    setCurrentPopup,
    setShowDrawer,
    setShowDrawerData,
  }) => (
    <LeafMap
      locations={Locationlatlong}
      currentPopup={currentPopup}
      setCurrentPopup={setCurrentPopup}
      setShowDrawer={setShowDrawer}
      setShowDrawerData={setShowDrawerData}
      onload={() => setMapLoaded(true)}
    />
  );

  return (
    <div className="mt-16">
      <DetailsContainer>
        <div
          className="sticky md:top-[70px] lg:w-[50vw] lg:h-[70vh]  w-[88vw] h-[23rem] lg:mt-20 mt-8  rounded-xl"
          id="MapcontainerRoute"
        >
          <div
            className="absolute w-[100%] h-[100%] rounded-xl"
            style={{ overflow: "hidden" }}
          >
            {Locationlatlong.length >= 1 ? (
              <>
                <div style={{ display: mapLoaded ? "initial" : "none" }}>
                  <MapWithNoSSR
                    currentPopup={currentPopup}
                    setCurrentPopup={setCurrentPopup}
                    setShowDrawer={setShowDrawer}
                    setShowDrawerData={setShowDrawerData}
                  />
                </div>
                <div>
                  <SkeletonCard />
                </div>
              </>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        <RouteComponent>
          <div id="route">
            <Route
              itinerary_id={props?.itinerary?.tailor_made_id || props?.plan?.id}
              payment={props.payment}
              plan={props.plan}
              dayslab={props.itinerary?.day_slabs}
              breif={props.breif}
              routesData={props.routesData}
              transfers={props.transfersData}
              routes={props.routes}
              setPlaceID={setActive}
              active={active}
              setCurrentPopup={setCurrentPopup}
              setShowDrawer={setShowDrawer}
              setShowDrawerData={setShowDrawerData}
              fetchData={props.fetchData}
              getPaymentHandler={props.getPaymentHandler}
              setShowLoginModal={props.setShowLoginModal}
              _GetInTouch={props._GetInTouch}
              setEdit={props.setEditRoute}
            />
          </div>
        </RouteComponent>
      </DetailsContainer>

      {props.editRoute && (
        <RouteEditSection
          editRoute={props.editRoute}
          setEdit={props.setEditRoute}
          routes={props.routes}
          itinerary={props.itinerary}
          plan={props.plan}
          group_type={props.group_type}
          duration_time={props.duration_time}
          travellerType={props.travellerType}
          fetchData={props.fetchData}
          setShowLoginModal={props.setShowLoginModal}
        >
          <div
            className="sticky lg:w-full lg:h-[50vh] rounded-xl"
            id="MapcontainerRoute"
          >
            <div
              className="absolute w-[100%] h-[100%] rounded-xl"
              style={{ overflow: "hidden" }}
            >
              {Locationlatlong.length >= 1 ? (
                <>
                  <div style={{ display: mapLoaded ? "initial" : "none" }}>
                    <MapWithNoSSR
                      locations={Locationlatlong}
                      currentPopup={currentPopup}
                      setCurrentPopup={setCurrentPopup}
                      setShowDrawer={setShowDrawer}
                      setShowDrawerData={setShowDrawerData}
                    />
                  </div>
                  <div>
                    <SkeletonCard />
                  </div>
                </>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </RouteEditSection>
      )}

      <Drawer
        show={showDrawer}
        onHide={() => setShowDrawer(false)}
        city_id={showDrawerData.city_id}
        dayId={findDayIdByCityId(showDrawerData.city_id)}
      ></Drawer>

      {props.traveleritinerary ? (
        <DesktopBanner
          onclick={_handleTailoredRedirect}
          text="Want to personalize your own experience like this?"
        ></DesktopBanner>
      ) : null}
      {props.traveleritinerary ? (
        <div className="hidden-desktop">
          <Banner
            text="Want to craft your own travel experience like this?"
            buttontext="Start Now"
            color="black"
            buttonbgcolor="#f7e700"
          ></Banner>
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(Details);
