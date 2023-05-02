import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons';

// import Button from '../../../components/Button';
import Button from '../../../components/ui/button/Index';
import { makeStyles } from '@mui/styles';

import Menu from './Menu';
import MenuButton from './MenuButton';
const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

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
        if (props.data.short_description) {
          if (
            props.offsets['Overview'] - window.pageYOffset <= 70 &&
            props.offsets['Overview'] - window.pageYOffset > 0
          ) {
            if (heading !== 'Overview') setHeading('Overview');
          }
        }
        if (props.data.pois.length) {
          if (
            props.offsets['Things to do'] - window.pageYOffset <= 70 &&
            props.offsets['Things to do'] - window.pageYOffset > 0
          ) {
            if (heading !== 'Things to do') setHeading('Things to do');
          }
        }
        if (props.data.survival_tips_and_tricks) {
          if (
            props.offsets['Survival Tips & Tricks'] - window.pageYOffset <=
              70 &&
            props.offsets['Survival Tips & Tricks'] - window.pageYOffset > 0
          ) {
            // if(heading !== 'Route') setHeading('Route')
            if (heading !== 'Survival Tips & Tricks')
              setHeading('Survival Tips & Tricks');
          }
        }
        if (props.data.folklore_or_story) {
          if (
            props.offsets['Folklore or Story'] - window.pageYOffset <= 70 &&
            props.offsets['Folklore or Story'] - window.pageYOffset > 0
          ) {
            if (heading !== 'Folklore or Story')
              setHeading('Folklore or Story');
          }
        }
        if (props.data.foods.length) {
          if (
            props.offsets['What to Eat'] - window.pageYOffset <= 70 &&
            props.offsets['What to Eat'] - window.pageYOffset > 0
          ) {
            if (heading !== 'What to Eat') setHeading('What to Eat');
          }
        }
        if (props.data.conveyance_available) {
          if (
            props.offsets['Getting Around'] - window.pageYOffset <= 70 &&
            props.offsets['Getting Around'] - window.pageYOffset > 0
          ) {
            if (heading !== 'Getting Around') setHeading('Getting Around');
          }
        }
        // else if(props.offsets['Things to Do'] -  window.pageYOffset <= 65 && props.offsets['Things to Do'] -  window.pageYOffset > 0){
        //     if(heading !== 'Things to Do') setHeading('Things to Do')
        // }
        if (props.data.experiences.length) {
          if (
            props.offsets['Experiences'] - window.pageYOffset <= 70 &&
            props.offsets['Experiences'] - window.pageYOffset > 0
          ) {
            if (heading !== 'Experinces') setHeading('Experiences');
          }
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
    z-index: 1050;
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
        <Menu
          data={props.data}
          locations={props.locations}
          hideMenu={handleClose}
        />
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
