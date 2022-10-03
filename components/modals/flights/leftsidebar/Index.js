import React from 'react';
import styled from 'styled-components'
import CurrentlyReplacing from './CurrentlyReplacing';
import media from '../../../media';
const Container  = styled.div`

`;
const GreyContainer = styled.div`
    @media screen and (min-width: 768px) {
        background-color: hsl(0,0%,95%);
        border-radius: 5px;
        padding: 0.5rem;
        max-height: 60vh;
        
        overflow-y: scroll;
        
    }
`
const LeftSideBar = (props) =>{
    let isPageWide = media('(min-width: 768px)')
 
    return(
        <Container>
            {/* <AcordionFilters></AcordionFilters> */}
            {isPageWide? <CurrentlyReplacing selectedBooking={props.selectedBooking} setHideBookingModal={props.setHideBookingModal} replacing={props.replacing}></CurrentlyReplacing>: null}
            {/* {isPageWide ? <hr/> : null} */}
            {/* {isPageWide ? <GreyContainer>
                <Heading heading="Star Category"></Heading>
                <Slider _updateStarFilterHandler={props._updateStarFilterHandler}></Slider>
            <Heading heading="Budget"></Heading>
            <Filters _removeFilterHandler={props._removeFilterHandler} _addFilterHandler={props._addFilterHandler} heading="budget" filters={props.filters.budget} ></Filters>
            <Heading heading="Type"></Heading>
            <Types  _removeFilterHandler={props._removeFilterHandler} _addFilterHandler={props._addFilterHandler}  filtersState={props.filtersState} filters={props.filters.type}></Types>
            </GreyContainer> : null} */}
        </Container>
    );
}

export default LeftSideBar;