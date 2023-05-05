import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons';

// import Button from '../../../components/Button';
import Button from '../../../components/ui/button/Index';

import Menu from './Menu';
import MenuButton from './MenuButton';

const Banner = (props) => {
  const [heading, setHeading] = useState('Overview');
  useEffect(() => {
    window.addEventListener('scroll', _handleScroll);
    return () => {
      window.removeEventListener('scroll', _handleScroll);
    };
  });
  const _handleScroll = () => {
    if (props.offsets)
      if (window.pageYOffset > 350) {
        if (
          props.offsets['Overview'] - window.pageYOffset <= 65 &&
          props.offsets['Overview'] - window.pageYOffset > 0
        ) {
          if (heading !== 'Overview') setHeading('Overview');
        } else if (
          props.offsets['Route'] - window.pageYOffset <= 65 &&
          props.offsets['Route'] - window.pageYOffset > 0
        ) {
          // if(heading !== 'Route') setHeading('Route')

          if (heading !== 'Survival Tips & Tricks')
            setHeading('Survival Tips & Tricks');
        } else if (
          props.offsets['How to reach'] - window.pageYOffset <= 65 &&
          props.offsets['How to reach'] - window.pageYOffset > 0
        ) {
          if (heading !== 'Folklore or Story') setHeading('Folklore or Story');
        } else if (
          props.offsets['Inclusions'] - window.pageYOffset <= 65 &&
          props.offsets['Inclusions'] - window.pageYOffset > 0
        ) {
          if (heading !== 'What to Eat') setHeading('What to Eat');
        } else if (
          props.offsets['Exclusions'] - window.pageYOffset <= 65 &&
          props.offsets['Exclusions'] - window.pageYOffset > 0
        ) {
          if (heading !== 'Getting Around') setHeading('Getting Around');
        } else if (
          props.offsets['Things to Do'] - window.pageYOffset <= 65 &&
          props.offsets['Things to Do'] - window.pageYOffset > 0
        ) {
          if (heading !== 'Things to Do') setHeading('Things to Do');
        }
      }
  };

  const [anchorEl, setAnchorEl] = React.useState(false);
  const handleMenuClick = (event) => {
    setAnchorEl(!anchorEl);
  };

  const handleClose = () => {
    setAnchorEl(false);
  };
  const FixedContainer = styled.div`
    width: 100vw;
    position: fixed;
    bottom: 0;
    height: max-content;
    z-index: 2200;
  `;
  const Container = styled.div`
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: black;
  `;
  const BookingContainer = styled.div``;
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
  return (
    <FixedContainer
      style={{ display: props.experienceLoaded ? 'initial' : 'none' }}
    >
      {anchorEl ? (
        <Menu locations={props.locations} hideMenu={handleClose} />
      ) : null}
      <Container className="border">
        <div>
          {/* <FontAwesomeIcon icon={faSortUp} style={{margin: "0"}}/> */}
          <MenuButton handleClick={handleMenuClick}></MenuButton>
          <NavigationHeading className="font-lexend">
            {heading}
          </NavigationHeading>
        </div>
        <div>
          {/* <StartingFrom className="font-lexend">Starting from</StartingFrom> */}
          {/* <Price className="font-lexend"><FontAwesomeIcon icon={faRupeeSign}/>{props.payment  ? props.payment.payment_info[0].base_price/100+' /-' : '/-'}</Price> */}
        </div>
        <div>
          {/* <Button borderRadius="5px" borderWidth="0px" bgColor="#F7e700" color="black" padding="0.5rem 1rem" margin="0.5rem 0" onclick={props.openBooking}>Start Planning</Button> */}
          <Button
            boxShadow
            borderRadius="5px"
            borderWidth="0px"
            bgColor="#F7e700"
            color="black"
            padding="0.5rem 1rem"
            margin="0.5rem 0"
            onclick={props.openBooking}
          >
            Start Planning
          </Button>
        </div>
      </Container>
    </FixedContainer>
  );
};

export default React.memo(Banner);
