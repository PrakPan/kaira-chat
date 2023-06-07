import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Pannel from './Pannel';
import styled from 'styled-components';
import { Tabs, Tab } from '@mui/material';
import { IoMdStar } from 'react-icons/io';
import media from '../../../media';
import UiDropdown from '../../../UiDropdown';
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
  let isPageWide = media('(min-width: 768px)');

  const [state, setState] = React.useState(false);
  const [filterSelected, setFilterSelected] = useState(null);
  const [filterHeading, setFilterHeading] = useState('Budget');
  const [SelectedStar, setSelectedStar] = useState();
  const [SelectedBudget, setSelectedBudget] = useState();

  const _selectFilter = (event, filter) => {
    if (filter === 0) setFilterHeading('Budget');
    else if (filter === 1) setFilterHeading('Type');
    // else setFilterHeading('Star Category');
    setFilterSelected(filter);
    setState(true);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
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
    <div>
      <React.Fragment key={'bottom'}>
        {/* <FiltersContainer>
                <Filter onClick={toggleDrawer(true)} className='border-thin font-lexend center-div text-center'>Budget</Filter>
                <Filter onClick={toggleDrawer(true)} className='border-thin font-lexend center-div text-center'>Type</Filter>
                <Filter onClick={toggleDrawer(true)} className='border-thin font-lexend center-div text-center'>User Rating</Filter>
                <Filter onClick={toggleDrawer(true)} className='border-thin font-lexend center-div text-center'>Star Category</Filter>

            </FiltersContainer> */}
        {/* <Tabs
          value={filterSelected}
          onChange={_selectFilter}
          variant={'scrollable'}
          scrollButtons={true}
          allowScrollButtonsMobile
          indicatorColor="#f7e700"
          className="filters-mobile-tabs"
          id="filter-tab"
        >
          <Tab
            id="filter-budget"
            key="filter-budget"
            label={'Budget'}
            className={'booking-filter-tab font-lexend'}
          ></Tab>
          <Tab
            id="filter-type"
            key="filter-type"
            label={'Type'}
            className={'booking-filter-tab font-lexend'}
          ></Tab>
          <Tab  id="filter-starcategory" key="filter-starcategory" label={"Star Rating"} className={"booking-filter-tab font-lexend"}></Tab>
        </Tabs> */}
        <div className="flex flex-row justify-between px-2">
          <div className="flex flex-col justify-start items-baseline">
            <div>User ratings</div>
            <div className="flex flex-row gap-1">
              {props.filters['star_category'].map((currentfilter, i) => (
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
            <div>Budget</div>
            <div className="flex flex-row gap-1">
              {props.filters['budget'].map((currentfilter, i) => (
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
            <div>Type</div>
            <div className="w-[10rem]">
              <UiDropdown
                options={props.filters['type']}
                onSelect={handleSelectOption}
              ></UiDropdown>
            </div>
          </div>
        </div>
        {/* <TabPanel value={filterSelected} index={0}>
          <Rooms data={props.data}></Rooms>
          <Pannel
            filtersState={props.filtersState}
            _updateStarFilterHandler={props._updateStarFilterHandler}
            onclose={_closePannel}
            heading={filterHeading}
            filterSelected={filterSelected}
            filters={props.filters}
            _removeFilterHandler={props._removeFilterHandler}
            _addFilterHandler={props._addFilterHandler}
          ></Pannel>
        </TabPanel>
        <TabPanel value={filterSelected} index={1}>
          <Rooms data={props.data}></Rooms>
          <Pannel
            filtersState={props.filtersState}
            _updateStarFilterHandler={props._updateStarFilterHandler}
            onclose={_closePannel}
            heading={filterHeading}
            filterSelected={filterSelected}
            filters={props.filters}
            _removeFilterHandler={props._removeFilterHandler}
            _addFilterHandler={props._addFilterHandler}
          ></Pannel>
        </TabPanel> */}
        {/* {isPageWide && state ? (
          <TabPanel value={filterSelected} index={1}>
            <Rooms data={props.data}></Rooms>
            <Pannel
              filtersState={props.filtersState}
              _updateStarFilterHandler={props._updateStarFilterHandler}
              onclose={_closePannel}
              heading={filterHeading}
              filterSelected={filterSelected}
              filters={props.filters}
              _removeFilterHandler={props._removeFilterHandler}
              _addFilterHandler={props._addFilterHandler}
            ></Pannel>
          </TabPanel>
        ) : null}
        {isPageWide && state ? (
          <TabPanel value={filterSelected} index={2}>
            <Rooms data={props.data}></Rooms>
            <Pannel
              filtersState={props.filtersState}
              _updateStarFilterHandler={props._updateStarFilterHandler}
              onclose={_closePannel}
              heading={filterHeading}
              filterSelected={filterSelected}
              filters={props.filters}
              _removeFilterHandler={props._removeFilterHandler}
              _addFilterHandler={props._addFilterHandler}
            ></Pannel>
          </TabPanel>
        ) : null}
        {!isPageWide ? (
          <Drawer
            variant="persistant"
            anchor={'bottom'}
            open={state}
            onClose={toggleDrawer(false)}
          >
            <Pannel
              filtersState={props.filtersState}
              _updateStarFilterHandler={props._updateStarFilterHandler}
              onclose={_closePannel}
              heading={filterHeading}
              filterSelected={filterSelected}
              filters={props.filters}
              _removeFilterHandler={props._removeFilterHandler}
              _addFilterHandler={props._addFilterHandler}
            ></Pannel>
          </Drawer>
        ) : null} */}
      </React.Fragment>
    </div>
  );
}
