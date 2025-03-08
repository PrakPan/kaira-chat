import React from "react";
import CityDetails from "./CityDetails";
import Drawer from "../../ui/Drawer";
import { TbArrowBack } from "react-icons/tb";
import axioscitydatainstance, { cityDetail } from "../../../services/poi/city";
import { useEffect } from "react";
import { useState } from "react";
import CityDetailsSkeleton from "./CityDetailsSkeleton";

const CityDetailsDrawer = (props) => {
  const [data, setData] = useState(null);

  const getCityData = async () => {
    try {
      // const res = await axioscitydatainstance.get("?city_id=" + props.city_id);
      const res = await cityDetail.get(`${props?.city_id}`);
      setData(res.data?.data?.city);
    } catch (err) {
      console.log("[ERROR][CityDetailsDrawer:getCityData]: ", err.message);
    }
  };

  useEffect(() => {
    if (props.show) {
      getCityData();
    } else setData(null);
  }, [props.show]);

  return (
    <Drawer
      show={props.show}
      anchor={"right"}
      backdrop
      style={{ zIndex: 1501 }}
      className="font-lexend"
      onHide={props.onHide}
    >
      <div>
        <TbArrowBack
          onClick={() => props.onHide()}
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
            onHide={props.onHide}
            dayId={props.dayId}
          ></CityDetails>
        ) : (
          <CityDetailsSkeleton></CityDetailsSkeleton>
        )}
        <div></div>
      </div>
    </Drawer>
  );
};

export default CityDetailsDrawer;
