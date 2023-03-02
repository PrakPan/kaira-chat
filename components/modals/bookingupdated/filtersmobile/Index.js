import  React, {useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Pannel from './Pannel';
import styled from 'styled-components'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
 import media from '../../../media';
const FiltersContainer  = styled.div`
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
      {value === index && (
          <div>{children}</div>
       
      )}
    </div>
  );
}

export default function TemporaryDrawer(props) {

  let isPageWide = media('(min-width: 768px)')

  const [state, setState] = React.useState(false);
  const [filterSelected, setFilterSelected] = useState(null);
    const [filterHeading, setFilterHeading] = useState('Budget');

  const _selectFilter = (event, filter) => {
          if(filter === 0) setFilterHeading('Budget')
        else if(filter === 1) setFilterHeading('Type');
        // else setFilterHeading('Star Category');
       setFilterSelected(filter);
        setState(true);
  }

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState( open );
  };

 const _closePannel = () => {
      setState(false);
 }
 const _handleChange = (event, value) => {
  }
  return (
    <div>
        <React.Fragment key={'bottom'}>
            {/* <FiltersContainer>
                <Filter onClick={toggleDrawer(true)} className='border-thin font-opensans center-div text-center'>Budget</Filter>
                <Filter onClick={toggleDrawer(true)} className='border-thin font-opensans center-div text-center'>Type</Filter>
                <Filter onClick={toggleDrawer(true)} className='border-thin font-opensans center-div text-center'>User Rating</Filter>
                <Filter onClick={toggleDrawer(true)} className='border-thin font-opensans center-div text-center'>Star Category</Filter>

            </FiltersContainer> */}
             <Tabs
    value={filterSelected}
    onChange={_selectFilter}
    variant={'scrollable'}
    scrollButtons={ true }
    allowScrollButtonsMobile
    indicatorColor="#f7e700"
   className="filters-mobile-tabs"
   id="filter-tab" 
  >
            <Tab  id="filter-budget" key="filter-budget" label={"Budget"} className={"booking-filter-tab font-opensans"}></Tab>
            <Tab  id="filter-type" key="filter-type" label={"Type"} className={"booking-filter-tab font-opensans"}></Tab>
            {/* <Tab  id="filter-starcategory" key="filter-starcategory" label={"Star Rating"} className={"booking-filter-tab font-opensans"}></Tab> */}

  </Tabs>
  {isPageWide && state ? <TabPanel value={filterSelected} index={0} >
            {/* <Rooms data={props.data}></Rooms> */}
            <Pannel filtersState={props.filtersState} _updateStarFilterHandler={props._updateStarFilterHandler} onclose={_closePannel} heading={filterHeading} filterSelected={filterSelected} filters={props.filters}  _removeFilterHandler={props._removeFilterHandler}_addFilterHandler={props._addFilterHandler} ></Pannel>

       </TabPanel> : null}
       {isPageWide && state ? <TabPanel value={filterSelected} index={1} >
            {/* <Rooms data={props.data}></Rooms> */}
            <Pannel filtersState={props.filtersState} _updateStarFilterHandler={props._updateStarFilterHandler} onclose={_closePannel} heading={filterHeading} filterSelected={filterSelected} filters={props.filters}  _removeFilterHandler={props._removeFilterHandler}_addFilterHandler={props._addFilterHandler} ></Pannel>

       </TabPanel> : null}
       {isPageWide && state? <TabPanel value={filterSelected} index={2} >
            {/* <Rooms data={props.data}></Rooms> */}
            <Pannel filtersState={props.filtersState} _updateStarFilterHandler={props._updateStarFilterHandler} onclose={_closePannel} heading={filterHeading} filterSelected={filterSelected} filters={props.filters}  _removeFilterHandler={props._removeFilterHandler}_addFilterHandler={props._addFilterHandler} ></Pannel>

       </TabPanel> : null}
      {!isPageWide  ? <Drawer
          variant='persistant'
            anchor={'bottom'}
            open={state}
            
            onClose={toggleDrawer( false)}
          >
            <Pannel filtersState={props.filtersState} _updateStarFilterHandler={props._updateStarFilterHandler} onclose={_closePannel} heading={filterHeading} filterSelected={filterSelected} filters={props.filters}  _removeFilterHandler={props._removeFilterHandler}_addFilterHandler={props._addFilterHandler} ></Pannel>
          </Drawer> : null  }
        </React.Fragment>
    </div>
  );
}
