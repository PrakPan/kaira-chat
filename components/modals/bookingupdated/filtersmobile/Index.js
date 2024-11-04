import React, { useEffect, useState } from "react";
import styled from "styled-components";
import media from "../../../media";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import CheckboxFormComponent from "../../../FormComponents/CheckboxFormComponent";
import StarCategory from "./StarCategory";
import PriceRange from "./PriceRange";
import Travelers from "./Travelers";


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
  const [selectedStarCategory, setSelectedStarCategory] = useState([]);
  const [SelectedSort, setSelectedSort] = useState(props.filters.sort[0]);
  const [refundable, setRefundable] = useState(false)
  const [freeBreakfast, setFreeBreakfast] = useState(true)
  const [budget, setBudget] = useState([props.filtersState.budget.price_lower_range, props.filtersState.budget.price_upper_range])
  const [sortShow, setSortShow] = useState(false);

  useEffect(() => {
    let handler;
    if (props.filtersState.budget.price_lower_range !== budget[0] || props.filtersState.budget.price_upper_range !== budget[1]) {
      handler = setTimeout(() => {
        props.setFiltersState(prev => ({
          ...prev,
          budget: {
            price_lower_range: budget[0],
            price_upper_range: budget[1]
          }
        }))
      }, 2000);
    }

    return () => {
      clearTimeout(handler);
    };
  }, [budget])

  useEffect(() => {
    let handler;
    if (props.filtersState.star_category !== selectedStarCategory) {
      handler = setTimeout(() => {
        props._updateStarFilterHandler(selectedStarCategory);
      }, 2000)
    }

    return () => {
      clearTimeout(handler);
    };
  }, [selectedStarCategory])

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

  return (
    <div>
      <React.Fragment key={"bottom"}>
        {isPageWide && (
          <div className="w-[95%] mx-auto mt-4 flex flex-col gap-3">
            <div className="flex lg:flex-row lg:gap-0 gap-3 flex-col justify-between flex-wrap">
              <PriceRange
                budget={budget}
                setBudget={setBudget}
              />

              <div className="flex flex-col justify-between" >
                <StarCategory
                  starCategory={props.filters.star_category}
                  selectedStarCategory={selectedStarCategory}
                  setSelectedStarCategory={setSelectedStarCategory}
                />

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
            </div>
          </div>
        )}

        <div className="w-fit px-3 mt-4">
          <Travelers
            adults={props.plan?.number_of_adults}
            children={props.plan?.number_of_children}
            setFiltersState={props.setFiltersState}
          />
        </div>

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

            {isPageWide && (
              <button
                onClick={() => props.setShowFilters(true)}
                className="ml-2 border-2 border-black w-fit px-2 py-1 rounded-full hover:bg-black hover:text-white transition-all">More filters</button>
            )}
          </div>
        ) : null}
      </React.Fragment>
    </div>
  );
}
