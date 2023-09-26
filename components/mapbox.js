import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import leaflet, { divIcon } from "leaflet";
import { format, parseISO } from "date-fns";
import "leaflet/dist/leaflet.css";

import React, { useEffect } from "react";
import { useState } from "react";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import ImageLoader from "./ImageLoader";
import { ITbutton } from "../containers/newitinerary/breif/cities/City";
import WeatherWidget from "./WeatherWidget/WeatherWidget";
import DistanceBetweenCoords from "../helper/DistanceBetweenCoords";
import { getHumanDate } from "../services/getHumanDate";
import useMediaQuery from "./media";
const MyIcon = ({ color }) => {
  const iconMarkup = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="8" stroke="${color}" stroke-width="2" fill="transparent"/>
                    </svg>`;

  const iconOptions = {
    html: iconMarkup,
    className: "my-icon-class",
    iconSize: [20, 20],
  };

  const customIcon = new DivIcon(iconOptions);
  return customIcon;
};
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
    onload
  }) => {
    const isDesktop = useMediaQuery("(min-width:768px)");
    function sortWholeNumbersDescending(arr) {
      // Convert decimal numbers to whole numbers using Math.floor()
      const wholeNumbers = arr.map((num) => Math.floor(num));

      // Sort whole numbers in descending order using Array.sort()
      wholeNumbers.sort((a, b) => b - a);

      return wholeNumbers;
    }
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
            map.fitBounds(bounds);
          }
        }
      }, [map]);

      return null;
    };

    function getDegree(value) {
      const degrees = [
        { range: [0, 49], degree: 10 },
        { range: [50, 99], degree: 9 },
        { range: [100, 149], degree: 9 },
        { range: [150, 199], degree: 9 },
        { range: [200, 249], degree: 8 },
        { range: [250, 299], degree: 7 },
        { range: [300, 499], degree: 6 },
        { range: [2000, 2999], degree: 5 },
        { range: [3000, 3999], degree: 4 },
        { range: [4000, Infinity], degree: 3 },
      ];

      for (let i = 0; i < degrees.length; i++) {
        const range = degrees[i].range;

        if (value >= range[0] && value <= range[1]) {
          return degrees[i].degree;
        }
      }
    }

    const [polylines, setPolylines] = useState();
    const convertDFormat = (dt) => {
      const date = parseISO(dt);
      const formattedDate = format(date, "MMMM do");
      return formattedDate;
    };
    useEffect(() => {
      // NearestLocation();
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
          if(onload) onload()
        }}
      >
        <TileLayer
          url={`
       https://api.mapbox.com/styles/v1/shivaank/clhpyxasr01ud01qu4n3e7x80/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2hpdmFhbmsiLCJhIjoiY2xob3Vjbnd6MDBsNjNkbXNkanp2Nzd5dyJ9.Nikg8Qt4OOYGthgMQ5zH1w`}
        />

        {/* <ReactLeafletGoogleLayer apiKey="AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E" /> */}
        {polylines ? (
          <Polyline pathOptions={limeOptions} positions={polylines} />
        ) : null}

        {locations.map((location, index) => (
          <Marker
            key={location.id}
            animate
            position={[location.lat, location.long]}
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
