import React from "react";
import styled from "styled-components";
import FiltersMobile from "./filtersmobile/Index";
import Drawer from "../../ui/Drawer";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import ButtonYellow from "../../ButtonYellow";
import CheckboxFormComponent from "../../FormComponents/CheckboxFormComponent";
import PriceRange from "./filtersmobile/PriceRange";
import Facilities from "./filtersmobile/Facilities";
import PropertyType from "./filtersmobile/PropertyType";
import Tags from "./filtersmobile/Tags";
import UserRatings from "./filtersmobile/UserRatings";
import StarCategory from "./filtersmobile/StarCategory";

const Container = styled.div`
  margin: 0;
  @media screen and (min-width: 768px) {
  }
`;

const Section = (props) => {
  console.log("filters are:",props?.filters)
  const [selectedStarCategory, setSelectedStarCategory] = useState([]);
  const [selectedUserStar, setSelectedUserStar] = useState([]);
  const [refundable, setRefundable] = useState(false)
  const [freeBreakfast, setFreeBreakfast] = useState(true)
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
      "free_breakfast": freeBreakfast,
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
    <Container className="font-lexend">
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
      ></FiltersMobile>

      <Drawer
        show={props.showFilter}
        anchor={"right"}
        backdrop
        style={{ zIndex: 1508 }}
        className="font-lexend"
        onHide={() => props.setshowFilter(false)}
      >
        <div className="w-[100vw] px-2 h-[98vh] flex flex-col gap-3 justify-between items-start mx-auto ">
          <div className="flex lg:flex-row lg:gap-0 gap-3 flex-col justify-between w-[95%] mx-auto mt-4">
            <div className="flex flex-row gap-3 my-0 justify-start items-center">
              <IoMdClose
                onClick={() => props.setshowFilter(false)}
                className="hover-pointer"
                style={{
                  fontSize: "1.75rem",
                  textAlign: "right",
                }}
              ></IoMdClose>
              <div className="text-2xl font-normal line-clamp-1">Filters</div>
            </div>

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

            <div className="flex flex-row gap-5">
              <button onClick={() => setRefundable(prev => !prev)} className="flex flex-row items-center gap-1 cursor-pointer">
                <CheckboxFormComponent checked={refundable} />
                Refundable
              </button>

              <button onClick={() => setFreeBreakfast(prev => !prev)} className="flex flex-row items-center gap-1 cursor-pointer">
                <CheckboxFormComponent checked={freeBreakfast} />
                Free Breakfast
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

          <div className="w-full flex gap-3 flex-row justify-between mt-0">
            <ButtonYellow
              primary={false}
              className="w-1/2 "
              onClick={() => props.setshowFilter(false)}
            >
              <div className="text-[#01202B] ">Cancel</div>
            </ButtonYellow>
            <ButtonYellow
              className="w-1/2"
              onClick={handleApply}
            >
              <div className="text-[#01202B] ">Apply</div>
            </ButtonYellow>
          </div>
        </div>
      </Drawer>
    </Container>
  );
};

export default Section;
