import React, { useEffect, useState } from "react";
import styled from "styled-components";
import media from "../../../media";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import CheckboxFormComponent from "../../../FormComponents/CheckboxFormComponent";
import StarCategory from "./StarCategory";
import PriceRange from "./PriceRange";
import Travelers from "./Travelers";
import { useDispatch } from "react-redux";
import { setItineraryFilters } from "../../../../store/actions/setItineraryFilters";


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
  const [SelectedSort, setSelectedSort] = useState(props.FILTERS.sort[0]);
  const [refundable, setRefundable] = useState(false)
  const [freeBreakfast, setFreeBreakfast] = useState(true)
  const [budget, setBudget] = useState([props.filtersState.budget.price_lower_range, props.filtersState.budget.price_upper_range])
  const [sortShow, setSortShow] = useState(false);
  const dispatch=useDispatch();

  useEffect(() => {
    let handler;
    if (props.filtersState.budget.price_lower_range !== budget[0] || props.filtersState.budget.price_upper_range !== budget[1]) {
      handler = setTimeout(() => {
        props.setFilters((prev)=>({
          ...prev,
          budget: {
            price_lower_range: budget[0],
            price_upper_range: budget[1]
          },
          applyFilter:!props.filters.applyFilter
        }))
      }, 2000);
    }

    return () => {
      clearTimeout(handler);
    };
  }, [budget])

  useEffect(() => {
    if (props.filtersState.star_category === null && selectedStarCategory.length === 0) {
      return;
    }
    
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
    dispatch(setItineraryFilters({ 
      "is_refundable": !prev["is_refundable"]
    }));
  }

  const handleFreeBreakfast = () => {
    setFreeBreakfast(prev => !prev);
    dispatch(setItineraryFilters({ 
      "free_breakfast": !prev["free_breakfast"]
    }));
  }

  return (
    <div>
      <React.Fragment key={"bottom"}>
        {isPageWide && (
          <div className="w-[95%] mx-auto mt-4 flex flex-row justify-between gap-3 flex-wrap">
            <div className="w-[50%] flex flex-col gap-3">
              <PriceRange
                budget={budget}
                setBudget={setBudget}
              />

              <div className="w-fit flex flex-row gap-5">
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

            <div className="flex flex-col justify-between" >
              <StarCategory
                starCategory={props.FILTERS.star_category}
                selectedStarCategory={selectedStarCategory}
                setSelectedStarCategory={setSelectedStarCategory}
              />

              <Travelers
                filters={props.filters}
                setFilters={props.setFilters}
              />
            </div>
          </div>
        )}

        {!isPageWide && (
          <div className="w-[90%] mx-auto">
            <Travelers
              filters={props.filters}
              setFilters={props.setFilters}
            />
          </div>
        )}

        {!props.loading && props?.totalCount ? (
          <div className="flex flex-row items-center justify-between px-4 mt-3">
            <div className="text-sm font-normal w-[95%] md:w-fit">
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
                    {props.FILTERS["sort"].map((e, i) => (
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

            {isPageWide && (
              <button
                onClick={() => props.setShowFILTERS(true)}
                className="ml-2 border-2 border-black w-fit px-2 py-1 rounded-full hover:bg-black hover:text-white transition-all">More Filters</button>
            )}
          </div>
        ) : null}
      </React.Fragment>
    </div>
  );
}
