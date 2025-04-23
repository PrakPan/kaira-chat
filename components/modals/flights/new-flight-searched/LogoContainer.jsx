import { useState } from "react";
import Image from "next/image";

import SkeletonCard from "../../../ui/SkeletonCard";
import media from "../../../media";

export default function LogoContainer({ data,height,width }) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <Logo src={data?.segments[0]?.airline?.code} ht={height} wd={width} />

      <div className="flex items-center gap-1">
        <div className="text-[18px] font-semibold">{data?.segments[0]?.airline?.name} |</div>
        <div className="text-[16px] text-gray-600">
          {data?.segments[0]?.airline?.code}-
          {data?.segments[0]?.airline?.flight_number}
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

export const Logo = ({ src, wd, ht }) => {
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
          className="relative h-12 md:h-16 w-12 md:w-16"

        style={{
          height: ht ? `${ht}px` : undefined,
          width: wd ? `${wd}px` : undefined,
        }}
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
  );
};
