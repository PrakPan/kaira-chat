import React from 'react';
import styled from 'styled-components';
import media from '../../../../media';
import ImageLoader from '../../../../ImageLoader';
import Route from './Route';
import DropDown from './Dropdown';
const Container = styled.div`

display: grid;
grid-template-columns: 9rem auto;
  border-style: none none solid none;
border-color: rgba(238, 238, 238, 1);
border-width: 1px;
@media screen and (min-width: 768px){
   
    
}


`;
 
 
const Section= (props) => {
    let isPageWide = media('(min-width: 768px)')
     if(props.selectedBooking)
    return(
      <Container className='font-opensans'>  
          
          
            <div className="center-dv" style={{ padding: '0.75rem 0.5rem', borderColor: 'rgba(238, 238, 238, 1)', borderWidth: '1px', borderStyle: 'none solid none none'}}>
              {/* <DropDown></DropDown> */}
              <ImageLoader url="media/icons/bookings/car (2).png"   width="5rem" widthmobile="5rem" height="auto" ></ImageLoader>
              <p style={{margin: '0 0rem 0.25rem 0rem', fontSize: '15px', fontWeight: '700'}} className="font-opensans text-center">{props.selectedBooking.taxi_type}</p>

              {/* <p className='text-center font-opensans' style={{fontSize: '13px', margin: '0'}}>Occupancy: 5</p> */}
            </div>
            {/* <div style={{padding:'1rem 0 1rem 0.5rem'}}><ImageLoader url="media/icons/bookings/airplane-ticket (1).png" leftalign dimensions={{width: 200, height: 200}} width="2.5rem" widthmobile="2.5rem" ></ImageLoader></div> */}
              <Route selectedBooking={props.selectedBooking}></Route>
      </Container>
  ); 
  else return null;
}

export default Section;
