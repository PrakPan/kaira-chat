import { useState } from "react";
import Image from "next/image";

import SkeletonCard from "../../../ui/SkeletonCard";
import media from '../../../media';

export default function LogoContainer({ data }) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <Logo src={data?.segments[0]?.airline.code} />

      <div className="flex flex-col gap-1">
        <div className="text-sm">
          {data?.segments[0]?.airline.name}
        </div>
        <div className="text-sm text-gray-600">
          {data?.segments[0]?.airline.code}-{data?.segments[0]?.airline.flight_number}

          {data?.segments.length > 1 ? (
            <div className="text-sm text-gray-600">
              +{data?.segments?.length - 1} more
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export const Logo = ({ src, width, height }) => {
  let isPageWide = media("(min-width: 768px)");
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      {!imageLoaded && (
        <div>
          <SkeletonCard
            width={isPageWide ? "70px" : "50px"}
            height={isPageWide ? "70px" : "50px"}
            borderRadius={"50%"}
          />
        </div>
      )}


      <div
        // style={{ display: imageLoaded ? "block" : "none" }}
        className={`relative w-12 md:w-16 h-12 md:h-16`}
      >
        <Image
          fill
          alt=""
          src={`https://d31aoa0ehgvjdi.cloudfront.net/media/airlines/${src}.png`}
          onLoad={() => {
            setImageLoaded(true);
          }}
        ></Image>
      </div>
    </>
  )
}
