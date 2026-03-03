import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import DesktopBanner from "../../../components/containers/Banner";
import Banner from "../../homepage/banner/Mobile";
import Route from "../../newitinerary/breif/route/Index";
import Drawer from "../../../components/drawers/cityDetails/CityDetailsDrawer";
import RouteEditSection from "../../newitinerary/breif/route/RouteEditSection.js";
import RoutesMap from "./RoutesMap.js";
import { useParams, useSearchParams } from "next/navigation.js";
import Image from "next/image.js";
import useMediaQuery from "../../../components/media.js";
import { useDispatch, useSelector } from "react-redux";
import { setCloneItineraryDrawer } from "../../../store/actions/cloneItinerary.js";

const DetailsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10;
  flex-direction: column-reverse;
  padding: 0 0rem;
  @media screen and (min-width: 768px) {
    flex-direction: row-reverse;
    padding: 0;
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

const RoutesRow = styled.div`
  border-radius: 6px;
  background: #fff9eb;
  display: flex;
  padding: 8px;
  align-items: flex-start;
  align-self: stretch;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
`;

const Details = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDrawerData, setShowDrawerData] = useState(false);
  const [locationsLatLong, setLocationsLatLong] = useState([]);
  const [routeView, setRouteView] = useState(false);
  const { drawer } = router?.query;
  const isDesktop = useMediaQuery("(min-width:767px)");
  const { id } = useSelector((state) => state.auth);
  const { customer } = useSelector((state) => state.Itinerary);

  const CITY_COLOR_CODES = [
    "#359EBF", //  # shade of blue
    "#F0C631", //# shade of yellow
    "#BF3535", //# shade of red
    "#47691e", //# shade of green
    "#cc610a", //# shade of orange
    "#008080", //# shade of teal
    "#7d5e7d", //# shade of purple
  ];

  useEffect(() => {
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
        let color;
        //  console.log("CityData",props.CityData);
        for (var i = 0; i < props.CityData.length; i++) {
          color = CITY_COLOR_CODES[i % 7];
          var postion = props.CityData[i];
          if (
            !postion?.is_departure_only &&
            !postion?.is_trip_terminated &&
            postion?.duration &&
            postion?.duration !== "0"
          ) {
            Locationlatlong.push({
              // dayId: getdayId(postion?.day_slab_location?.start_day_slab_index || '12'),
              dayId: "12",
              cityData: postion,
              id: postion?.gmaps_place_id || "ChIJ78XjhlaF4TgRxgXjwXxLJGY",
              city_id: postion.city?.id || postion?.gmaps_place_id,
              lat: postion.city?.latitude,
              long: postion.city?.longitude,
              name: postion.city?.name || postion?.city_name,
              duration: postion.duration,
              color: color,
              // date: getdateId(postion?.day_slab_location?.start_day_slab_index || '12'),
              date: postion.start_date,
            });
          }
        }
      }
    }

    setLocationsLatLong(Locationlatlong);
  }, [props.routesData, props.CityData]);

  const _handleTailoredRedirect = (e) => {
    router.push("/tailored-travel");
  };

  const getdayId = (id) => {
    return props.itinerary?.day_slabs[id]?.slab_id;
  };

  const getdateId = (id) => {
    return props.itinerary?.day_slabs[id]?.slab;
  };

  function findDayIdByCityId(cityId) {
    for (const item of locationsLatLong) {
      if (item.city_id === cityId) {
        return item.dayId;
      }
    }
    return null; // Return null if city_id is not found in the array
  }

  useEffect(() => {
  const { drawer } = router.query;

  if (props.autoOpenDrawer && !drawer) {
    const hasOpenedDrawer = sessionStorage.getItem("routeDrawerOpened");
    
    if (!hasOpenedDrawer && props.routes && props.routes.length > 0) {
      setTimeout(() => {
        router.push(
          {
            pathname: router.pathname,
            query: { ...router.query, drawer: "handleEditRoute" },
          },
          undefined,
          { shallow: true }
        );
        sessionStorage.setItem("routeDrawerOpened", "true");
      }, 300);
    }
  }
}, [props.autoOpenDrawer, props.routes]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("routeDrawerOpened");
    };
  }, []);

  return (
    <div id="brief" className="mb-2xl mt-lg max-ph:mt-xl max-ph:mb-xl">

      {router.query.drawer === "handleEditRoute" && (
        <RouteEditSection
          mercuryItinerary={props?.mercuryItinerary}
          routes={props?.CityData}
          editRoute={true}
          // editRoute={drawer == "handleEditRoute"}
          setEdit={props.setEditRoute}
          group_type={props.group_type}
          duration_time={props.duration_time}
          travellerType={props.travellerType}
          transferBookings={props?.cityTransferBookings}
          fetchData={props.fetchData}
          setShowLoginModal={props.setShowLoginModal}
          setLocationsLatLong={setLocationsLatLong}
          resetRef={props?.resetRef}
          setActiveTab={props?.setActiveTab}
        >
          {isDesktop ? (
            <RoutesMap
              locations={locationsLatLong}
              setShowDrawer={setShowDrawer}
              setShowDrawerData={setShowDrawerData}
              setEditRoute={props.setEditRoute}
            />
          ) : null}
        </RouteEditSection>
      )}

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