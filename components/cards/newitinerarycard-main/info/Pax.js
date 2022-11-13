import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
   import ImageLoader from '../../../ImageLoader';
     
     
const Container = styled.div`
  display: flex;
  gap: 0.5rem;
`;
const Pax = (props) => {
  
 
    
    return(
        <Container  >
            <ImageLoader url={"media/icons/bookings/user (1).png" } leftalign  width="2rem" widthmobile="2rem" height="auto" ></ImageLoader>
        <div className='font-opensans'>
            <p style={{fontWeight: '600', margin: '0', fontSize: '1.5rem', lineHeight: '1'}}>4</p>
            <p style={{fontWeight: '300',  color:  'rgba(91, 89, 89, 1)',  margin: '0'}}>Travelers</p>

        </div>
        </Container>
    );
}
export default Pax;

