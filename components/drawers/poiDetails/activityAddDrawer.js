import { useEffect, useState } from "react";
import Drawer from "../../ui/Drawer";
import { IoMdClose } from "react-icons/io";
import { EXPERIENCE_FILTERS_BOX } from "../../../services/constants";
import styled from "styled-components";
import { Navigation } from "../../NewNavigation";
import axiosaxtivitiesinstance from "../../../services/poi/reccommendedactivities";
import addActivity from "../../../services/poi/addActivities";
import PoiList from "../../../containers/newitinerary/itineraryelements/PoiList";
import { BiErrorCircle } from "react-icons/bi";
import PoiListSkeleton from "../../../containers/newitinerary/itineraryelements/PoiListSkeleton";
import { getDate } from "../../../helper/DateUtils";
import { connect } from "react-redux";
import { openNotification } from "../../../store/actions/notification";

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const EmptyMsg = styled.div`
  margin-top: 5rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
`;

const items = [
  { id: 1, label: "Things To Do", link: "Activities" },
  //   { id: 2, label: "Places To Visit", link: "POI" },
];

const ActivityAddDrawer = (props) => {
  const [selectedExprience, setSelectedExprience] = useState(-1);
  const [elementType, setElementType] = useState("Activity");
  const [options, setOptions] = useState([]);
  const [fetchingPoi, setFetchingPoi] = useState(true);

  const setFocus = (dayIndex, elementIndex, activityId) => {
    const element = document.getElementById(
      `${dayIndex}-${elementIndex}-${activityId}`
    );
    let timeoutId;
    if (element) {
      element.scrollIntoView({ block: "center" });
      element.style.borderWidth = "1px";
      element.style.borderRadius = "10px";
      element.style.borderColor = "#f8e000";
      element.style.boxShadow = "0 0 10px #f8e000";

      timeoutId = setTimeout(() => {
        element.style.borderWidth = "";
        element.style.borderRadius = "";
        element.style.borderColor = "";
        element.style.boxShadow = "";
      }, 4000);
    }

    // Cleanup the timeout to avoid memory leaks
    if (timeoutId) return () => clearTimeout(timeoutId);
  };

  const _addActivityHandler = (activityID) => {
    addActivity
      .post(
        "/",
        {
          itinerary_id: props.itinerary_id,
          activity_id: activityID,
          check_in: getDate(props.date),
          day_slab_index: props.day_slab_index,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((response) => {
        props.setItinerary(response.data);
        props.getAccommodationAndActivitiesHandler();
        props.openNotification({
          text: "Your Activity added successfully!",
          heading: "Success!",
          type: "success",
        });
        const lastElement = [
          ...response.data.day_slabs[props.day_slab_index].slab_elements,
        ].pop();
        setTimeout(() => {
          setFocus(props.day_slab_index, lastElement.element_index, activityID);
        }, 1000);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          props.openNotification({
            text: "You are not allowed to make changes to this itinerary",
            heading: "Error!",
            type: "error",
          });
        } else {
          props.openNotification({
            text: "There seems to be a problem, please try again!",
            heading: "Error!",
            type: "error",
          });
        }
      });
  };

  function fetchData() {
    axiosaxtivitiesinstance
      .post("/", {
        location: props?.cityID,
        duration: 10,
        element_type: elementType,
        experience_filters: EXPERIENCE_FILTERS_BOX[selectedExprience]
          ? EXPERIENCE_FILTERS_BOX[selectedExprience].actual
          : [],
      })
      .then((res) => {
        if (res.data.results.length) {
          let options = [];

          for (var i = 0; i < res.data.results.length; i++) {
            options.push(
              <PoiList
                key={i}
                activityAddDrawer
                _updatePoiHandler={_addActivityHandler}
                // selectedData={props.data}
                setShowDrawer={props?.setShowDrawer}
                data={res.data.results[i]}
                // loginModal={showLoginModal}
                setLoginModal={props.setShowLoginModal}
                // ticketsCount={ticketsCount}
              ></PoiList>
            );
          }
          setOptions(options);
        } else {
          setOptions([]);
        }
        setFetchingPoi(false);
      })
      .catch((err) => {
        setFetchingPoi(false);
      });
  }

  useEffect(() => {
    if (props.showDrawer) {
      setFetchingPoi(true);
      fetchData();
    }
  }, [elementType, selectedExprience, props.showDrawer]);

  const navigationHandler = (child) => {
    if (child == "Things To Do") {
      setElementType("Activity");
    } else {
      setElementType("POI");
    }
  };

  return (
    <Drawer
      show={props.showDrawer}
      anchor={"right"}
      backdrop
      style={{ zIndex: 1501 }}
      className="font-lexend"
      onHide={() => props.setShowDrawer(false)}
      mobileWidth={"100vw"}
      width="50vw"
    >
      <div className="sticky px-2 top-0 bg-white z-[900] flex flex-col gap-3 py-4 pb-1 justify-start items-start mx-auto w-[98%]">
        <div className="flex flex-row gap-3 my-0 justify-start items-center">
          <IoMdClose
            onClick={() => props.setShowDrawer(false)}
            className="hover-pointer"
            style={{
              fontSize: "1.75rem",
              textAlign: "right",
            }}
          ></IoMdClose>
          <div className="line-clamp-1 text-2xl font-normal ">
            Adding activity in {props.cityName}
          </div>
        </div>

        <div className="flex flex-row justify-between mt-0">
          <div className="flex flex-col justify-start items-baseline">
            <div className="mb-2 text-sm font-normal">Experience Types</div>
            <FiltersContainer>
              {EXPERIENCE_FILTERS_BOX.map((currentfilter, i) => (
                <button
                  onClick={() => {
                    if (selectedExprience !== i) setSelectedExprience(i);
                    else setSelectedExprience(-1);
                  }}
                  className={`flex font-normal  text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${
                    selectedExprience == i
                      ? "text-white border-0 bg-black "
                      : "border-2 bg-white text-black"
                  } active:text-white  border-[#D0D5DD]  rounded-lg px-2 py-1`}
                  key={i}
                >
                  {currentfilter.display}
                </button>
              ))}
            </FiltersContainer>
          </div>
        </div>

        <div>
          Showing {options.length}{" "}
          {elementType === "POI" ? "attractions" : "activities"}
          {props?.cityName ? ` in ${props?.cityName}` : null}
        </div>
        <Navigation
          items={items}
          BarName="TabsName"
          ClickHandler={navigationHandler}
        />
      </div>

      {!fetchingPoi ? (
        options.length ? (
          options
        ) : (
          <EmptyMsg>
            <BiErrorCircle /> Oops, it looks like there are no{" "}
            {elementType === "POI" ? "places to visit" : "things to do"}{" "}
            available.
          </EmptyMsg>
        )
      ) : (
        <PoiListSkeleton />
      )}
    </Drawer>
  );
};

const mapStateToPros = (state) => {
  return {
    notificationText: state.Notification.text,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};
export default connect(mapStateToPros, mapDispatchToProps)(ActivityAddDrawer);
