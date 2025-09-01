import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import media from "../../../media";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import CheckboxFormComponent from "../../../FormComponents/CheckboxFormComponent";
import StarCategory from "./StarCategory";
import PriceRange from "./PriceRange";
import Travelers from "./Travelers";
import { useDispatch } from "react-redux";
import { setItineraryFilters } from "../../../../store/actions/setItineraryFilters";
import Filters from "./Filters";

const SortContainer = styled.div`
  position: absolute;
  z-index:20;
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
  const [refundable, setRefundable] = useState(false);
  const [freeBreakfast, setFreeBreakfast] = useState(true);
  const [budget, setBudget] = useState([
    props.filtersState.budget.price_lower_range,
    props.filtersState.budget.price_upper_range,
  ]);
  const [sortShow, setSortShow] = useState(false);
  const dispatch = useDispatch();
  const filtersRef = useRef(null);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (filtersRef.current && !filtersRef.current.contains(event.target)) {
  //       props?.setShowFilters(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);


  useEffect(() => {
    if (
      props.filtersState.star_category === null &&
      selectedStarCategory.length === 0
    ) {
      return;
    }

    let handler;
    if (props.filtersState.star_category !== selectedStarCategory) {
      handler = setTimeout(() => {
        props._updateStarFilterHandler(selectedStarCategory);
      }, 2000);
    }

    return () => {
      clearTimeout(handler);
    };
  }, [selectedStarCategory]);

  const handleRefundable = () => {
    dispatch(
      setItineraryFilters({
        is_refundable: !refundable,
      })
    );
    setRefundable((prev) => !prev);
    props?.handleRefundable();
  };

  const handleFreeBreakfast = () => {
    dispatch(
      setItineraryFilters({
        free_breakfast: !freeBreakfast,
      })
    );
    setFreeBreakfast((prev) => !prev);
    props?.handleFreeBreakfast();
  };

  return (
    <div>
      <React.Fragment key={"bottom"}>
        {isPageWide && (
          <div className="w-[95%] mx-auto mt-4 flex flex-row justify-between gap-3 flex-wrap">
            <div className="w-[50%] flex flex-col gap-3">
              <PriceRange budget={props?.budget} setBudget={props?.setBudget} setFilters={props?.setFilters} handleBudgetChange={props?.handleBudgetChange}/>

              <div className="w-fit flex flex-row gap-5">
                <button
                  onClick={handleRefundable}
                  className="flex flex-row items-center gap-1 cursor-pointer"
                >
                  <CheckboxFormComponent checked={refundable} />
                  Refundable
                </button>

                <button
                  onClick={handleFreeBreakfast}
                  className="flex flex-row items-center gap-1 cursor-pointer"
                >
                  <CheckboxFormComponent checked={freeBreakfast} />
                  Free Breakfast
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-between">
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
            <Travelers filters={props.filters} setFilters={props.setFilters} />
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

            {(
              <div className="relative">
                <button
                  onClick={() => {
                    props.setShowFilters(true);
                  }}
                  className="ml-2 border-2 border-black w-fit px-2 py-1 rounded-full hover:bg-black hover:text-white transition-all"
                >
                  More Filters
                </button>
                {props?.showFilters && (
                  <div
                    // className={`
                    //   z-50 bg-white shadow-2xl drop-shadow-3xl p-[16px] rounded-lg space-y-5 text-sm
                    //   min-[584px]:absolute min-[584px]:top-[calc(100%+8px)] min-[584px]:right-0
                    //   max-[583px]:absolute max-[583px]:bottom-0 max-[583px]:w-full
                    //   ${props?.showFilters ? 'opacity-100' : 'opacity-0'} transition-all
                    // `}
                    ref={filtersRef}
                    key={1}
                  >
                    <Filters
                      showFilter={props?.showFilters}
                      setshowFilter={props?.setShowFilters}
                      filtersState={props?.filtersState}
                      FILTERS={props?.FILTERS}
                      _addFilterHandler={props?._addFilterHandler}
                      updateUserStarHandler={props?.updateUserStarHandler}
                      filters={props?.filters}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </React.Fragment>
    </div>
  );
}
