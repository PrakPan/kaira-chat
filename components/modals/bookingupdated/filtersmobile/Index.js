import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Pannel from "./Pannel";
import styled from "styled-components";
import { Tabs, Tab } from "@mui/material";
import { IoMdStar } from "react-icons/io";
import media from "../../../media";
import UiDropdown from "../../../UiDropdown";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import DropDown from "../../../ui/DropDown";
const FiltersContainer = styled.div`
  display: flex;
  margin: 0.5rem 0;
`;
const Filter = styled.div`
  border-radius: 2rem;
  padding: 0.25rem 1rem;
  margin-right: 0.25rem;
  font-size: 0.75rem;
`;
const NewFilter = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
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
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

export default function TemporaryDrawer(props) {
  let isPageWide = media("(min-width: 768px)");

  const [state, setState] = React.useState(false);
  const [filterSelected, setFilterSelected] = useState(null);
  const [filterHeading, setFilterHeading] = useState("Budget");
  const [SelectedStar, setSelectedStar] = useState(-1);
  const [SelectedBudget, setSelectedBudget] = useState();
  const [SelectedSort, setSelectedSort] = useState(props.filters.sort[0]);
  const [sortShow, setSortShow] = useState(false);
  const _selectFilter = (event, filter) => {
    if (filter === 0) setFilterHeading("Budget");
    else if (filter === 1) setFilterHeading("Type");
    // else setFilterHeading('Star Category');
    setFilterSelected(filter);
    setState(true);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  const _closePannel = () => {
    setState(false);
  };
  const _handleChange = (event, value) => {};
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
  const handleSelectOption = (option) => {
    if (option == "All") return _onChangeHandler(true, "", "type");

    _onChangeHandler(true, option, "type");
  };
  return (
    <div>
      <React.Fragment key={"bottom"}>
        {isPageWide && (
          <div className="flex lg:flex-row lg:gap-0 gap-3 flex-col justify-between w-[95%] mx-auto mt-4 flex-wrap">
            <div className="flex flex-col justify-start items-baseline">
              <div className="mb-2 text-sm font-normal">Star category</div>
              <div className="flex flex-row gap-1">
                {props.filters["star_category"].map((currentfilter, i) => (
                  <button
                    onClick={() => _OnstarSelect(i, currentfilter)}
                    className={`flex font-normal  text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${
                      SelectedStar == i
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
              <div className="flex flex-row gap-1">
                {props.filters["budget"].map((currentfilter, i) => (
                  <button
                    onClick={(event) =>
                      _onChangeHandler(
                        event.target.textContent,
                        currentfilter,
                        "budget",
                        i
                      )
                    }
                    className={`flex font-normal  text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${
                      SelectedBudget == i
                        ? "text-white border-0 bg-black "
                        : "border-2 bg-white text-black"
                    } active:text-white  border-[#D0D5DD]  rounded-lg px-2 py-1`}
                    key={i}
                  >
                    {currentfilter}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-start items-baseline">
              <div className="mb-2 text-sm font-normal">Type</div>
              <div className="w-[12rem]">
                <UiDropdown
                  options={["All", ...props.filters["type"]]}
                  onSelect={handleSelectOption}
                ></UiDropdown>
              </div>
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
          </div>
        ) : null}
      </React.Fragment>
    </div>
  );
}
