import { useState } from "react";
import Image from "next/image";

import SkeletonCard from "../../../ui/SkeletonCard";
import media from '../../../media';

export default function LogoContainer({ url }) {
  let isPageWide = media("(min-width: 768px)");
  const [ImageLoaded, setImageLoaded] = useState(false);

  console.log("ERE >>>>", url)

  return (
    <div className="flex flex-row gap-1 items-center justify-center">
      <div style={{ display: !ImageLoaded ? "initial" : "none" }}>
        <SkeletonCard
          width={isPageWide ? "80px" : "50px"}
          height={isPageWide ? "80px" : "50px"}
          borderRadius={"50%"}
        />
      </div>
      <div style={{ display: ImageLoaded ? "initial" : "none" }}>
        <Image
          fill
          src={url}
          onLoad={() => {
            setTimeout(() => {
              setImageLoaded(true);
            }, 500);
          }}
        ></Image>
      </div>

    </div>
  );
}
