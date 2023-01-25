import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
 import Pax from './Pax';
  import Cost from './Cost';
     import ImageLoader from '../../../ImageLoader';
    import Button from '../../../ui/button/Index';
    import urls from '../../../../services/urls';
import { useRouter } from 'next/router';
const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 0.5rem;

`;
const Info = (props) => {
  const router=useRouter();
 const _handleRedirect = () => {
  if(props.PW) router.push('/itinerary/physicswallah/'+props.id);
  else router.push('/itinerary/'+props.id)
 }
    
    return(
        <Container  >
          <Pax number_of_adults={props.number_of_adults}></Pax>
          <Cost PW={props.PW} starting_cost={props.starting_cost}></Cost>
          <div>
            {/* <ImageLoader url={"media/icons/bookings/bookmark-white.png" } leftalign  width="2rem" widthmobile="1.5rem" height="auto" ></ImageLoader> */}
          </div>
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button
            borderWidth="0"
            bgColor="#f7e700"
            borderRadius="10px"
            fontWeight="600"
            fontSize="0.75rem"
            onclick={_handleRedirect}
            >

                {props.PW ? "View Trip"  :"View Itinerary"}
            </Button>
          </div>

        </Container>
    );
}
export default Info;

