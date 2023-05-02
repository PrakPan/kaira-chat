import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Pannel from './Pannel';
import styled from 'styled-components';
import { Tabs, Tab } from '@mui/material';

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
export default function TemporaryDrawer(props) {
  const [state, setState] = React.useState(false);
  const [filterSelected, setFilterSelected] = useState(null);
  const [filterHeading, setFilterHeading] = useState('Budget');

  const _selectFilter = (filter) => {
    if (filter === 'filter-budget') setFilterHeading('Budget');
    else if (filter === 'filter-type') setFilterHeading('Type');
    else setFilterHeading('Star Category');
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
  return (
    <div>
      <React.Fragment key={'bottom'}>
        {/* <FiltersContainer>
                <Filter onClick={toggleDrawer(true)} className='border-thin font-lexend center-div text-center'>Budget</Filter>
                <Filter onClick={toggleDrawer(true)} className='border-thin font-lexend center-div text-center'>Type</Filter>
                <Filter onClick={toggleDrawer(true)} className='border-thin font-lexend center-div text-center'>User Rating</Filter>
                <Filter onClick={toggleDrawer(true)} className='border-thin font-lexend center-div text-center'>Star Category</Filter>

            </FiltersContainer> */}
        <Tabs
          value={filterSelected}
          onChange={(event) => _selectFilter(event.target.id)}
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
            label={'Stops'}
            className={'booking-filter-tab font-lexend'}
          ></Tab>
          <Tab
            id="filter-type"
            key="filter-type"
            label={'Airline'}
            className={'booking-filter-tab font-lexend'}
          ></Tab>
          <Tab
            id="filter-starcategory"
            key="filter-starcategory"
            label={'Arrival'}
            className={'booking-filter-tab font-lexend'}
          ></Tab>
        </Tabs>
        <Drawer anchor={'bottom'} open={state} onClose={toggleDrawer(false)}>
          <Pannel
            _updateStarFilterHandler={props._updateStarFilterHandler}
            onclose={_closePannel}
            heading={filterHeading}
            filterSelected={filterSelected}
            filters={props.filters}
            _removeFilterHandler={props._removeFilterHandler}
            _addFilterHandler={props._addFilterHandler}
          ></Pannel>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
