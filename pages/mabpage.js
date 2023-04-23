import React from "react";
import dynamic from "next/dynamic";

export default function Home() {
  const MapWithNoSSR = dynamic(() => import("../components/Mapbox"), {
    ssr: false
  });

  return (

      <div id="map w-full h-full">
        <MapWithNoSSR />
      </div>
   
  );
}