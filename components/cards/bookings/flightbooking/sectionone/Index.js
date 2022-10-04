import React from 'react';
import styled from 'styled-components';
import media from '../../../../media';
import ImageLoader from '../../../../ImageLoader';
import Route from './Route';

const Container = styled.div`

display: grid;
grid-template-columns: max-content auto;
grid-column-gap: 0.5rem;
border-style: none none solid none;
border-color: rgba(238, 238, 238, 1);
border-width: 1px;
@media screen and (min-width: 768px){
   
    
}


`;
 
 
const Section= (props) => {
    let isPageWide = media('(min-width: 768px)')
    if(props.data)
    return(
      <Container className='font-opensans'>  
          <div style={{display: 'flex', gap:  '0.5rem', marginRight: '1rem'}}>
                  <div style={{padding:'1rem 0 1rem 0.5rem'}}><ImageLoader url="media/icons/bookings/airplane-ticket (1).png" leftalign dimensions={{width: 200, height: 200}} width="2.5rem" widthmobile="2.5rem" ></ImageLoader></div>
              <Route data={props.data}></Route>
              </div>
            <div className="center-div text-center" style={{ padding: '1rem 0.5rem', borderColor: 'rgba(238, 238, 238, 1)', borderWidth: '1px', borderStyle: 'none none none solid'}}>
              {/* <ImageLoader url="media/icons/bookings/calendar (2).png" leftalign dimensions={{width: 200, height: 200}} width="1.5rem" widthmobile="1.5rem" ></ImageLoader> */}
              <p style={{margin: '0', fontSize: '15px', fontWeight: '700'}} className="font-opensans text-center">Day 2</p>
            </div>
      </Container>
  ); 
  else return null;
}

export default Section;
