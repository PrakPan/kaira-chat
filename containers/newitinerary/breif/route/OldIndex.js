import styled from "styled-components";
import React, { useState } from "react";
import PinSection from "./PinSection";
import MidSection from "./MidSection";
import { ITINERARY_VERSION } from "../../../../services/constants";
import { connect } from "react-redux";
import { logEvent } from "../../../../services/ga/Index";

const Container = styled.div`
  @media screen and (min-width: 768px) {
    width: 30vw;
  }
  margin-bottom: 1.5rem;
`;

const Route = (props) => {
  const initialorder = {
    0: {
      location: "Jodhpur",
      duration: "1 Night",
    },
    1: {
      location: "Jaisalmer",
      duration: "2 Nights",
    },
    2: {
      location: "Jodhpur",
      duration: "1 Night",
    },
  };

  let locationsArr = [];
  const [order, setOrder] = useState(initialorder);

  const _moveDownHandler = (index) => {
    if (index === 3) {
    } else
      setOrder({
        ...order,
        [index]: order[index + 1],
        [index + 1]: order[index],
      });
  };

  function scrollToTargetAdjusted() {
    const element = document.getElementById("MapcontainerRoute");
    const headerOffset = 117;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  function handlemap(MapId) {
    props.setPlaceID(MapId);
    scrollToTargetAdjusted();
  }

  const _moveUpHandler = (index) => {
    if (index === 1) {
      // First item, disable button
    } else {
      setOrder({
        ...order,
        [index]: order[index - 1],
        [index - 1]: order[index],
      });
    }
  };

  const handleEditRoute = () => {
    props.setEdit(true);

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Edit Route",
        event_action: "Edit Route",
      },
    });
  };

  let startingcity = null;
  let endingcity = null;
  if (props?.plan?.version == ITINERARY_VERSION.version_2) {
    if (props?.routes) {
      for (var i = 0; i < props.routes.length; i += 2) {
        locationsArr.push(
          <PinSection
            version={"v1"}
            startingCity={i === 0}
            endingCity={i === props.routes.length - 1}
            setCurrentPopup={props.setCurrentPopup}
            handlemap={handlemap}
            setShowDrawer={props.setShowDrawer}
            setShowDrawerData={props.setShowDrawerData}
            cityData={props.routes[i]}
            dayslab={props.dayslab}
            lat={props.routes[i].lat}
            long={props.routes[i].long}
            Mapid={props.routes[i].gmaps_place_id}
            city={props.routes[i].city_name}
            cityId={props.routes[i].city_id}
            duration={props.routes[i].duration}
            pinColour={props.routes[i].color}
            data={order[i]}
            _moveDownHandler={_moveDownHandler}
            _moveUpHandler={_moveUpHandler}
            index={i}
          ></PinSection>
        );

        if (i < props.routes.length - 1) {
          locationsArr.push(
            <MidSection
              itinerary_id={props?.itinerary_id}
              pinColour={props.routes[i].color}
              modes={props.routes[i + 1]?.modes}
              route={props.routes[i + 1]}
              icon={null}
              version={"v2"}
              bookings={props.routes[i + 1]?.bookings}
              routesData={props.routesData}
              duration={props.routes[i + 1]?.meta?.Time}
              payment={props.payment}
              plan={props.plan}
              originCity={props.routes[i].city_name}
              destinationCity={props.routes[i + 2]?.city_name}
              fetchData={props.fetchData}
              getPaymentHandler={props.getPaymentHandler}
              setShowLoginModal={props.setShowLoginModal}
              _GetInTouch={props._GetInTouch}
            ></MidSection>
          );
        }
      }
    } else {
      if (props.breif)
        if (props.breif.city_slabs) {
          for (var i = 1; i < props.breif.city_slabs.length; i++) {
            if (props.breif.city_slabs[i].is_departure_only)
              startingcity = props.breif.city_slabs[0].city_name;
            if (props.breif.city_slabs[i].is_trip_terminated)
              endingcity = props.breif.city_slabs[i].city_name;
            // If duration present and not 0, not trip terminated or departure only city show in route
            if (
              !props.breif.city_slabs[i].is_trip_terminated &&
              !props.breif.city_slabs[i].is_departure_only &&
              !props.breif.city_slabs[i].is_departure_only &&
              props.breif.city_slabs[i].duration &&
              props.breif.city_slabs[i].duration !== "0"
            ) {
              locationsArr.push(
                <PinSection
                  version={"v1"}
                  setCurrentPopup={props.setCurrentPopup}
                  handlemap={handlemap}
                  dayId={
                    props.breif.city_slabs[i].day_slab_location
                      .start_day_slab_index
                  }
                  setShowDrawer={props.setShowDrawer}
                  setShowDrawerData={props.setShowDrawerData}
                  cityData={props.breif.city_slabs[i]}
                  dayslab={props.dayslab}
                  lat={props.breif.city_slabs[i].lat}
                  long={props.breif.city_slabs[i].long}
                  Mapid={props.breif.city_slabs[i].gmaps_place_id}
                  city={props.breif.city_slabs[i].city_name}
                  cityId={props.breif.city_slabs[i].city_id}
                  duration={
                    props.breif.city_slabs[i].duration
                      ? props.breif.city_slabs[i].duration
                      : null
                  }
                  pinColour={props.breif.city_slabs[i].color}
                  data={order[i]}
                  _moveDownHandler={_moveDownHandler}
                  _moveUpHandler={_moveUpHandler}
                  index={i}
                ></PinSection>
              );
              locationsArr.push(
                <MidSection
                  pinColour={props.breif.city_slabs[i].color}
                  modes={
                    props?.transfers[i + 1]?.modes
                      ? props?.transfers[i + 1]?.modes[0]
                      : "Taxi"
                  }
                  hidemidsection={true}
                  icon={null}
                  routesData={props.routesData}
                  version={"v1"}
                  transportMode={props.breif.city_slabs[i].intracity_transport}
                  duration={props.breif.city_slabs[i].duration}
                  _GetInTouch={props._GetInTouch}
                ></MidSection>
              );
            }
          }
          if (!startingcity) startingcity = props.breif.city_slabs[0].city_name;
          if (!endingcity)
            endingcity =
              props.breif.city_slabs[props.breif.city_slabs.length - 1]
                .city_name;
        }
    }
  } else {
    if (props.breif)
      if (props.breif.city_slabs) {
        for (var i = 0; i < props.breif.city_slabs.length; i++) {
          locationsArr.push(
            <PinSection
              version={"v1"}
              startingCity={i === 0}
              endingCity={i === props.breif.city_slabs.length - 1}
              setCurrentPopup={props.setCurrentPopup}
              handlemap={handlemap}
              dayId={
                props.breif.city_slabs[i]?.day_slab_location?.start_day_slab_index
              }
              setShowDrawer={props.setShowDrawer}
              setShowDrawerData={props.setShowDrawerData}
              cityData={props.breif.city_slabs[i]}
              dayslab={props.dayslab}
              lat={props.breif.city_slabs[i].lat}
              long={props.breif.city_slabs[i].long}
              Mapid={props.breif.city_slabs[i].gmaps_place_id}
              city={props.breif.city_slabs[i].city_name}
              cityId={props.breif.city_slabs[i].city_id}
              duration={
                props.breif.city_slabs[i].duration
                  ? props.breif.city_slabs[i].duration
                  : null
              }
              pinColour={props.breif.city_slabs[i].color}
              data={order[i]}
              _moveDownHandler={_moveDownHandler}
              _moveUpHandler={_moveUpHandler}
              index={i}
            ></PinSection>
          );
          if (i < props.breif.city_slabs.length - 1) {
            locationsArr.push(
              <MidSection
                pinColour={props.breif.city_slabs[i].color}
                modes={
                  props?.transfers[i + 1]?.modes
                    ? props?.transfers[i + 1]?.modes[0]
                    : "Taxi"
                }
                hidemidsection={true}
                icon={null}
                routesData={props.routesData}
                version={"v1"}
                transportMode={props.breif.city_slabs[i].intracity_transport}
                duration={props.breif.city_slabs[i].duration}
                _GetInTouch={props._GetInTouch}
              ></MidSection>
            );
          }
        }
      }
  }

  return (
    <Container>
      <div className="flex flex-row justify-between items-end">
        <div className="font-lexend mb-4 lg:mb-10  lg:mt-[4rem] mt-[2rem] font-bold text-4xl">
          Route
        </div>
        {!props.plan?.is_released_for_customer &&
        props.plan?.itinerary_status !== "ITINERARY_PREPARED" &&
        props?.routes &&
        props.routes.length > 0 ? (
          <></>
          // <button
          //   onClick={handleEditRoute}
          //   className="mb-4 lg:mb-10  lg:mt-[4rem] mt-[2rem] font-semibold text-sm px-4 py-2 border-2 border-black rounded-lg hover:text-white hover:bg-black transform ease-in-out duration-300"
          // >
          //   Edit Route
          // </button>
        ) : null}
      </div>

      {locationsArr}
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    itinerary_id: state.ItineraryId,
    plan: state.Plan,
    routes: state.ItineraryRoutes,
  };
};

export default connect(mapStateToPros)(React.memo(Route));