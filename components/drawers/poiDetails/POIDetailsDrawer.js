import React, { useState } from "react";
import Drawer from "../../ui/Drawer";
import POIDetailsSkeleton from "./POIDetailsSkeleton";
import POIDetails from "./POIDetails";
import { useEffect } from "react";
import axiosPOIdetailsInstance from "../../../services/poi/poidetails";
import axiosPOIActivityInstance from "../../../services/poi/poiActivities";

const POIDetailsDrawer = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (props.show) fetchData();
  }, [props.show]);

  function fetchData() {
    if (props.ActivityiconId) {
      axiosPOIActivityInstance
        .get(`/?id=${props.ActivityiconId}`)
        .then((res) => {
          if (res.data.name) setData(res.data);
          else throw new Error(res.data?.message);
        })
        .catch((err) => {
          setData({
            name: props.name,
            short_description: props.text,
            image: props.image,
          });
        });
    } else {
      if (props.iconId) {
        axiosPOIdetailsInstance
          .get(`/?id=${props.iconId}`)
          .then((res) => {
            if (res.data.name) setData(res.data);
            else throw new Error(res.data?.message);
          })
          .catch((err) => {
            setData({
              name: props.name,
              short_description: props.text,
              image: props.image,
            });
          });
      } else {
        setData({
          name: props.name,
          short_description: props.text,
          image: props.image,
        });
      }
    }
  }

  return (
    <Drawer
      show={props.show}
      anchor={"right"}
      backdrop
      width={props.width}
      style={{ zIndex: props.itineraryDrawer ? 1503 : 1501 }}
      className="font-lexend"
      onHide={props.handleCloseDrawer}
      // zIndex='1501'
    >
      {data.name ? (
        <POIDetails
          itineraryDrawer={props.itineraryDrawer}
          data={data}
          handleCloseDrawer={props.handleCloseDrawer}
        />
      ) : (
        <POIDetailsSkeleton
          itineraryDrawer={props.itineraryDrawer}
          name={props.name}
          handleCloseDrawer={props.handleCloseDrawer}
        />
      )}
    </Drawer>
  );
};

export default POIDetailsDrawer;
