import React from 'react';
import dynamic from 'next/dynamic';

export default function Home() {
  const MapWithNoSSR = dynamic(() => import('../components/Mapbox'), {
    ssr: false,
  });

  return (
    <div className="relative w-full h-full">
      <div className="absolute w-[60%] h-[60%]">
        <MapWithNoSSR />
      </div>
    </div>
  );
}
