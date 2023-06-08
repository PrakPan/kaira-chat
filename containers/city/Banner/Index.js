import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
// import Button from '../../../components/Button';
import Button from '../../../components/ui/button/Index';
import Menu from './Menu';
import MenuButton from './MenuButton';

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

const NavigationHeading = styled.p`
  display: inline;
  margin: 0;
`;

const Banner = (props) => {
  const router = useRouter();
  const [heading, setHeading] = useState('Overview');
  useEffect(() => {
    window.addEventListener('scroll', _handleScroll);
    return () => {
      window.removeEventListener('scroll', _handleScroll);
    };
  });
  const _handlePlanning = () => {
    localStorage.setItem('search_city_selected_id', props.data.id);
    localStorage.setItem('search_city_selected_name', props.data.name);
    localStorage.setItem('search_city_selected_parent', props.data.state_name);
    openTailoredModal(router, props.data.id, props.data.name);
  };
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
        <div style={{ display: 'flex' }}>
          {/* <FontAwesomeIcon icon={faSortUp} style={{margin: "0"}}/> */}
          <MenuButton handleClick={handleMenuClick}></MenuButton>
          <NavigationHeading
            className="font-lexend"
            onClick={() => handleMenuClick()}
          >
            {heading}
          </NavigationHeading>
        </div>
        <div>
          {/* <StartingFrom className="font-lexend">Starting from</StartingFrom> */}
          {/* <Price className="font-lexend"><FontAwesomeIcon icon={faRupeeSign}/>{props.payment  ? props.payment.payment_info[0].base_price/100+' /-' : '/-'}</Price> */}
        </div>
        <div>
          {/* <Button  borderRadius="5px" borderWidth="0px" bgColor="#F7e700" color="black" padding="0.5rem 1rem" margin="0.5rem 0" onclick={_handlePlanning}>Start Planning</Button> */}
          <Button
            boxShadow
            borderRadius="5px"
            borderWidth="0px"
            bgColor="#F7e700"
            color="black"
            padding="0.5rem 1rem"
            margin="0.5rem 0"
            onclick={_handlePlanning}
          >
            Start Planning
          </Button>
        </div>
      </Container>
    </FixedContainer>
  );
};

export default React.memo(Banner);
