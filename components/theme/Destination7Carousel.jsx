import React from "react";
import SecondaryHeading from "../heading/Secondary";
import CityCard from "../cards/CityCard";
import { useRouter } from "next/router";

const Destination7Carousel = (props) => {
    const router=useRouter()
  return (
    <div>
      <div className="flex flex-col gap-6 justify-center items-center w-full">
        <div className=" md:pt-0  flex flex-col justify-center items-center gap-3">
          <div
            className={` text-[48px] max-w-[700px] text-center mx-auto font-bold`}
          >
            {props?.heading}
          </div>
          <div className="flex flex-col gap-3 justify-start">
            <SecondaryHeading className="font-[400] text-[#7C7C7C] max-w-[800px] text-center mx-auto">
              {props?.text}
            </SecondaryHeading>
          </div>
        </div>
        <div className="flex gap-2">
          {props?.cities?.map((item) => (
            <div className="cursor-pointer" onClick={()=>router.push(`/${props?.path}`)}>
            <CityCard img={item?.image} name={item?.name} path={item?.path}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Destination7Carousel;
