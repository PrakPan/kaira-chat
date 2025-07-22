import React, { useState } from "react";
import ImageLoader from "../ImageLoader";
import Image from "next/image";
import { useRouter } from "next/router";

const CityCard = (props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <div
      className="relative w-[384px] h-[312px] rounded-[24px] overflow-hidden cursor-pointer"
      onClick={() => {
        if (props?.path) router.push(`/${props?.path}`);
      }}
    >
      {" "}
      <ImageLoader
        url={props.img}
        dimensions={{ width: 384, height: 312 }}
        dimensionsMobile={{ width: 384, height: 312 }}
        height="100%"
        style={{
          filter: "brightness(0.9)",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        onload={() => {
          setLoading(false);
        }}
        borderRadius="24px"
        className="w-full h-full cursor-pointer"
      />
      <div className="flex gap-2">
        <div className=" flex gap-2 absolute bottom-0 left-0 m-2 px-2 py-1 text-white text-[0.85rem] font-semibold bg-[#01202b] rounded-[20px] blur-8 tracking-wider w-max">
          <Image src={"/location.svg"} width={16} height={16} />
          {props?.name}
        </div>
      </div>
    </div>
  );
};

export default CityCard;
