import React, { useEffect, useRef, useState } from "react";
import { MERCURY_HOST } from "../../../services/constants";
import useDebounce from "../../../hooks/useDebounce";
import axios from "axios";
import BackArrow from "../../ui/BackArrow";
import DyamicFilters from "../poiDetails/filters/DynamicFilters";
import { IoMdSearch } from "react-icons/io";
import Image from "next/image";
import ChangePoiBooking from "../../../containers/newitinerary/itineraryelements/ChangePoiBooking";
import POIDetailsSkeleton from "../../../containers/newitinerary/itineraryelements/PoiListSkeleton";
import H3 from "../../heading/H3";
import CheckboxFormComponent from "../../FormComponents/CheckboxFormComponent";
import Button from "../../../components/ui/button/Index";
import { openNotification } from "../../../store/actions/notification";
import { useDispatch } from "react-redux";
import { TbArrowBack } from "react-icons/tb";
import styled from "styled-components";
import useMediaQuery from "../../media";

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
const AddPoi = (props) => {
  const isDesktop = useMediaQuery("(min-width:768px)");
  const dispatch = useDispatch();
  const elementType = "POI";
  const [selectSearch, setSelectedSearch] = useState("");
  const debouncedSearch = useDebounce(selectSearch);
  const [startDate, setStartDate] = useState(props?.date);
  const [changed, setChanged] = useState(false);
  const [height, setHeight] = useState(0);

  const [filterState, setFilterState] = useState({
    recommended_only: false,
    rating: ["All"],
    category: ["All"],
    tour_type: ["All"],
    guide: ["All"],

    experienceFilters: ["All"],
  });
  const [filtersObj, setFiltersObj] = useState({
    ratings: [1, 2, 3, 4, 5],
    category: [],
    tour_type: [],
    guide: [],
  });

  const filtersRef = useRef(null);

  const [showDynamicfilters, setShowDynamicfilters] = useState(false);
  const [nextUrl, setNextUrl] = useState(null);
  const [options, setOptions] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const searchHandler = (e) => {
    setSelectedSearch(e.target.value);
  };

  const handleRecommneded = () => {
    setFilterState((prev) => ({
      ...prev,
      recommended_only: !filterState.recommended_only,
    }));
  };

  const handleViewMore = async () => {
    setShowSkeleton(true);
    let options=[]
    try {
      const res = await axios.get(nextUrl);

      for (var i = 0; i < res.data.data.pois.length; i++) {
        options.push(
          <ChangePoiBooking
            key={i}
            setShowDrawer={props?.setShowDrawer}
            data={res.data.data.pois[i]}
            setLoginModal={props.setShowLoginModal}
            date={startDate}
            cityId={props?.cityID}
            itinerary_city_id={props?.itinerary_city_id}
            dayIndex={props?.day_slab_index}
            setShowLoginModal={props.setShowLoginModal}
          ></ChangePoiBooking>
        );
      }
      setOptions((prev) => [...prev, ...options]);
      setNextUrl(res?.data?.next);
    } catch (error) {
      dispatch(
        openNotification({
          text: "unable to load results",
          heading: "Error!",
          type: "error",
        })
      );
    }
    setShowSkeleton(false);
  };

  useEffect(() => {
    fetchPois();
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowDynamicfilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [debouncedSearch, filterState]);

  const handleClose = () => {
    console.log("clicked");
    props?.setShowDrawer(false);
    props?.handleCloseDrawer();
  };

  const fetchPois = async () => {
    try {
      const res = await axios.get(
        `${MERCURY_HOST}/api/v1/geos/poi/?fields=id,name,city,image,rating,experience_filters,short_description,tags,is_very_popular,tips_tricks,is_hidden_gem,gmaps_place_id,user_ratings_total&city_id=${
          props?.cityID
        }&name=${debouncedSearch}&is_very_popular=${
          filterState?.recommended_only
        }&filters=${filterState?.experienceFilters.join(",")}`
      );
      const result = [];
      for (var i = 0; i < res.data.data.pois.length; i++) {
        result.push(
          <ChangePoiBooking
            key={i}
            setShowDrawer={props?.setShowDrawer}
            data={res.data.data.pois[i]}
            setLoginModal={props.setShowLoginModal}
            date={startDate}
            cityId={props?.cityID}
            itinerary_city_id={props?.itinerary_city_id}
            dayIndex={props?.dayIndex}
            slabIndex={props?.slabIndex}
            setShowLoginModal={props.setShowLoginModal}
            handleClose={handleClose}
          ></ChangePoiBooking>
        );
      }
      setNextUrl(res?.data?.next);
      setOptions(result);
      setTotalResults(res?.data?.results);
    } catch (error) {
      console.log("loading poi error:", error);
    }
  };

  useEffect(() => {
    const updateHeight = () => setHeight(window.innerHeight);
    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <>
      <div
        className=" flex flex-col gap-3 overflow-y-scroll"
        style={{ height: `${height}px` }}
      >
        <div className=" z-[900] flex flex-col gap-3  bg-white px-2 py-4">
          <BackArrow handleClick={(e) => props.setShowDrawer(false)} />
          <H3>
            Replacing {props?.name} in {props?.cityName}
          </H3>
          <div className="grid w-full gap-2 min-[583px]:grid-cols-[3fr_1fr]">
            <div className="relative flex flex-row items-center  h-[44px]">
              <IoMdSearch
                id={"icon"}
                onClick={searchHandler}
                className="absolute cursor-pointer left-4 text-2xl"
              />
              <input
                type="text"
                value={selectSearch}
                onChange={searchHandler}
                placeholder={`Search ${
                  elementType === "POI" ? "attractions" : "activities"
                }`}
                className="w-full flex items-center text-sm border-2 border-gray-300 rounded-lg px-5 py-2 focus:outline-none focus:border-[#F7E700] h-[44px]"
              ></input>
            </div>

            <div className="relative inline-block">
              <div
                className="relative px-[16px] py-[12px] bg-[#1B1B1B] text-white rounded-[8px] h-[44px] flex items-center gap-2 max-[583px]:hidden cursor-pointer"
                onClick={() => setShowDynamicfilters(true)}
              >
                <Image
                  src="/filter.svg"
                  width={20}
                  height={20}
                  alt="Filter Icon"
                />
                <button>Filters</button>
                {changed && (
                  <div className="absolute -right-1 -top-1 h-[20px] w-[20px] rounded-full bg-red-500"></div>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-row items-center justify-between w-full mb-[20px] px-2">
              <div>
                Showing {options.length} attractions
                {totalResults ? ` out of ${totalResults}` : null}
                {props?.cityName ? ` in ${props?.cityName}` : null}
              </div>
              <div className="max-[583px]:hidden">
                <button
                  onClick={handleRecommneded}
                  className="flex flex-row items-center gap-1 cursor-pointer"
                >
                  <CheckboxFormComponent
                    checked={filterState.recommended_only}
                  />
                  Top Recommended
                </button>
              </div>
            </div>
            <div className="min-[583px]:hidden flex justify-between w-full mb-2 px-2">
              <button
                onClick={handleRecommneded}
                className="flex flex-row items-center gap-1 cursor-pointer"
              >
                <CheckboxFormComponent checked={filterState.recommended_only} />
                Top Recommended
              </button>
              <div className="flex gap-4">
                <div
                  className="relative px-[16px] py-[12px] bg-[#1B1B1B] text-white rounded-[8px] h-[44px] flex items-center gap-2  cursor-pointer"
                  onClick={() => setShowDynamicfilters(true)}
                >
                  <Image
                    src="/filter.svg"
                    width={"20"}
                    height={"20"}
                    color="white"
                  />
                  {changed && (
                    <div className="absolute -right-1 -top-1 h-[20px] w-[20px] rounded-full !bg-red-500"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-2 ">
          {options?.length > 0 ? (
            <div>
              {options?.map((item) => {
                return item;
              })}
              {showSkeleton ? (
                <POIDetailsSkeleton />
              ) : (
                <>
                  {nextUrl !== null ? (
                    <Button
                      boxShadow
                      onclickparam={null}
                      onclick={handleViewMore}
                      margin="0.25rem auto"
                      borderWidth="1px"
                      borderRadius="2rem"
                      padding="0.25rem 1rem"
                    >
                      View more
                    </Button>
                  ) : null}
                </>
              )}
            </div>
          ) : (
            <POIDetailsSkeleton />
          )}
        </div>
      </div>
      {showDynamicfilters && (
        <div
          className={`
        z-50 bg-white shadow-2xl drop-shadow-3xl p-[16px] rounded-lg space-y-5 text-sm z-[1091]
        min-[584px]:absolute min-[584px]:top-[calc(100%+8px)] min-[584px]:right-0
        max-[583px]:fixed max-[583px]:bottom-0 max-[583px]:w-full 
      `}
          ref={filtersRef}
        >
          <DyamicFilters
            filters={filtersObj}
            showFilter={showDynamicfilters}
            setshowFilter={setShowDynamicfilters}
            filterState={filterState}
            setFilterState={setFilterState}
            FILTERS={filtersObj}
            setChanged={setChanged}
            elementType={elementType}
          />
        </div>
      )}
       {!isDesktop && (
        <FloatingView>
          <TbArrowBack
            style={{ height: "28px", width: "28px" }}
            cursor={"pointer"}
            onClick={(e) => props.setShowDrawer(false)}
          />
        </FloatingView>
      )}
    </>
  );
};

export default AddPoi;