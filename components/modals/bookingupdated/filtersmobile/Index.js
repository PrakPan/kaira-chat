import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoMdStar } from "react-icons/io";
import media from "../../../media";
import UiDropdown from "../../../UiDropdown";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import CheckboxFormComponent from "../../../FormComponents/CheckboxFormComponent";
import RangeSliderInput from "./RangeSlider";
import { IoPerson } from "react-icons/io5";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { getIndianPrice } from "../../../../services/getIndianPrice";


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
  const [SelectedSort, setSelectedSort] = useState(props.filters.sort[0]);
  const [refundable, setRefundable] = useState(false)
  const [freeBreakfast, setFreeBreakfast] = useState(true)
  const [budget, setBudget] = useState([props.filtersState.budget.price_lower_range, props.filtersState.budget.price_upper_range])
  const [sortShow, setSortShow] = useState(false);
  const [minPrice, setMinPrice] = useState(props.filtersState.budget.price_lower_range)
  const [maxPrice, setMaxPrice] = useState(props.filtersState.budget.price_upper_range)

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

  const _OnstarSelect = (i, currentfilter) => {
    if (SelectedStar == i) {
      setSelectedStar(-1);
      props._updateStarFilterHandler("");
      return;
    }
    setSelectedStar(i);
    props._updateStarFilterHandler(currentfilter);
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
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  }

  const handleBudgetFocusChange = () => {
    if (!isNaN(parseInt(minPrice)) && !isNaN(parseInt(maxPrice))) {
      const min_price = parseInt(minPrice) < 700 ? 700 : parseInt(minPrice);
      const max_price = parseInt(maxPrice) > 10000 ? 10000 : parseInt(maxPrice);

      setBudget([min_price, max_price])
      setMinPrice(min_price);
      setMaxPrice(max_price);
    } else {
      setMinPrice(budget[0]);
      setMaxPrice(budget[1]);
    }
  }

  return (
    <div>
      <React.Fragment key={"bottom"}>
        {isPageWide && (
          <div className="w-[95%] mx-auto mt-4 flex flex-col gap-3">
            <div className="flex lg:flex-row lg:gap-0 gap-3 flex-col justify-between flex-wrap">
              <div className="flex flex-col justify-start items-baseline">
                <div className="mb-2 font-normal">Star category</div>
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

              <Travelers
                adults={props.plan?.number_of_adults}
                children={props.plan?.number_of_children}
              />

              <div className="w-[30%] flex flex-col justify-start items-baseline">
                <div className="font-normal">Price range</div>
                <div className="text-sm mb-3">per night</div>

                <div className="w-full flex flex-col gap-4">
                  <RangeSliderInput
                    defaultValue={budget}
                    value={budget}
                    onChange={handleBudgetChange}
                  />

                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col items-center gap-1">
                      <label className="text-sm">Minimum</label>
                      <div className="flex flex-row items-center border-2 px-4 py-2 rounded-full">
                        <div>₹</div>
                        <input
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          onBlur={handleBudgetFocusChange}
                          className="text-sm font-normal focus:outline-none min-w-6 max-w-[45px] w-fit"></input>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <label className="text-sm">Maximum</label>
                      <div className="flex flex-row items-center border-2 px-4 py-2 rounded-full">
                        <div>₹</div>
                        <input
                          value={parseInt(maxPrice) === 10000 ? `${maxPrice}+` : maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          onBlur={handleBudgetFocusChange}
                          className="text-sm font-normal focus:outline-none min-w-6 max-w-[50px] w-fit">
                        </input>
                      </div>
                    </div>
                  </div>
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
                className="ml-2 border-2 border-black w-fit px-2 py-1 rounded-full hover:bg-black hover:text-white transition-all">Show more filters</button>
            )}
          </div>
        ) : null}
      </React.Fragment>
    </div>
  );
}

const Travelers = (props) => {
  const [travelers, setTravelers] = useState(1);
  const [rooms, setRooms] = useState([{
    adults: 1,
    children: 0,
    childAges: [],
  }]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let total = 0;
    if (props.adults) total += props.adults;
    if (props.children) total += props.children

    setTravelers(total);
    setRooms([{
      adults: props.adults,
      children: props.children,
      childAges: Array(props.children).fill(null)
    }])
  }, [props.adults, props.children])

  useEffect(() => {
    let total = 0
    for (let room of rooms) {
      total += room.adults;
      total += room.children;
    }

    setTravelers(total);
  }, [rooms])

  const handleAddRoom = () => {
    if (rooms.length < 8) {
      setRooms(prev => (
        [...prev, {
          adults: 1,
          children: 0,
          childAges: [],
        }]
      ))
    }
  }

  const removeRoom = () => {
    setRooms(prev => prev.slice(0, -1));
  }

  return (
    <div className="relative h-fit border-2 flex flex-row items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:border-black">
      <IoPerson onClick={() => setOpen(prev => !prev)} className="text-2xl" />

      <div onClick={() => setOpen(prev => !prev)} className="flex flex-col">
        <div className="text-sm">Travelers</div>
        <div>{travelers} {travelers > 1 ? "travelers" : "traveler"}, {rooms.length} {rooms.length > 1 ? "rooms" : "room"}</div>
      </div>

      {open && (
        <div className="absolute bg-white z-50 left-[50%] top-[65px] -translate-x-[50%] flex flex-col gap-3 drop-shadow-2xl rounded-lg p-4 overflow-auto max-h-[90vh] hide-scrollbar">
          <div className="flex flex-col gap-3">
            {rooms.map((room, index) => (
              <Room key={index} index={index} data={room} setRooms={setRooms} />
            ))}
          </div>

          {rooms.length > 1 && (
            <div className="flex justify-end">
              <button onClick={removeRoom} className="w-fit text-blue rounded-full px-2 py-1 hover:bg-[#ECF4FD] focus:outline-none">Remove room</button>
            </div>
          )}

          <div className="flex justify-end">
            <button onClick={handleAddRoom} className="w-fit text-blue rounded-full px-2 py-1 hover:bg-[#ECF4FD] focus:outline-none">Add another room</button>
          </div>

          <div className="flex justify-end">
            <button onClick={() => setOpen(false)} className="px-3 py-1 bg-[#F7E700] rounded-lg border-2 border-black hover:text-white hover:bg-black transition-all">Modify search</button>
          </div>
        </div>
      )}
    </div>
  );
}

const Room = ({ index, data, setRooms }) => {
  const [adults, setAdults] = useState(data.adults)
  const [children, setChildren] = useState(data.children);
  const [childAges, setChildAges] = useState(data.childAges);


  useEffect(() => {
    setRooms(prev => prev.map((room, i) => i === index ? {
      ...room,
      adults: adults,
      children: children,
      childAges: childAges
    } : room));
  }, [adults, children, childAges])

  const handleAdults = (type) => {
    if (type === "plus" && adults < 14) {
      setAdults(prev => prev + 1);
    } else if (type === 'minus' && adults > 1) {
      setAdults(prev => prev - 1);
    }
  }

  const handleChildren = (type) => {
    if (type === 'plus' && children < 6) {
      setChildren(prev => prev + 1);
      setChildAges(prev => [...prev, null]);
    } else if (type === 'minus' && children >= 1) {
      setChildren(prev => prev - 1);
      setChildAges(prev => prev.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="font-semibold">Room {index + 1}</div>
      <div className="flex flex-row items-center justify-between gap-[100px]">
        <div className="text-sm">Adults</div>
        <div className="flex flex-row items-center gap-2">
          <CiCircleMinus onClick={() => handleAdults('minus')} className="text-2xl" />
          <div>{adults}</div>
          <CiCirclePlus onClick={() => handleAdults('plus')} className="text-2xl" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm">Children</div>
          <div className="flex flex-row items-center gap-2">
            <CiCircleMinus onClick={() => handleChildren('minus')} className="text-2xl" />
            <div>{children}</div>
            <CiCirclePlus onClick={() => handleChildren('plus')} className="text-2xl" />
          </div>
        </div>

        {children ? (
          <div className="flex flex-col gap-2">
            {childAges && childAges.map((age, i) => (
              <ChildAge index={i} child={i + 1} age={age} setChildAges={setChildAges} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const ChildAge = ({ index, child, age, setChildAges }) => {
  const [openAges, setOpenAges] = useState(false);
  const [selectedAge, setSelectedAge] = useState(age);

  useEffect(() => {
    setChildAges(prev => prev.map((age, i) => i === index ? selectedAge : age))
  }, [selectedAge])

  const handleChildAge = (value) => {
    setSelectedAge(value);
    setOpenAges(false);
  }

  return (
    <div className="relative">
      <div onClick={() => setOpenAges(prev => !prev)} className="flex flex-row justify-between text-sm border-1 rounded-lg p-2">
        <div>Child {child} age*</div>
        <div>{selectedAge}</div>
      </div>
      {openAges && (
        <div className="z-50 flex flex-col gap-1 absolute top-10 bg-white w-full border-1 border-black">

          {Array(17).fill(null).map((_, i) => (
            <div
              onClick={() => handleChildAge(i + 1)}
              className="hover:bg-gray-200 p-2">{i + 1}</div>

          ))}
        </div>
      )}
    </div>
  );
}
