import React from 'react';
import styled from 'styled-components';
import Accordion from 'react-bootstrap/Accordion';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-scroll';

const Wrapper = styled.div`
  display: none;

  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 100%;
    align-items: center;
    font-size: 1.5rem;
    padding: 5px 10px;
    border: 3px solid #cccccc;
    border-left: none;
    border-right: none;
    background-color: #ffffff;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 500;
  }

  @media screen and (min-width: 1280px) {
    grid-template-columns: 70% 30%;
  }
`;

const AccordionWrapper = styled.div`
  display: block;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 500;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const NavItems = styled.ul`
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: space-evenly;
  flex-flow: column;
  margin: 0;
  background-color: #ffffff;
  font-size: 1.5rem;

  .active {
    font-weight: bold;
  }

  @media screen and (min-width: 768px) {
    flex-flow: row;
  }

  @media screen and (min-width: 1280px) {
    flex-wrap: nowrap;
  }
`;

const NavItem = styled.li`
  font-weight: 'normal';
  margin-bottom: 10px;
  text-align: center;
  cursor: pointer;
  &:hover {
    font-weight: bold;
  }

  @media screen and (min-width: 768px) {
    margin-bottom: 0px;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  & > span {
    font-size: 1.2rem;
  }

  @media screen and (min-width: 768px) {
    margin: auto;
    flex-flow: row;
    justify-content: space-evenly;
    width: 70%;
  }

  @media screen and (min-width: 1280px) {
    width: 100%;
    flex-flow: column;
    justify-content: center;
  }
`;

const Navigation = (props) => {
  const accordionStyle = {
    display: 'grid',
    gridTemplateColumns: '100%',
    rowGap: '20px',
    alignItems: 'center',
    fontSize: '1.5rem',
    padding: '5px 10px',
    border: '3px solid #cccccc',
    borderLeft: 'none',
    borderRight: 'none',
    backgroundColor: '#ffffff',
    margin: '0',
    width: '100%',
  };
  return (
    <>
      <AccordionWrapper>
        <Accordion>
          <Accordion.Toggle
            className='font-nunito'
            variant='link'
            eventKey='0'
            style={accordionStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <div>
                <FontAwesomeIcon icon={faBars} />
              </div>
              <PriceContainer>
                <span>Starting from</span>
                <strong>INR {props.price}/-</strong>
              </PriceContainer>
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey='0'>
            <NavItems>
              <Link
                activeClass='active'
                to='overview'
                spy={true}
                smooth={true}
                duration={500}>
                <NavItem>Overview</NavItem>
              </Link>
              <Link
                activeClass='active'
                to='locations'
                spy={true}
                smooth={true}
                duration={500}>
                <NavItem>Locations</NavItem>
              </Link>
              <Link
                activeClass='active'
                to='itinerary'
                spy={true}
                smooth={true}
                duration={500}>
                <NavItem>Itinerary</NavItem>
              </Link>
              <Link
                activeClass='active'
                to='gallery'
                spy={true}
                smooth={true}
                duration={500}>
                <NavItem>Gallery</NavItem>
              </Link>
              <Link
                activeClass='active'
                to='inclusions'
                spy={true}
                smooth={true}
                duration={500}>
                <NavItem>Inclusions</NavItem>
              </Link>
              <Link
                activeClass='active'
                to='exclusions'
                spy={true}
                smooth={true}
                duration={500}>
                <NavItem>Exclusions</NavItem>
              </Link>
              <Link
                activeClass='active'
                to='terms'
                spy={true}
                smooth={true}
                duration={500}>
                <NavItem>Terms</NavItem>
              </Link>
            </NavItems>
          </Accordion.Collapse>
        </Accordion>
      </AccordionWrapper>
      <Wrapper className='font-nunito'>
        <NavItems>
          <Link
            activeClass='active'
            to='overview'
            spy={true}
            smooth={true}
            duration={500}>
            <NavItem>Overview</NavItem>
          </Link>
          <Link
            activeClass='active'
            to='locations'
            spy={true}
            smooth={true}
            duration={500}>
            <NavItem>Locations</NavItem>
          </Link>
          <Link
            activeClass='active'
            to='itinerary'
            spy={true}
            smooth={true}
            duration={500}>
            <NavItem>Itinerary</NavItem>
          </Link>
          <Link
            activeClass='active'
            to='gallery'
            spy={true}
            smooth={true}
            duration={500}>
            <NavItem>Gallery</NavItem>
          </Link>
          <Link
            activeClass='active'
            to='inclusions'
            spy={true}
            smooth={true}
            duration={500}>
            <NavItem>Inclusions</NavItem>
          </Link>
          <Link
            activeClass='active'
            to='exclusions'
            spy={true}
            smooth={true}
            duration={500}>
            <NavItem>Exclusions</NavItem>
          </Link>
          <Link
            activeClass='active'
            to='terms'
            spy={true}
            smooth={true}
            duration={500}>
            <NavItem>Terms</NavItem>
          </Link>
        </NavItems>
        <PriceContainer>
          <span>Starting from</span>
          <strong>INR {props.price}/-</strong>
        </PriceContainer>
      </Wrapper>
    </>
  );
};

export default Navigation;
