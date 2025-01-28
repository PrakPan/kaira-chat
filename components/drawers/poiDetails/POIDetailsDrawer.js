import React, { useState } from "react";
import Drawer from "../../ui/Drawer";
import POIDetailsSkeleton from "./POIDetailsSkeleton";
import POIDetails from "./POIDetails";
import { useEffect } from "react";
import axiosPOIdetailsInstance from "../../../services/poi/poidetails";
import axiosPOIActivityInstance from "../../../services/poi/poiActivities";

const POIDetailsDrawer = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.show) fetchData();
  }, [props.show]);

  function fetchData() {
    setLoading(true);
    if (props.ActivityiconId) {
      axiosPOIActivityInstance
        .get(`/?id=${props.ActivityiconId}`)
        .then((res) => {
          if (res.data.name) setData(res.data);
          else throw new Error(res.data?.message);
          setLoading(false);
        })
        .catch((err) => {
          setData({
            name: props.name,
            short_description: props.text,
            image: props.image,
          });
          setLoading(false);
        });
    } else {
      if (props.iconId) {
        axiosPOIdetailsInstance
          .get(`/?id=${props.iconId}`)
          .then((res) => {
            if (res.data.name) setData(res.data);
            else throw new Error(res.data?.message);
            setLoading(false);
          })
          .catch((err) => {
            setData({
              name: props.name,
              short_description: props.text,
              image: props.image,
            });
            setLoading(false);
          });
      } else {
        setData({
          name: props.name,
          short_description: props.text,
          image: props.image,
        });
        setLoading(false);
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
    >
      {!loading ? (
        <>
          <POIDetails
            itineraryDrawer={props.itineraryDrawer}
            data={data}
            handleCloseDrawer={props.handleCloseDrawer}
          >
            {props.children}
          </POIDetails>

          <div className="sticky z-50 bottom-4 w-full flex items-center justify-center">
            {props.children}
          </div>
        </>
      ) : (
        <POIDetailsSkeleton
          width={"500px"}
          itineraryDrawer={props.itineraryDrawer}
          name={props.name}
          handleCloseDrawer={props.handleCloseDrawer}
        />
      )}
    </Drawer>
  );
};

export default POIDetailsDrawer;
