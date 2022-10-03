import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faRupeeSign} from '@fortawesome/free-solid-svg-icons';

// import Button from '../../../components/Button';
import Button from '../../../components/ui/button/Index';
import { makeStyles } from '@material-ui/styles';

import Menu from './Menu';
import MenuButton from './MenuButton';
import { Link } from 'react-scroll';
import { useRouter } from 'next/router';
import urls from '../../../services/urls';


const FixedContainer = styled.div`
width: 100vw;
  position: fixed;
  bottom: 0;
  height: max-content;
  z-index: 500;
 
`;
const Container = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: white;
 
  color: black;
  display: grid;
  /* grid-template-columns: 1fr 1fr; */
  /* grid-gap: 0.5rem; */
`;
const BookingContainer = styled.div`


`;
const DownArrow = styled.img`
  width: 16px;
  margin: 0 0.5rem 0 0;
  display: inline;
`;
const NavigationHeading = styled.p`
  display: inline;

`;
const StartingFrom = styled.p`
  font-weight: 300;
  font-size: 0.75rem;
  margin: 0;
`;
const Price = styled.p`
  margin: 0;

`;

const MenuItem = styled.p`
padding: 0.25rem 2rem;
margin: 0;
`;

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

const  Banner = (props) => {
    const router  = useRouter();
    const [heading, setHeading] = useState('Overview');
      useEffect(()=> {
         
            window.addEventListener('scroll', _handleScroll);
             return () => {
            window.removeEventListener('scroll', _handleScroll);
          }
    })
    const _handleScroll = ( ) => {
        if(props.offsets)
        if(window.pageYOffset > 350){
      
                if(props.offsets['Overview'] - window.pageYOffset <= 65 && props.offsets['Overview'] - window.pageYOffset > 0) {
                    if(heading !== 'Overview') setHeading('Overview')
                }
                else if(props.offsets['Route'] -  window.pageYOffset <= 65 && props.offsets['Route'] -  window.pageYOffset > 0){
                    // if(heading !== 'Route') setHeading('Route')
                    if(props.locations.length > 1){
                            if(heading !== 'Route') setHeading('Route')
                    }
                    else{
                        if(heading !== 'Location') setHeading('Location')
                    }
                }
                else if(props.offsets['How to reach'] -  window.pageYOffset <= 65 && props.offsets['How to reach'] -  window.pageYOffset > 0){
                    if(heading !== 'How to reach') setHeading('How to reach')
                }
                else if(props.offsets['Inclusions'] -  window.pageYOffset <= 65 && props.offsets['Inclusions'] -  window.pageYOffset > 0){
                    if(heading !== 'Inclusions') setHeading('Inclusions')
                }
                else if(props.offsets['Exclusions'] -  window.pageYOffset <= 65 && props.offsets['Exclusions'] -  window.pageYOffset >  0){
                    if(heading !== 'Exclusions') setHeading('Exclusions')
                }
                else if(props.offsets['FAQ/s'] -  window.pageYOffset <= 65 && props.offsets['FAQ/s'] -  window.pageYOffset > 0){
                    if(heading !== 'FAQ/s') setHeading('FAQ/s')
                }
        }

    }

  const [anchorEl, setAnchorEl] = React.useState(false);
  const handleMenuClick = (event) => {
    setAnchorEl(!anchorEl);
  };

  const handleClose = () => {
    setAnchorEl(false);
  };

const _handlePersonaliseRedirect = () => {
    router.push('/travel-support');
}
   return( 
    <FixedContainer>
        {anchorEl ? <Menu locations={props.locations} hideMenu={handleClose} /> : null}
    <Container className="border" >
    {/* <div> */}
        {/* <FontAwesomeIcon icon={faSortUp} style={{margin: "0"}}/> */}
        {/* <MenuButton   handleClick={handleMenuClick}></MenuButton> */}
        {/* <Button width="100%" borderRadius="5px" borderWidth="0px" bgColor="#F7e700" color="black" onclick={_handlePersonaliseRedirect}>Personalise</Button> */}
        <Button boxShadow width="100%" borderRadius="5px" borderWidth="0px" bgColor="#F7e700" color="black" onclick={props.openItinerary}>View Itinerary</Button>

    {/* </div>     */}
   
     {/* <div>
            {/* <Button  width="100%" borderRadius="5px" borderWidth="0px" bgColor="#F7e700" color="black" onclick={props.openBooking}>Enquire</Button> */}
            {/* <Button boxShadow width="100%" borderRadius="5px" borderWidth="0px" bgColor="#F7e700" color="black" onclick={props.openBooking}>Enquire</Button> */}
    {/* </div> */} 
    </Container>
    </FixedContainer>
  );

}
 
export default React.memo(Banner);