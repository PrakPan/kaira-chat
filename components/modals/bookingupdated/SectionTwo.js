import React from "react";
import Image from "next/image";
import FiltersMobile from "./filtersmobile/Index";
import Drawer from "../../ui/Drawer";
import { useState } from "react";
import CheckboxFormComponent from "../../FormComponents/CheckboxFormComponent";
import PriceRange from "./filtersmobile/PriceRange";
import Facilities from "./filtersmobile/Facilities";
import PropertyType from "./filtersmobile/PropertyType";
import Tags from "./filtersmobile/Tags";
import UserRatings from "./filtersmobile/UserRatings";
import StarCategory from "./filtersmobile/StarCategory";

const Section = (props) => {
 const [selectedStarCategory, setSelectedStarCategory] = useState(null);
  const [selectedUserStar, setSelectedUserStar] = useState([]);
  const [refundable, setRefundable] = useState(false)
  const [freeBreakfast, setFreeBreakfast] = useState(false)
  const [selectedFacilities, setSelectedFacilities] = useState(props?.filters?.facilities);
  const [selectedTags, setSelectedTags] = useState(props?.facilities?.tags);
  const [budget, setBudget] = useState([props.filters.budget.price_lower_range, props.filters.budget.price_upper_range])
  const [selectedTypes, setSelectedTypes] = useState(props?.filters?.type);
  const handleBudgetChange = () => {
    props.setFilters((prev)=>({
      ...prev,
      budget:{
        price_lower_range:budget[0],
        price_upper_range:budget[1]
      },
      applyFilter:!props.filters.applyFilter
    }))
  }

  const handleRefundable = () => {
    props.setFilters((prev)=>({
      ...prev,
      "is_refundable": refundable,
      applyFilter:!props.filters.applyFilter
    }))
  }

  const handleFreeBreakfast = () => {
    props.setFilters((prev)=>({
      ...prev,
      free_breakfast: freeBreakfast,
      applyFilter:!props.filters.applyFilter
    }))
  }

  const handleApply = () => {
    props._updateStarFilterHandler(selectedStarCategory);
    props.updateUserStarHandler(selectedUserStar);
    props._addFilterHandler(selectedFacilities, "facilities");
    props._addFilterHandler(selectedTags, "tags");
    props._addFilterHandler(selectedTypes, "type");
    handleRefundable();
    handleFreeBreakfast();
    handleBudgetChange();
    props.setshowFilter(false)
  }

  return (
    <div>
      <FiltersMobile
        loading={props.loading}
        showFilter={props.showFilter}
        setshowFilter={props.setshowFilter}
        filtersState={props.filtersState}
        _updateStarFilterHandler={props._updateStarFilterHandler}
        updateUserStarHandler={props.updateUserStarHandler}
        _removeFilterHandler={props._removeFilterHandler}
        _addFilterHandler={props._addFilterHandler}
        FILTERS={props.FILTERS}
        booking_city={props.booking_city}
        No_of_stays={props.No_of_stays}
        totalCount={props.TotalCount}
        plan={props?.plan && props?.plan?.length ? props?.plan[0]: null}
        setShowFilters={props.setShowFilters}
        showFilters={props.showFilters}
        filters={props.filters}
        setFilters={props.setFilters}
        handleFreeBreakfast={handleFreeBreakfast}
        handleRefundable={handleRefundable}
        handleBudgetChange={handleBudgetChange}
        budget={budget}
        setBudget={setBudget}
        freeBreakfast={freeBreakfast}
        setFreeBreakfast={setFreeBreakfast}
        ></FiltersMobile>

      <Drawer
        show={props.showFilter}
        anchor={"right"}
        backdrop
        width="50%"
        mobileWidth="100%"
        bgColor="#fafaf5"
        style={{ zIndex: props.zIndex ?? 1700 }}
        className="!overflow-y-hidden"
        onHide={() => props.setshowFilter(false)}
      >
        <div className="h-screen flex flex-col overflow-hidden">
          <div className="py-4 bg-[#fafaf5] z-[900] flex flex-col gap-3 pb-2 sticky top-0 px-6 max-ph:px-4">
            <Image
              src="/backarrow.svg"
              className="cursor-pointer"
              width={22}
              height={2}
              alt="back"
              onClick={() => props.setshowFilter(false)}
            />
            <div className="ttw-type-h2 font-semibold line-clamp-1 text-[#0b1220]">Filters</div>
          </div>
          <div className="overflow-y-scroll flex-1 px-6 max-ph:px-4 pb-24 flex flex-col gap-3">
            <div className="flex flex-col gap-3 w-full">


            <StarCategory
              starCategory={props.FILTERS.star_category}
              selectedStarCategory={selectedStarCategory}
              setSelectedStarCategory={setSelectedStarCategory}
            />

            <UserRatings
              userRatings={props.FILTERS.user_ratings}
              selectedUserStar={selectedUserStar}
              setSelectedUserStar={setSelectedUserStar}
            />

            <div className="flex flex-row gap-5 max-ph:flex-col max-ph:gap-2">
              <button onClick={() => setRefundable(prev => !prev)} className="flex flex-row items-center gap-1 cursor-pointer">
                <CheckboxFormComponent checked={refundable} />
                <span className="ttw-type-body text-[#0b1220]">Refundable</span>
              </button>

              <button onClick={() => setFreeBreakfast(prev => !prev)} className="flex flex-row items-center gap-1 cursor-pointer">
                <CheckboxFormComponent checked={freeBreakfast} />
                <span className="ttw-type-body text-[#0b1220]">Free Breakfast</span>
              </button>
            </div>

            <PriceRange
              budget={budget}
              setBudget={setBudget}
            />

            {props.FILTERS.type.length ? (
              <PropertyType types={props.FILTERS.type}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
              />
            ) : null}

            {props.FILTERS.facilities.length ? (
              <Facilities
                facilities={props.FILTERS.facilities}
                selectedFacilities={selectedFacilities}
                setSelectedFacilities={setSelectedFacilities} />
            ) : null}

            {props.FILTERS.tags.length ? (
              <Tags
                tags={props.FILTERS.tags}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags} />
            ) : null}
            </div>
          </div>

          <div className="sticky bottom-0 z-10 border-t border-[#ececec] px-6 max-ph:px-4 py-4 bg-[#fafaf5] w-full flex gap-3 flex-row justify-between">
            <button
              className="ttw-btn-secondary w-1/2 whitespace-nowrap ttw-type-body"
              onClick={() => props.setshowFilter(false)}
            >
              Cancel
            </button>
            <button
              className="w-1/2 bg-[#f7e700] text-black font-500 ttw-type-body py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Section;
