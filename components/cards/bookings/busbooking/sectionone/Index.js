import React from 'react';
import styled from 'styled-components';
import media from '../../../../media';
import ImageLoader from '../../../../ImageLoader';
import Route from './Route';
import DropDown from './Dropdown';
const Container = styled.div`

display: flex;
  border-style: none none solid none;
border-color: rgba(238, 238, 238, 1);
border-width: 1px;
@media screen and (min-width: 768px){
   
    
}


`;
 
 
const Section= (props) => {

    // let isPageWide = media('(min-width: 768px)')
    if(props.data)
    return(
      <Container className='font-lexend'>  
          
          
            <div className="center-dv" style={{ padding: '1rem', borderColor: 'rgba(238, 238, 238, 1)', borderWidth: '1px', borderStyle: 'none solid none none'}}>
              {/* <DropDown></DropDown> */}
              <p style={{margin: '0',   fontSize: '15px', fontWeight: '700'}} className="font-lexend text-center">{'Bus'}</p>
              <ImageLoader url={props.data.images ? props.data.images.image ? props.data.images.image : "media/icons/bookings/transfers/bus.png" : "media/icons/bookings/transfers/bus.png" }  width="3.5rem" widthmobile="4rem" height="auto" ></ImageLoader>
              {/* <p className='text-center font-lexend' style={{fontSize: '13px', margin: '0'}}>Occupancy: 5</p> */}
            </div>
            {/* <div style={{padding:'1rem 0 1rem 0.5rem'}}><ImageLoader url="media/icons/bookings/airplane-ticket (1).png" leftalign dimensions={{width: 200, height: 200}} width="2.5rem" widthmobile="2.5rem" ></ImageLoader></div> */}
              <Route data={props.data}></Route>
      </Container>
  ); 
  else return null;
}

export default Section;
