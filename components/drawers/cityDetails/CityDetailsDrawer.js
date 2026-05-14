import React from "react";
import CityDetails from "./CityDetails";
import Drawer from "../../ui/Drawer";
import { TbArrowBack } from "react-icons/tb";
import axioscitydatainstance, { cityDetail } from "../../../services/poi/city";
import { useEffect } from "react";
import { useState } from "react";
import CityDetailsSkeleton from "./CityDetailsSkeleton";
import styled from "styled-components";
import media from "../../../components/media.js";
import { useRouter } from "next/router.js";
import { useSearchParams } from "next/navigation.js";

const FloatingView = styled.div`
  position: sticky;
  bottom: 60px;
  left: 100%;
  background: black;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  z-index: 901;
  cursor: pointer;
`;

const CityDetailsDrawer = (props) => {
  let isPageWide = media("(min-width: 768px)");
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
      style={{ zIndex: 1501 }}
      className=""
      onHide={() => {
        router.push(
          {
            pathname: window.location.pathname,
          },
          undefined,
          { scroll: false }
        );
      }}
    >
      <div>
        <TbArrowBack
          onClick={() =>
            router.push(
              {
                pathname: window.location.pathname,
              },
              undefined,
              { scroll: false }
            )
          }
          className="hover-pointer"
          style={{
            margin: "0.5rem",
            fontSize: "1.75rem",
            textAlign: "right",
          }}
        ></TbArrowBack>
        {data ? (
          <CityDetails
            elevation={
              data.elevation &&
              data.elevation.length &&
              data.elevation[0]?.elevation
            }
            data={data}
            onHide={() =>
              router.push({
                pathname: window.location.pathname,
              })
            }
            dayId={dayId}
          ></CityDetails>
        ) : (
          <CityDetailsSkeleton></CityDetailsSkeleton>
        )}
        {/* {!isPageWide && (
          <FloatingView>
            <TbArrowBack
              style={{ height: "28px", width: "28px" }}
              cursor={"pointer"}
              onClick={() => {
                router.push(
                  {
                    pathname: window.location.pathname,
                  },
                  undefined,
                  { scroll: false }
                );
              }}
            />
          </FloatingView>
        )} */}
      </div>
    </Drawer>
  );
};

export default CityDetailsDrawer;
