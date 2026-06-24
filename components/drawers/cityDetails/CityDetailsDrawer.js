import React from "react";
import Image from "next/image";
import CityDetails from "./CityDetails";
import Drawer from "../../ui/Drawer";
import axioscitydatainstance, { cityDetail } from "../../../services/poi/city";
import { useEffect } from "react";
import { useState } from "react";
import CityDetailsSkeleton from "./CityDetailsSkeleton";
import { useRouter } from "next/router.js";
import { useSearchParams } from "next/navigation.js";

const CityDetailsDrawer = (props) => {
  const [data, setData] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const cityId = searchParams.get("city_id");
  const dayId = searchParams.get("dayId");
  const getCityData = async () => {
    try {
      const res = await axioscitydatainstance.get("/city/" + cityId);
      setData(res.data?.data?.city);
    } catch (err) {
      console.log("[ERROR][CityDetailsDrawer:getCityData]: ", err.message);
    }
  };

  useEffect(() => {
    if (cityId) {
      getCityData();
    } else setData(null);
  }, []);

  useEffect(() => {
    if (props?.show) {
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [props?.show]);

  return (
    <Drawer
      show={true}
      anchor={"right"}
      backdrop
      width="50%"
      mobileWidth="100%"
      bgColor="#fafaf5"
      style={{ zIndex: 1501 }}
      className="!overflow-y-hidden"
      onHide={() => {
        router.push(
          {
            pathname: window.location.pathname,
          },
          undefined,
          { scroll: false, shallow: true }
        );
      }}
    >
      <div className="overflow-y-scroll h-screen px-6 max-ph:px-4">
        <div className="py-4 bg-[#fafaf5] z-[900] flex flex-col gap-3 pb-2 sticky top-0">
          <Image
            src="/backarrow.svg"
            alt="Back"
            width={22}
            height={2}
            className="cursor-pointer"
            onClick={() =>
              router.push(
                {
                  pathname: window.location.pathname,
                },
                undefined,
                { scroll: false, shallow: true }
              )
            }
          />
          <div className="ttw-type-h2 font-semibold text-[#0b1220]">
            City Details
          </div>
        </div>
        {data ? (
          <CityDetails
            elevation={
              data.elevation &&
              data.elevation.length &&
              data.elevation[0]?.elevation
            }
            data={data}
            onHide={() =>
              router.push(
                {
                  pathname: window.location.pathname,
                },
                undefined,
                { scroll: false, shallow: true }
              )
            }
            dayId={dayId}
          ></CityDetails>
        ) : (
          <CityDetailsSkeleton></CityDetailsSkeleton>
        )}
      </div>
    </Drawer>
  );
};

export default CityDetailsDrawer;
