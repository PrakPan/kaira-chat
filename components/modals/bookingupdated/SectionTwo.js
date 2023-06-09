import React from 'react';
import styled from 'styled-components';
// import media from '../../media';
import FiltersMobile from './filtersmobile/Index';
import Drawer from '../../ui/Drawer';
import { useState } from 'react';
import { IoMdClose, IoMdStar } from 'react-icons/io';
import UiDropdown from '../../UiDropdown';
import ButtonYellow from '../../ButtonYellow';

const Container = styled.div`
  margin: 0;
  @media screen and (min-width: 768px) {
  }
`;

const Section = (props) => {
  const [SelectedStar, setSelectedStar] = useState();
  const [SelectedBudget, setSelectedBudget] = useState();
  // let isPageWide = media('(min-width: 768px)')
  const _selectFilter = (event, filter) => {
    if (filter === 0) setFilterHeading('Budget');
    else if (filter === 1) setFilterHeading('Type');
    // else setFilterHeading('Star Category');
    setFilterSelected(filter);
    setState(true);
  };
  const _onChangeHandler = (checked, filter, heading, i) => {
    if (heading == 'budget') {
      setSelectedBudget(i);
    }

    if (checked) props._addFilterHandler(filter, heading);
    else props._removeFilterHandler(filter, heading);
  };
  const _OnstarSelect = ({ i, currentfilter }) => {
    setSelectedStar(i);
    props._updateStarFilterHandler(currentfilter, currentfilter + 1);
  };
  const handleSelectOption = (option) => {
    console.log('Selected option:', option);
    // Perform additional actions with the selected option
    _onChangeHandler(true, option, 'type');
  };
  return (
    <Container className="font-lexend">
      <FiltersMobile
        showFilter={props.showFilter}
        setshowFilter={props.setshowFilter}
        filtersState={props.filtersState}
        _updateStarFilterHandler={props._updateStarFilterHandler}
        _removeFilterHandler={props._removeFilterHandler}
        _addFilterHandler={props._addFilterHandler}
        filters={props.FILTERS}
        booking_city={props.booking_city}
      ></FiltersMobile>
      <Drawer
        show={props.showFilter}
        anchor={'right'}
        backdrop
        style={{ zIndex: 1508 }}
        className="font-lexend"
        onHide={() => props.setshowFilter(false)}
      >
        <div className="w-[100vw] px-2 h-[95vh]    flex flex-col gap-3 my-4 justify-between items-start mx-auto ">
          <div className="flex lg:flex-row lg:gap-0 gap-3 flex-col justify-between w-[95%] mx-auto mt-4">
            <div className="flex flex-row gap-3 my-0 justify-start items-center">
              <IoMdClose
                onClick={() => props.setshowFilter(false)}
                className="hover-pointer"
                style={{
                  fontSize: '1.75rem',
                  textAlign: 'right',
                }}
              ></IoMdClose>
              <div className="text-2xl font-normal line-clamp-1">Filters</div>
            </div>
            <div className="flex flex-col justify-start items-baseline">
              <div className="mb-2 text-sm font-normal">Stars ratings</div>
              <div className="flex flex-row gap-1">
                {props.FILTERS['star_category'].map((currentfilter, i) => (
                  <button
                    onClick={() => _OnstarSelect(i, currentfilter)}
                    className={`flex font-normal  text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${
                      SelectedStar == i
                        ? 'text-white border-0 bg-black '
                        : 'border-2 bg-white text-black'
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
                {props.FILTERS['budget'].map((currentfilter, i) => (
                  <button
                    onClick={(event) =>
                      _onChangeHandler(
                        event.target.textContent,
                        currentfilter,
                        'budget',
                        i
                      )
                    }
                    className={`flex font-normal  text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${
                      SelectedBudget == i
                        ? 'text-white border-0 bg-black '
                        : 'border-2 bg-white text-black'
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
                  options={props.FILTERS['type']}
                  onSelect={handleSelectOption}
                ></UiDropdown>
              </div>
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
              // onClick={() => {
              //   handleClickAc(index, booking);
              // }}
            >
              <div
                onClick={() => props.setshowFilter(false)}
                className="text-[#01202B] "
              >
                Apply
              </div>
            </ButtonYellow>
          </div>
        </div>
      </Drawer>
    </Container>
  );
};

export default Section;
