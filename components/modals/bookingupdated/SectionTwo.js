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

const Container = styled.div`
  margin: 0;
  @media screen and (min-width: 768px) {
  }
`;

const Section = (props) => {
  const [SelectedStar, setSelectedStar] = useState(-1);
  const [selectedUserStar, setSelectedUserStar] = useState(-1);
  const [SelectedBudget, setSelectedBudget] = useState();
  const [refundable, setRefundable] = useState(false)
  const [freeBreakfast, setFreeBreakfast] = useState(true)
  const [budget, setBudget] = useState([props.filtersState.budget.price_lower_range, props.filtersState.budget.price_upper_range])

  const _onChangeHandler = (checked, filter, heading, i) => {
    if (heading == "budget") {
      setSelectedBudget(i);
    }

    if (checked) props._addFilterHandler(filter, heading);
    else props._removeFilterHandler(filter);
  };

  const _OnstarSelect = (i, currentfilter) => {
    if (SelectedStar == i) {
      setSelectedStar(-1);
      props._updateStarFilterHandler("");
      return;
    }
    setSelectedStar(i);
    props._updateStarFilterHandler(currentfilter);
  };

  const onUserStarSelect = (i, currentfilter) => {
    if (selectedUserStar == i) {
      setSelectedUserStar(-1);
      props.updateUserStarHandler("");
      return;
    }
    setSelectedUserStar(i);
    props.updateUserStarHandler(currentfilter);
  }

  const handleSelectOption = (option) => {
    _onChangeHandler(true, option, "type");
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

  const handleBudgetChange = (value) => {
    setBudget(value);

    props.setFiltersState(prev => ({
      ...prev,
      budget: {
        price_lower_range: value[0],
        price_upper_range: value[1]
      }
    }))
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
        booking_city={props.booking_city}
        No_of_stays={props.No_of_stays}
        totalCount={props.TotalCount}
        setFiltersState={props.setFiltersState}
        plan={props?.plan}
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
              <div className="mb-2 text-sm font-normal">Star category</div>
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
              <div className="mb-2 text-sm font-normal">User Ratings</div>
              <div className="flex flex-row gap-1">
                {props.FILTERS["user_ratings"].map((currentfilter, i) => (
                  <button
                    onClick={() => onUserStarSelect(i, currentfilter)}
                    className={`flex font-normal  text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${selectedUserStar == i
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
              <div className="mb-2 text-sm font-normal">Budget</div>

              <div className="w-full flex flex-col gap-1">
                <div className="w-full flex flex-row items-center justify-between">
                  <label className="text-sm font-normal mb-1">₹{budget[0]}</label>
                  <label className="text-sm font-normal mb-1">₹{budget[1]}</label>
                </div>

                <RangeSliderInput
                  defaultValue={budget}
                  value={budget}
                  onChange={handleBudgetChange}
                />
              </div>
            </div>

            <div className="flex flex-col justify-start items-baseline">
              <div className="mb-2 text-sm font-normal">Property type</div>
              <div className="w-[12rem]">
                <UiDropdown
                  options={props.FILTERS["type"]}
                  onSelect={handleSelectOption}
                ></UiDropdown>
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
              onClick={() => props.setshowFilter(false)}
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
