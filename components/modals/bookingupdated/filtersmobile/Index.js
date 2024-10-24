import React, { useState } from "react";
import styled from "styled-components";
import { IoMdStar } from "react-icons/io";
import media from "../../../media";
import UiDropdown from "../../../UiDropdown";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import CheckboxFormComponent from "../../../FormComponents/CheckboxFormComponent";
import RangeSliderInput from "./RangeSlider";

const SortContainer = styled.div`
  position: absolute;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background: white;
  border-radius: 0.5rem;
  left: 0;
  width: max-content;
  padding: 0.5rem;
`;

const SortItem = styled.div`
  text-align: center;
  padding: 0.2rem 0.5rem;
  border-radius: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  :hover {
    background: #f7f3f3;
  }
`;

export default function TemporaryDrawer(props) {
  let isPageWide = media("(min-width: 768px)");
  const [SelectedStar, setSelectedStar] = useState(-1);
  const [selectedUserStar, setSelectedUserStar] = useState(-1);
  const [SelectedBudget, setSelectedBudget] = useState();
  const [SelectedSort, setSelectedSort] = useState(props.filters.sort[0]);
  const [refundable, setRefundable] = useState(false)
  const [freeBreakfast, setFreeBreakfast] = useState(true)
  const [budget, setBudget] = useState([props.filtersState.budget.price_lower_range, props.filtersState.budget.price_upper_range])
  const [sortShow, setSortShow] = useState(false);

  const _onChangeHandler = (checked, filter, heading, i) => {
    if (heading == "budget") {
      if (SelectedBudget == i) {
        props._removeFilterHandler(heading);
        setSelectedBudget(-1);
        return;
      }
      setSelectedBudget(i);
    }
    if (checked) props._addFilterHandler(filter, heading);
    else props._removeFilterHandler(heading);
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
    if (option == "All") return _onChangeHandler(true, "", "type");

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
    <div>
      <React.Fragment key={"bottom"}>
        {isPageWide && (
          <div className="w-[95%] mx-auto mt-4 flex flex-col gap-3">
            <div className="flex lg:flex-row lg:gap-0 gap-3 flex-col justify-between flex-wrap">
              <div className="flex flex-col justify-start items-baseline">
                <div className="mb-2 text-sm font-normal">Star category</div>
                <div className="flex flex-row gap-1">
                  {props.filters["star_category"].map((currentfilter, i) => (
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
                  {props.filters["user_ratings"].map((currentfilter, i) => (
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

              <div className="w-[30%] flex flex-col justify-start items-baseline">
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
                    options={["All", ...props.filters["type"]]}
                    onSelect={handleSelectOption}
                  ></UiDropdown>
                </div>
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
        )}

        {props?.plan && props.plan?.number_of_adults ? (
          <div className="mx-[20px] md:mx-[25px] mt-3">
            <span className="font-bold">Pax: </span>{props.plan?.number_of_adults}{props.plan?.number_of_adults > 1 ? " adults" : " adult"}
            {props.plan?.number_of_children ? `, ${props.plan?.number_of_children} children` : null}
          </div>
        ) : null}

        {!props.loading && props?.totalCount ? (
          <div className="text-sm font-normal w-[95%] ml-5 mt-3">
            Showing {props?.No_of_stays ? `${props.No_of_stays} ` : null}
            stays in {props.booking_city} {isPageWide ? "|" : <br />} Sort by:{" "}
            <div
              style={{
                display: "inline",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => {
                setSortShow(!sortShow);
              }}
            >
              <b>
                {SelectedSort}
                {sortShow ? (
                  <FiChevronUp
                    style={{
                      display: "inline",
                      fontWeight: 900,
                      fontSize: "1.2rem",
                    }}
                  />
                ) : (
                  <FiChevronDown
                    style={{
                      display: "inline",
                      fontWeight: 900,
                      fontSize: "1.2rem",
                    }}
                  />
                )}
              </b>
              {sortShow ? (
                <SortContainer>
                  {props.filters["sort"].map((e, i) => (
                    <SortItem
                      key={i}
                      onClick={() => {
                        setSelectedSort(e);
                        props._addFilterHandler(e.toLowerCase(), "sort");
                      }}
                      selected={e === SelectedSort}
                    >
                      {e}
                    </SortItem>
                  ))}
                </SortContainer>
              ) : (
                <></>
              )}
            </div>
          </div>
        ) : null}
      </React.Fragment>
    </div>
  );
}
