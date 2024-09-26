import { useState } from "react";
import Image from "next/image";

import SkeletonCard from "../../../ui/SkeletonCard";
import media from '../../../media';

export default function LogoContainer({ data }) {


  return (
    <div className="lg:w-[20%] flex flex-row gap-2 items-center">
      <Logo src={data?.code} />

      <div className="flex flex-col gap-1">
        <div className="text-sm">
          {data?.name}
        </div>
        <div className="text-sm text-gray-600">
          {data?.code}-{data?.flight_number}
        </div>
      </div>

    </div>
  );
}

export const Logo = ({ src }) => {
  let isPageWide = media("(min-width: 768px)");
  const [ImageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      <div style={{ display: !ImageLoaded ? "initial" : "none" }}>
        <SkeletonCard
          width={isPageWide ? "70px" : "50px"}
          height={isPageWide ? "70px" : "50px"}
          borderRadius={"50%"}
        />
      </div>

      <div
        style={{ display: ImageLoaded ? "initial" : "none" }}
        className="relative w-12 h-12 md:w-16 md:h-16"
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
