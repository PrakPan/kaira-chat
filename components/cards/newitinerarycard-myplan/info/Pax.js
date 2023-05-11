import React from 'react';
import styled from 'styled-components';
   import ImageLoader from '../../../ImageLoader';
     
     
const Container = styled.div`
  display: flex;
  gap: 0.5rem;
  
`;
const PaxText = styled.p`
font-weight: 600;
margin: 0;
font-size: 1.25rem;
line-height: 1;
@media screen and (min-width: 768px){
    font-size: 1rem;
}
`;
const PaxSubtext = styled.p`
    font-weight: 400;
    color: rgba(91, 89, 89, 1);
    margin: 0;
    font-size: 0.75rem;
    @media screen and (min-width: 768px){
        font-size: 0.85rem;

    }

`;
const Pax = (props) => {
  
    return(
        <Container  >
            <ImageLoader url={"media/icons/bookings/user (1).png" } leftalign  width="2rem" widthmobile="2rem" height="auto" ></ImageLoader>
        <div className='font-lexend'>
            <PaxText>{props.number_of_adults}</PaxText>
            <PaxSubtext>Travelers</PaxSubtext>

        </div>
        </Container>
    );
}
export default Pax;

