import React from "react";
import styled from "styled-components";
import FiltersMobile from "./filtersmobile/Index";
import Drawer from "../../ui/Drawer";
import { useState } from "react";
import { IoMdClose, IoMdStar } from "react-icons/io";
import UiDropdown from "../../UiDropdown";
import ButtonYellow from "../../ButtonYellow";
import CheckboxFormComponent from "../../FormComponents/CheckboxFormComponent";
import RangeSliderInput from "./filtersmobile/RangeSlider";
import PriceRange from "./filtersmobile/PriceRange";
import Facilities from "./filtersmobile/Facilities";
import PropertyType from "./filtersmobile/PropertyType";

const Container = styled.div`
  margin: 0;
  @media screen and (min-width: 768px) {
  }
`;

const Section = (props) => {
  const [SelectedStar, setSelectedStar] = useState(-1);
  const [selectedUserStar, setSelectedUserStar] = useState([]);
  const [SelectedBudget, setSelectedBudget] = useState();
  const [refundable, setRefundable] = useState(false)
  const [freeBreakfast, setFreeBreakfast] = useState(true)
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [type, setType] = useState(null);

  const _OnstarSelect = (i, currentfilter) => {
    if (SelectedStar == i) {
      setSelectedStar(-1);
      props._updateStarFilterHandler("");
      return;
    }
    setSelectedStar(i);
    props._updateStarFilterHandler(currentfilter);
  };

  const handleSelectOption = (option) => {
    setType(option);
  };

  const handleRefundable = () => {
    setRefundable(prev => !prev);
    props.setFiltersState(prev => ({
      ...prev,
      "is_refundable": !prev["is_refundable"]
    }))
  }

  const handleFreeBreakfast = () => {
    setFreeBreakfast(prev => !prev);
    props.setFiltersState(prev => ({
      ...prev,
      "free_breakfast": !prev["free_breakfast"]
    }))
  }

  const handleUserStar = (star) => {
    if (selectedUserStar.includes(star)) {
      setSelectedUserStar(prev => prev.filter(item => item !== star));
    } else {
      setSelectedUserStar(prev => [...prev, star])
    }
  }

  const isSelectedUserStar = (star) => {
    return selectedUserStar.includes(star);
  }

  const handleApply = () => {
    props.updateUserStarHandler(selectedUserStar);
    props._addFilterHandler(selectedFacilities, "facilities");
    props._addFilterHandler(type, "type");
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
        filters={props.FILTERS}
        booking_city={props.booking_chandleBudgetChangeity}
        No_of_stays={props.No_of_stays}
        totalCount={props.TotalCount}
        setFiltersState={props.setFiltersState}
        plan={props?.plan}
        setShowFilters={props.setShowFilters}
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

            <div className="flex flex-col justify-start items-baseline">
              <div className="mb-2 font-normal">Star category</div>
              <div className="flex flex-row gap-1">
                {props.FILTERS["star_category"].map((currentfilter, i) => (
                  <button
                    onClick={() => _OnstarSelect(i, currentfilter)}
                    className={`flex font-normal  text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${SelectedStar == i
                      ? "text-white border-0 bg-black "
                      : "border-2 bg-white text-black"
                      } active:text-white  border-[#D0D5DD]  rounded-lg px-2 py-1`}
                    key={i}
                  >
                    {currentfilter}
                    <IoMdStar />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-start items-baseline">
              <div className="mb-2 font-normal">User Ratings</div>
              <div className="flex flex-row gap-1">
                {props.FILTERS["user_ratings"].map((star, i) => (
                  <button
                    key={i}
                    onClick={() => handleUserStar(star)}
                    className={`flex font-normal  text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${isSelectedUserStar(star)
                      ? "text-white border-0 bg-black "
                      : "border-2 bg-white text-black"
                      } active:text-white  border-[#D0D5DD]  rounded-lg px-2 py-1`}
                  >
                    {star}
                    <IoMdStar />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-row gap-5">
              <button onClick={handleRefundable} className="flex flex-row items-center gap-1 cursor-pointer">
                <CheckboxFormComponent checked={refundable} />
                Refundable
              </button>

              <button onClick={handleFreeBreakfast} className="flex flex-row items-center gap-1 cursor-pointer">
                <CheckboxFormComponent checked={freeBreakfast} />
                Free Breakfast
              </button>
            </div>

            <PriceRange filtersState={props.filtersState} setFiltersState={props.setFiltersState} />

            {props.FILTERS.type.length ? (
              <PropertyType types={props.FILTERS.type} handleSelectOption={handleSelectOption} />
            ) : null}

            {props.FILTERS.facilities.length ? (
              <Facilities
                facilities={props.FILTERS.facilities}
                selectedFacilities={selectedFacilities}
                setSelectedFacilities={setSelectedFacilities} />
            ) : null}

            {props.FILTERS.tags.length ? (
              <Facilities
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
