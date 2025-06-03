import React, { useEffect, useRef, useState } from "react";
import { MERCURY_HOST } from "../../../services/constants";
import NewPoiBooking from "../../../containers/newitinerary/itineraryelements/NewPoiBooking";
import useDebounce from "../../../hooks/useDebounce";
import axios from "axios";
import BackArrow from "../../ui/BackArrow";
import DyamicFilters from "../poiDetails/filters/DynamicFilters";
import { IoMdSearch } from "react-icons/io";
import Image from "next/image";
import ChangePoiBooking from "../../../containers/newitinerary/itineraryelements/ChangePoiBooking";

const AddPoi = (props) => {
    console.log("add poi is:",props)
  const elementType = "POI";
  const [selectSearch, setSelectedSearch] = useState("");
  const debouncedSearch = useDebounce(selectSearch);
  const [showDrawwer, setShowDrawer] = useState(false);
  const [startDate, setStartDate] = useState(props?.date);
  const [changed, setChanged] = useState(false);
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
  const calendarRef = useRef(null);

  const [showDynamicfilters, setShowDynamicfilters] = useState(false);
  const [nextUrl, setNextUrl] = useState(null);
  const [options, setOptions] = useState([]);

  const convertToISODate = (dateStr) => {
    if (!dateStr) return;
    const [day, month, year] = dateStr?.split("/");
    return `${year}-${month?.padStart(2, "0")}-${day?.padStart(2, "0")}`;
  };

  const searchHandler = (e) => {
    setSelectedSearch(e.target.value);
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
      console.log("size of result is:", result.length);
      setNextUrl(res?.data?.next);
      setOptions(result);
    } catch (error) {
      console.log("loading poi error:", error);
    }
  };

  const handleClose = () => {
    props?.setShowDrawer(false);
  };
  return (
    <div className="flex flex-col gap-2 p-2">
      <BackArrow handleClick={(e) => props.setShowDrawer(false)} />
      <div className="grid w-full gap-2 min-[583px]:grid-cols-[3fr_1fr]">
        <div className=" flex flex-row items-center relative h-[44px]">
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
            <Image src="/filter.svg" width={20} height={20} alt="Filter Icon" />
            <button>Filters</button>
            {changed && (
              <div className="absolute -right-1 -top-1 h-[20px] w-[20px] rounded-full bg-red-500"></div>
            )}
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
        </div>
      </div>
      <div>
      {options?.map((item) => {
        return item;
      })}
      </div>
    </div>
  );
};

export default AddPoi;
