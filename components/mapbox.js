import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import leaflet, { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect } from "react";
import { useState } from "react";
import ImageLoader from "./ImageLoader";
import WeatherWidget from "./WeatherWidget/WeatherWidget";
import { getHumanDate } from "../services/getHumanDate";
import useMediaQuery from "./media";
import { MAPBOX_ACCESS_TOKEN } from "../services/constants";



const limeOptions = {
  color: "#004d6994",
  dashArray: "10, 5", // Defines the pattern of the dashed line (10 units of solid line, 5 units of blank space)
  dashOffset: "15",
};

const Mapbox = React.memo(
  ({
    locations,
    currentPopup,
    setCurrentPopup,
    setShowDrawer,
    setShowDrawerData,
    onload,
  }) => {
    const isDesktop = useMediaQuery("(min-width:768px)");

    const FitBoundsOnMount = () => {
      const map = useMap();

      useEffect(() => {
        if (locations) {
          const bounds = leaflet
            .featureGroup(
              locations.map((location) =>
                leaflet.marker([location.lat, location.long])
              )
            )
            .getBounds();

          if (bounds.isValid()) {
            map?.fitBounds(bounds);
          }
        }
      }, [map]);

      return null;
    };

    const [polylines, setPolylines] = useState();

    useEffect(() => {
      const updatedPolylines = locations.map((element) => [
        element.lat,
        element.long,
      ]);
      setPolylines(updatedPolylines);
    }, [locations]);

    function scrollToTargetAdjusted(id) {
      const element = document.getElementById(id);
      const headerOffset = 117;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    return locations ? (
      <MapContainer
        scrollWheelZoom={false}
        dragging={!isDesktop}
        style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
        whenReady={() => {
          if (onload) onload();
        }}
      >
        <TileLayer
          url={`
       https://api.mapbox.com/styles/v1/shivaank/clhpyxasr01ud01qu4n3e7x80/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`}
        />

        {polylines ? (
          <Polyline pathOptions={limeOptions} positions={polylines} />
        ) : null}

        {locations.map((location, index) => (
          <Marker
            key={location.id}
            animate
            position={[location?.lat, location?.long]}
            draggable={false}
            icon={divIcon({
              className: "icon",
              html: `
            <div class="-mt-1 -ml-2 group w-[40px] h-[40px] rounded-full grid place-items-center">
            <div class="-mt-2 drop-shadow-lg group-hover:animate-bounce rounded-full w-[30px] h-[30px] flex justify-center items-center" style="background-color: ${
              location.color ? location.color : "#111"
            };">
            <span class="text-white text-xs font-bold  ">  ${index + 1}</span>
         </div>
            </div>

          `,
              iconSize: 20,
            })}
          >
            <Popup className="w-[26rem] ">
              <div className="flex flex-row w-[26rem] ">
                <div>
                  <ImageLoader
                    borderRadius="8px"
                    url={location?.cityData?.image}
                    height={150}
                    width={150}
                    heightMobile="auto"
                    dimensionsMobile={{ width: 150, height: 150 }}
                  ></ImageLoader>
                </div>

                <div className="flex flex-col justify-between gap-2 pl-3">
                  <div>
                    <div className={`font-bold text-lg text-[#270e0e]`}>
                      {location.name} - {location?.duration} Nights
                    </div>
                    <div className="flex flex-row gap-2 font-semibold">
                      <div>{getHumanDate(location.date)}</div>
                    </div>
                  </div>

                  {
                    <WeatherWidget
                      location={location}
                      city={location?.name}
                      description={location?.cityData?.short_description}
                      travelDate={"28/05/2023"}
                      setShowDrawer={setShowDrawer}
                      setShowDrawerData={setShowDrawerData}
                      noSkeleton
                    />
                  }
                  <div
                    className={`relative rounded w-fit cursor-pointer bg-slate-600 px-2 py-2 text-xs font-semibold text-white shadow-sm  hover:bg-[#BF3535] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                    onClick={() => scrollToTargetAdjusted(location.dayId)}
                  >
                    View {location.name} in your Itinerary
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <FitBoundsOnMount />
      </MapContainer>
    ) : null;
  }
);

export default Mapbox;
